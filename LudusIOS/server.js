const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const axios = require('axios');
const Joi = require('joi');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// CORS configuration for React Native
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps)
    if (!origin) return callback(null, true);
    
    // In production, specify your allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:8081', // React Native Metro bundler
      'exp://192.168.1.100:8081', // Expo development
      // Add your production domains here
    ];
    
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Specific rate limiting for Claude API endpoints
const claudeApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 Claude API calls per minute
  message: {
    error: 'Too many Claude API requests, please slow down.',
    retryAfter: '1 minute'
  }
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Input validation schemas
const sentenceGenerationSchema = Joi.object({
  prompt: Joi.string().required().max(10000),
  max_tokens: Joi.number().integer().min(1).max(4096).default(1000),
  temperature: Joi.number().min(0).max(1).default(0.7),
  system_prompt: Joi.string().max(5000).optional(),
  model: Joi.string().valid('claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229').default('claude-3-5-sonnet-20241022')
});

// Claude API configuration
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY environment variable is required');
  process.exit(1);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Claude API proxy endpoint
app.post('/api/generate-sentence', claudeApiLimiter, async (req, res) => {
  try {
    // Validate input
    const { error, value } = sentenceGenerationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Invalid input',
        details: error.details.map(detail => detail.message)
      });
    }

    const { prompt, max_tokens, temperature, system_prompt, model } = value;

    // Prepare messages for Claude API
    const messages = [
      {
        role: 'user',
        content: prompt
      }
    ];

    // Prepare request payload for Claude API
    const claudeRequestData = {
      model: model,
      max_tokens: max_tokens,
      temperature: temperature,
      messages: messages
    };

    // Add system prompt if provided
    if (system_prompt) {
      claudeRequestData.system = system_prompt;
    }

    // Make request to Claude API
    const claudeResponse = await axios.post(CLAUDE_API_URL, claudeRequestData, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      timeout: 30000 // 30 second timeout
    });

    // Extract the generated text from Claude's response
    const generatedText = claudeResponse.data.content[0]?.text || '';

    // Return successful response
    res.status(200).json({
      success: true,
      data: {
        generated_text: generatedText,
        model_used: model,
        tokens_used: claudeResponse.data.usage || null
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Claude API Error:', error.message);
    
    // Handle different types of errors
    if (error.response) {
      // Claude API returned an error response
      const status = error.response.status;
      const message = error.response.data?.error?.message || 'Claude API error';
      
      if (status === 401) {
        return res.status(500).json({
          error: 'Authentication failed with Claude API',
          message: 'Invalid API key configuration'
        });
      } else if (status === 429) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: 'Too many requests to Claude API'
        });
      } else if (status >= 400 && status < 500) {
        return res.status(400).json({
          error: 'Invalid request to Claude API',
          message: message
        });
      } else {
        return res.status(502).json({
          error: 'Claude API server error',
          message: 'External service temporarily unavailable'
        });
      }
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      return res.status(504).json({
        error: 'Request timeout',
        message: 'Claude API request took too long'
      });
    } else {
      // Network or other errors
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to process request'
      });
    }
  }
});

// Generic Claude API endpoint for custom requests
app.post('/api/claude', claudeApiLimiter, async (req, res) => {
  try {
    // Basic validation for Claude API format
    const schema = Joi.object({
      model: Joi.string().required(),
      max_tokens: Joi.number().integer().min(1).max(4096).required(),
      messages: Joi.array().items(
        Joi.object({
          role: Joi.string().valid('user', 'assistant').required(),
          content: Joi.string().required()
        })
      ).required(),
      temperature: Joi.number().min(0).max(1).optional(),
      system: Joi.string().optional()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Invalid input',
        details: error.details.map(detail => detail.message)
      });
    }

    // Make request to Claude API
    const claudeResponse = await axios.post(CLAUDE_API_URL, value, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      timeout: 30000
    });

    // Return Claude's response
    res.status(200).json({
      success: true,
      data: claudeResponse.data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Claude API Error:', error.message);
    
    if (error.response) {
      const status = error.response.status;
      return res.status(status >= 500 ? 502 : status).json({
        error: 'Claude API error',
        message: error.response.data?.error?.message || 'External API error'
      });
    }
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process request'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Claude Proxy Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;