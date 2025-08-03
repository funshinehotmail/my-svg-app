// AI Service Integration - Real vs Mock
import { realAIService } from './realAIService';
import { mockAIService } from './mockAIService';

// Determine which service to use based on configuration
const useRealAI = import.meta.env.VITE_OPENAI_API_KEY && 
                  import.meta.env.VITE_OPENAI_API_KEY !== 'your_openai_api_key_here';

// Export the active AI service
export const aiService = useRealAI ? realAIService : mockAIService;

// Export both services for testing and fallback
export { realAIService, mockAIService };

// Service status
export const getAIServiceStatus = () => {
  return {
    isRealAI: useRealAI,
    serviceName: useRealAI ? 'OpenAI GPT-4' : 'Mock Service',
    hasApiKey: !!import.meta.env.VITE_OPENAI_API_KEY,
    isConfigured: useRealAI
  };
};

console.log('🤖 AI Service Status:', getAIServiceStatus());
