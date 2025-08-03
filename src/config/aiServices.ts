// AI Service Configuration and Requirements

export interface AIServiceRequirements {
  // Primary AI Service (Required)
  primaryService: {
    provider: 'openai' | 'anthropic' | 'google';
    apiKey: string;
    endpoint: string;
    model: string;
  };
  
  // Secondary Services (Optional but Recommended)
  secondaryServices?: {
    // For specialized visual analysis
    visualAnalysis?: {
      provider: 'google-vision' | 'azure-cognitive';
      apiKey: string;
      endpoint: string;
    };
    
    // For advanced reasoning
    reasoning?: {
      provider: 'anthropic' | 'openai';
      apiKey: string;
      endpoint: string;
      model: string;
    };
  };
}

// Required API Keys and Endpoints
export const AI_SERVICE_ENDPOINTS = {
  
  // OpenAI GPT-4 (Recommended Primary)
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    models: {
      'gpt-4-turbo-preview': 'Most capable for complex analysis',
      'gpt-4': 'Reliable for content understanding',
      'gpt-3.5-turbo': 'Cost-effective for basic analysis'
    },
    requiredHeaders: {
      'Authorization': 'Bearer YOUR_OPENAI_API_KEY',
      'Content-Type': 'application/json'
    },
    pricing: '$0.01-0.03 per 1K tokens',
    capabilities: [
      'Content analysis and extraction',
      'Visualization scoring and recommendations', 
      'Presentation strategy selection',
      'Visual element generation'
    ]
  },

  // Anthropic Claude (Alternative Primary)
  anthropic: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    models: {
      'claude-3-opus-20240229': 'Highest reasoning capability',
      'claude-3-sonnet-20240229': 'Balanced performance/cost',
      'claude-3-haiku-20240307': 'Fast and efficient'
    },
    requiredHeaders: {
      'x-api-key': 'YOUR_ANTHROPIC_API_KEY',
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    pricing: '$0.015-0.075 per 1K tokens',
    capabilities: [
      'Advanced reasoning and analysis',
      'Complex content understanding',
      'Strategic recommendations',
      'Detailed explanations'
    ]
  },

  // Google Gemini (Multimodal Option)
  google: {
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    models: {
      'gemini-pro': 'Text analysis and generation',
      'gemini-pro-vision': 'Multimodal analysis (text + images)'
    },
    requiredHeaders: {
      'Content-Type': 'application/json'
    },
    apiKeyParam: 'key=YOUR_GOOGLE_API_KEY',
    pricing: 'Free tier available, then $0.0005 per 1K tokens',
    capabilities: [
      'Multimodal content analysis',
      'Visual content understanding',
      'Integrated reasoning'
    ]
  }
};

// Service Integration Checklist
export const INTEGRATION_CHECKLIST = {
  
  required: [
    '✅ AI service API key obtained',
    '✅ Endpoint configuration verified', 
    '✅ Authentication headers configured',
    '✅ Rate limiting implemented',
    '✅ Error handling for API failures',
    '✅ Content length validation',
    '✅ Response parsing and validation'
  ],

  recommended: [
    '🔄 Fallback service configured',
    '📊 Usage monitoring and analytics',
    '🔒 API key security (environment variables)',
    '⚡ Response caching for efficiency',
    '🎯 Prompt optimization and A/B testing',
    '📝 Comprehensive logging and debugging',
    '🚦 Circuit breaker for service failures'
  ],

  optional: [
    '🎨 Multiple AI services for comparison',
    '🔍 Specialized vision APIs for image analysis',
    '📈 Custom model fine-tuning',
    '🌐 Multi-language support',
    '🎪 Advanced prompt engineering tools'
  ]
};

// Environment Configuration Template
export const ENV_TEMPLATE = `
# AI Service Configuration
VITE_AI_PRIMARY_SERVICE=openai
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
VITE_GOOGLE_API_KEY=your_google_api_key_here

# Service Settings
VITE_AI_MAX_TOKENS=4000
VITE_AI_TEMPERATURE=0.3
VITE_AI_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_FALLBACK_SERVICE=true
VITE_ENABLE_RESPONSE_CACHING=true
VITE_ENABLE_USAGE_ANALYTICS=false
`;

// Cost Estimation
export const COST_ESTIMATION = {
  
  // Typical usage per analysis
  tokensPerAnalysis: {
    contentExtraction: 1500,
    visualizationScoring: 1000, 
    presentationStrategy: 1200,
    visualGeneration: 2000,
    total: 5700
  },

  // Monthly cost estimates (1000 analyses)
  monthlyCosts: {
    openai: {
      'gpt-4-turbo': '$171 (1000 analyses)',
      'gpt-4': '$114 (1000 analyses)', 
      'gpt-3.5-turbo': '$11.40 (1000 analyses)'
    },
    anthropic: {
      'claude-3-opus': '$427.50 (1000 analyses)',
      'claude-3-sonnet': '$85.50 (1000 analyses)',
      'claude-3-haiku': '$14.25 (1000 analyses)'
    },
    google: {
      'gemini-pro': '$2.85 (1000 analyses)',
      'free-tier': 'Free up to 60 requests/minute'
    }
  }
};
