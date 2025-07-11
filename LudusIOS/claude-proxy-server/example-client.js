/**
 * Example client demonstrating how to use the Claude Proxy Server
 * This is for testing purposes only - use this pattern in your React Native app
 */

const axios = require('axios');

// Configure the base URL (change this to your deployed server URL)
const BASE_URL = 'http://localhost:3000';

class ClaudeClient {
  constructor(baseURL = BASE_URL) {
    this.api = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async healthCheck() {
    try {
      const response = await this.api.get('/health');
      console.log('✅ Server Health:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
      throw error;
    }
  }

  async generateSentence(prompt, options = {}) {
    try {
      const requestData = {
        prompt,
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
        system_prompt: options.systemPrompt,
        model: options.model || 'claude-3-5-sonnet-20241022'
      };

      console.log('🚀 Sending request to generate sentence...');
      const response = await this.api.post('/api/generate-sentence', requestData);
      
      console.log('✅ Sentence generated successfully!');
      return response.data.data.generated_text;
    } catch (error) {
      console.error('❌ Error generating sentence:', error.response?.data || error.message);
      throw error;
    }
  }

  async customClaudeRequest(messages, options = {}) {
    try {
      const requestData = {
        model: options.model || 'claude-3-5-sonnet-20241022',
        max_tokens: options.maxTokens || 1000,
        messages,
        temperature: options.temperature || 0.7,
        system: options.systemPrompt
      };

      console.log('🚀 Sending custom Claude request...');
      const response = await this.api.post('/api/claude', requestData);
      
      console.log('✅ Custom request completed successfully!');
      return response.data.data;
    } catch (error) {
      console.error('❌ Error with custom request:', error.response?.data || error.message);
      throw error;
    }
  }
}

// Example usage
async function runExamples() {
  const client = new ClaudeClient();

  try {
    // 1. Health check
    console.log('\n=== Health Check ===');
    await client.healthCheck();

    // 2. Simple sentence generation
    console.log('\n=== Simple Sentence Generation ===');
    const sentence = await client.generateSentence(
      'Write a creative sentence about artificial intelligence and the future.'
    );
    console.log('Generated sentence:', sentence);

    // 3. Sentence generation with options
    console.log('\n=== Sentence Generation with Options ===');
    const creativeSentence = await client.generateSentence(
      'Describe a futuristic city in one sentence.',
      {
        temperature: 0.9,
        maxTokens: 500,
        systemPrompt: 'You are a science fiction writer with a vivid imagination.'
      }
    );
    console.log('Creative sentence:', creativeSentence);

    // 4. Custom Claude request (conversation format)
    console.log('\n=== Custom Claude Request ===');
    const conversation = await client.customClaudeRequest([
      {
        role: 'user',
        content: 'What are the benefits of using a proxy server for API calls in mobile apps?'
      }
    ], {
      temperature: 0.3,
      maxTokens: 800
    });
    console.log('Claude response:', conversation.content[0].text);

  } catch (error) {
    console.error('❌ Example failed:', error.message);
  }
}

// React Native example (commented out since this is Node.js)
/*
// In your React Native component:
const generateText = async () => {
  try {
    const response = await fetch('https://your-server.railway.app/api/generate-sentence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Write something creative',
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (data.success) {
      setGeneratedText(data.data.generated_text);
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};
*/

// Run examples if this file is executed directly
if (require.main === module) {
  console.log('🧪 Running Claude Proxy Server Examples...');
  console.log('📝 Make sure the server is running on http://localhost:3000');
  
  runExamples()
    .then(() => {
      console.log('\n✅ All examples completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Examples failed:', error.message);
      process.exit(1);
    });
}

module.exports = ClaudeClient;