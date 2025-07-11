# Claude Proxy Server

A production-ready Express.js proxy server for securely handling Claude API calls from React Native applications. This server acts as an intermediary between your mobile app and the Anthropic Claude API, keeping your API keys secure on the server side.

## Features

- 🔒 **Security First**: API keys stored securely on server, never exposed to client
- 🚦 **Rate Limiting**: Built-in rate limiting to prevent abuse
- ✅ **Input Validation**: Comprehensive input validation using Joi
- 🛡️ **Security Headers**: Helmet.js for security headers
- 📱 **React Native Ready**: CORS configured for React Native/Expo
- 📊 **Monitoring**: Health check endpoint and logging
- 🚀 **Production Ready**: Optimized for deployment on Railway, Render, Heroku
- 💨 **Performance**: Compression and caching headers
- 🔄 **Error Handling**: Comprehensive error handling and user-friendly responses

## Quick Start

### 1. Installation

```bash
# Clone or download the server files
cd claude-proxy-server

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Anthropic API key
nano .env
```

Required environment variables:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 3. Get Your Anthropic API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file

### 4. Run the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000` by default.

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and uptime information.

### Generate Sentence
```
POST /api/generate-sentence
```

**Request Body:**
```json
{
  "prompt": "Write a creative sentence about space exploration",
  "max_tokens": 1000,
  "temperature": 0.7,
  "system_prompt": "You are a creative writer",
  "model": "claude-3-5-sonnet-20241022"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "generated_text": "Among the infinite tapestry of stars...",
    "model_used": "claude-3-5-sonnet-20241022",
    "tokens_used": {
      "input_tokens": 15,
      "output_tokens": 42
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Generic Claude API
```
POST /api/claude
```

For advanced use cases, you can send direct Claude API requests:

**Request Body:**
```json
{
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 1000,
  "messages": [
    {
      "role": "user",
      "content": "Hello, Claude!"
    }
  ],
  "temperature": 0.7
}
```

## React Native Integration

### Using Fetch

```javascript
// React Native component example
const generateSentence = async (prompt) => {
  try {
    const response = await fetch('http://localhost:3000/api/generate-sentence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data.generated_text;
    } else {
      throw new Error(data.error || 'Failed to generate sentence');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

### Using Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 30000,
});

const generateSentence = async (prompt) => {
  try {
    const response = await api.post('/api/generate-sentence', {
      prompt,
      max_tokens: 1000,
      temperature: 0.7
    });

    return response.data.data.generated_text;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
};
```

## Deployment

### Railway

1. Connect your GitHub repository to Railway
2. Add environment variables in Railway dashboard:
   - `ANTHROPIC_API_KEY`
   - `NODE_ENV=production`
3. Deploy automatically on push

### Render

1. Create a new Web Service on Render
2. Connect your repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables:
   - `ANTHROPIC_API_KEY`
   - `NODE_ENV=production`

### Heroku

```bash
# Install Heroku CLI and login
heroku create your-app-name

# Set environment variables
heroku config:set ANTHROPIC_API_KEY=your_key_here
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Docker

```dockerfile
# Dockerfile (create this file)
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t claude-proxy .
docker run -p 3000:3000 --env-file .env claude-proxy
```

## Security Features

- **API Key Protection**: Anthropic API key never exposed to client
- **Rate Limiting**: 100 requests per 15 minutes per IP, 20 Claude API calls per minute
- **Input Validation**: All inputs validated with Joi schemas
- **CORS Configuration**: Properly configured for React Native
- **Security Headers**: Helmet.js provides security headers
- **Request Size Limits**: Body parser limited to 10MB
- **Timeout Protection**: 30-second timeout on Claude API calls

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | Yes | - | Your Anthropic API key |
| `PORT` | No | 3000 | Server port |
| `NODE_ENV` | No | development | Environment mode |

### Rate Limiting

Default limits:
- General: 100 requests per 15 minutes per IP
- Claude API: 20 requests per minute per IP

Customize in `server.js`:
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per window
});
```

### CORS Configuration

For production, update the `allowedOrigins` array in `server.js`:
```javascript
const allowedOrigins = [
  'https://yourdomain.com',
  'https://app.yourdomain.com',
  // Add your production domains
];
```

## Error Handling

The server provides detailed error responses:

```json
{
  "error": "Invalid input",
  "details": ["prompt is required"],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

Common error codes:
- `400`: Invalid input or request format
- `429`: Rate limit exceeded
- `500`: Internal server error
- `502`: Claude API error
- `504`: Request timeout

## Monitoring

### Health Check

Monitor server health:
```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

### Logs

The server uses Morgan for HTTP request logging and console logging for errors. In production, consider using a proper logging service like Winston with external log aggregation.

## Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Check your `ANTHROPIC_API_KEY` in `.env`
   - Verify the API key is valid in Anthropic Console

2. **CORS errors in React Native**
   - Ensure your development server URL is in `allowedOrigins`
   - For Expo: check if you're using the correct IP address

3. **Rate limit exceeded**
   - Wait for the rate limit window to reset
   - Implement client-side throttling in your app

4. **Request timeout**
   - Check your internet connection
   - Claude API might be experiencing issues

### Debug Mode

Enable debug logging:
```bash
DEBUG=true npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- [Anthropic Documentation](https://docs.anthropic.com/)
- [Express.js Documentation](https://expressjs.com/)
- Create an issue in this repository for bugs or feature requests

---

**⚠️ Security Note**: Never commit your `.env` file or expose your Anthropic API key. Always use environment variables in production deployments.