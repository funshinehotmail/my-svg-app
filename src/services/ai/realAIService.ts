import type { ContentInput, ContentAnalysis, SmartAnalysisResult } from '../../types';
import { db } from '../../lib/supabase';

// Real AI Service Configuration
interface AIServiceConfig {
  openai: {
    apiKey: string;
    endpoint: string;
    model: string;
  };
  maxTokens: number;
  temperature: number;
  timeout: number;
  enableCaching: boolean;
}

export class RealAIService {
  private config: AIServiceConfig;
  private static instance: RealAIService;

  constructor() {
    this.config = {
      openai: {
        apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4-turbo-preview'
      },
      maxTokens: parseInt(import.meta.env.VITE_AI_MAX_TOKENS) || 4000,
      temperature: parseFloat(import.meta.env.VITE_AI_TEMPERATURE) || 0.3,
      timeout: parseInt(import.meta.env.VITE_AI_TIMEOUT) || 30000,
      enableCaching: import.meta.env.VITE_ENABLE_RESPONSE_CACHING === 'true'
    };

    if (!this.config.openai.apiKey) {
      console.warn('⚠️ OpenAI API key not configured. Add VITE_OPENAI_API_KEY to .env file');
    }
  }

  static getInstance(): RealAIService {
    if (!RealAIService.instance) {
      RealAIService.instance = new RealAIService();
    }
    return RealAIService.instance;
  }

  async analyzeContent(content: ContentInput): Promise<ContentAnalysis> {
    console.log('🔍 Starting real AI content analysis...');
    console.log('📝 Content length:', content.content.length, 'characters');

    if (!this.config.openai.apiKey) {
      console.warn('⚠️ No OpenAI API key - falling back to mock service');
      const { mockAIService } = await import('./mockAIService');
      return mockAIService.analyzeContent(content);
    }

    // Check cache first
    const contentHash = await this.generateContentHash(content);
    if (this.config.enableCaching) {
      const cachedResult = await this.getCachedAnalysis(contentHash);
      if (cachedResult) {
        console.log('✅ Using cached AI analysis');
        return cachedResult;
      }
    }

    try {
      // Step 1: Content Understanding & Extraction
      console.log('📊 Extracting content structure...');
      const extractedData = await this.performContentExtraction(content);

      // Step 2: Visualization Scoring & Recommendations
      console.log('🧠 Performing visualization scoring...');
      const visualizationAnalysis = await this.performVisualizationScoring(content, extractedData);

      // Step 3: Presentation Strategy Selection
      console.log('🎯 Selecting presentation strategy...');
      const presentationStrategy = await this.selectPresentationStrategy(content, extractedData, visualizationAnalysis);

      // Step 4: Generate Visual Elements
      console.log('🎨 Generating visual suggestions...');
      const visualSuggestions = await this.generateVisualSuggestions(content, extractedData, presentationStrategy);

      const analysis: ContentAnalysis = {
        id: `analysis-${Date.now()}`,
        originalContent: content,
        extractedData,
        suggestions: visualSuggestions,
        createdAt: new Date(),
        smartAnalysis: {
          scoring: visualizationAnalysis.scoring,
          approaches: presentationStrategy.approaches,
          recommendations: visualizationAnalysis.recommendations,
          visualSuggestions,
          bestPractices: visualizationAnalysis.bestPractices
        }
      };

      // Cache the result
      if (this.config.enableCaching) {
        await this.cacheAnalysis(contentHash, analysis);
      }

      console.log('🎉 Real AI content analysis complete!');
      return analysis;

    } catch (error) {
      console.error('❌ AI analysis failed:', error);
      console.log('🔄 Falling back to mock service');
      
      // Fallback to mock service
      const { mockAIService } = await import('./mockAIService');
      return mockAIService.analyzeContent(content);
    }
  }

  private async performContentExtraction(content: ContentInput) {
    const prompt = this.buildContentExtractionPrompt(content);
    
    const response = await this.callOpenAI({
      messages: [
        {
          role: 'system',
          content: CONTENT_EXTRACTION_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    return this.parseExtractionResponse(response);
  }

  private async performVisualizationScoring(content: ContentInput, extractedData: any) {
    const prompt = this.buildVisualizationScoringPrompt(content, extractedData);
    
    const response = await this.callOpenAI({
      messages: [
        {
          role: 'system',
          content: VISUALIZATION_SCORING_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 1500
    });

    return this.parseVisualizationResponse(response);
  }

  private async selectPresentationStrategy(content: ContentInput, extractedData: any, visualAnalysis: any) {
    const prompt = this.buildPresentationStrategyPrompt(content, extractedData, visualAnalysis);
    
    const response = await this.callOpenAI({
      messages: [
        {
          role: 'system',
          content: PRESENTATION_STRATEGY_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 2000
    });

    return this.parsePresentationResponse(response);
  }

  private async generateVisualSuggestions(content: ContentInput, extractedData: any, strategy: any) {
    const prompt = this.buildVisualGenerationPrompt(content, extractedData, strategy);
    
    const response = await this.callOpenAI({
      messages: [
        {
          role: 'system',
          content: VISUAL_GENERATION_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 3000
    });

    return this.parseVisualResponse(response);
  }

  private async callOpenAI(params: any) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(this.config.openai.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.openai.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.openai.model,
          ...params
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async generateContentHash(content: ContentInput): Promise<string> {
    const contentString = JSON.stringify({
      content: content.content,
      type: content.type,
      metadata: content.metadata
    });
    
    // Use Web Crypto API for browser-compatible hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(contentString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  }

  private async getCachedAnalysis(contentHash: string): Promise<ContentAnalysis | null> {
    try {
      const { data, error } = await db.aiCache.get(contentHash);
      if (error || !data) return null;
      return data.analysis_result;
    } catch (error) {
      console.warn('Cache read failed:', error);
      return null;
    }
  }

  private async cacheAnalysis(contentHash: string, analysis: ContentAnalysis): Promise<void> {
    try {
      await db.aiCache.set(contentHash, analysis);
    } catch (error) {
      console.warn('Cache write failed:', error);
    }
  }

  // Prompt builders
  private buildContentExtractionPrompt(content: ContentInput): string {
    return `
Analyze this content and extract structured information for visualization:

Content Type: ${content.type}
Content: ${content.content}
${content.metadata ? `Metadata: ${JSON.stringify(content.metadata)}` : ''}

Extract and return JSON with:
1. keyPoints: Array of main ideas and insights
2. dataPoints: Array of numerical data (numbers, percentages, dates, metrics)
3. relationships: Array of connections between concepts
4. sentiment: Overall tone (positive/negative/neutral)
5. complexity: Content complexity level (1-10)
6. categories: Content categories/topics identified

Focus on information that would be valuable for creating visual presentations.
`;
  }

  private buildVisualizationScoringPrompt(content: ContentInput, extractedData: any): string {
    return `
Score this content for visualization potential across 8 dimensions (0-1 scale):

Content Data: ${JSON.stringify(extractedData)}

Score these dimensions:
1. complexity: Simple concepts (0) vs complex relationships (1)
2. dataRichness: Text-heavy (0) vs data/numbers heavy (1)  
3. narrativeFlow: Fragmented (0) vs clear story progression (1)
4. temporalElements: Static (0) vs time-based information (1)
5. quantitativeData: Qualitative (0) vs quantitative focus (1)
6. conceptualDepth: Surface-level (0) vs deep analysis required (1)
7. actionability: Informational (0) vs requires decisions/actions (1)
8. audienceLevel: General audience (0) vs expert/technical (1)

Return JSON with:
- scoring: Object with dimension scores
- recommendations: Array of visualization recommendations
- bestPractices: Array of applicable design principles
`;
  }

  private buildPresentationStrategyPrompt(content: ContentInput, extractedData: any, visualAnalysis: any): string {
    return `
Determine optimal presentation strategy based on analysis:

Visualization Scores: ${JSON.stringify(visualAnalysis.scoring)}
Content Data: ${JSON.stringify(extractedData)}

Recommend:
1. Format type: "short" (1 page), "long" (multiple pages), or "hybrid"
2. Visual approaches: bullet-list, timeline, chart, infographic, process-flow, data-story
3. Estimated pages and complexity
4. Primary and secondary visual types
5. Reasoning for recommendations

Return JSON with:
- approaches: Array of recommended approaches with scores and reasoning
- format: Recommended format type
- estimatedPages: Number of pages needed
- primaryVisualType: Main visualization approach
- secondaryVisualTypes: Supporting approaches
`;
  }

  private buildVisualGenerationPrompt(content: ContentInput, extractedData: any, strategy: any): string {
    return `
Generate specific visual elements for presentation:

Strategy: ${JSON.stringify(strategy)}
Content: ${JSON.stringify(extractedData)}

Create detailed specifications for visual elements including:
1. Element types (text, chart, shape, image)
2. Content for each element
3. Positioning and sizing
4. Styling (colors, fonts, backgrounds)
5. Chart specifications if applicable

Return JSON array of visual suggestions with:
- id: Unique identifier
- title: Suggestion title
- description: Brief description
- visualType: Type of visualization
- elements: Array of visual elements
- confidence: Confidence score (0-1)
- approachData: Detailed approach information
`;
  }

  // Response parsers
  private parseExtractionResponse(response: string) {
    try {
      const parsed = JSON.parse(response);
      return {
        keyPoints: parsed.keyPoints || [],
        dataPoints: parsed.dataPoints || [],
        relationships: parsed.relationships || [],
        sentiment: parsed.sentiment || 'neutral',
        complexity: parsed.complexity || 5,
        categories: parsed.categories || []
      };
    } catch (error) {
      console.warn('Failed to parse extraction response:', error);
      return {
        keyPoints: ['Content analysis available'],
        dataPoints: [],
        relationships: [],
        sentiment: 'neutral',
        complexity: 5,
        categories: ['general']
      };
    }
  }

  private parseVisualizationResponse(response: string) {
    try {
      const parsed = JSON.parse(response);
      return {
        scoring: parsed.scoring || {},
        recommendations: parsed.recommendations || [],
        bestPractices: parsed.bestPractices || []
      };
    } catch (error) {
      console.warn('Failed to parse visualization response:', error);
      return {
        scoring: {
          complexity: 0.5,
          dataRichness: 0.5,
          narrativeFlow: 0.5,
          temporalElements: 0.3,
          quantitativeData: 0.4,
          conceptualDepth: 0.5,
          actionability: 0.4,
          audienceLevel: 0.5
        },
        recommendations: ['Use clear visual hierarchy'],
        bestPractices: ['Keep it simple', 'Focus on key messages']
      };
    }
  }

  private parsePresentationResponse(response: string) {
    try {
      const parsed = JSON.parse(response);
      return {
        approaches: parsed.approaches || [],
        format: parsed.format || 'short',
        estimatedPages: parsed.estimatedPages || 1,
        primaryVisualType: parsed.primaryVisualType || 'infographic',
        secondaryVisualTypes: parsed.secondaryVisualTypes || []
      };
    } catch (error) {
      console.warn('Failed to parse presentation response:', error);
      return {
        approaches: [{
          id: 'default',
          name: 'Standard Presentation',
          score: 0.7,
          reasoning: ['Balanced approach for general content'],
          visualTypes: [{ type: 'infographic', confidence: 0.7 }]
        }],
        format: 'short',
        estimatedPages: 1,
        primaryVisualType: 'infographic',
        secondaryVisualTypes: []
      };
    }
  }

  private parseVisualResponse(response: string) {
    try {
      const parsed = JSON.parse(response);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      console.warn('Failed to parse visual response:', error);
      return [{
        id: 'default-suggestion',
        title: 'AI-Generated Presentation',
        description: 'Professional presentation layout',
        visualType: 'infographic',
        elements: [],
        confidence: 0.7,
        approachData: {
          name: 'Standard Layout',
          reasoning: ['Clean and professional design']
        }
      }];
    }
  }
}

// System Prompts for AI Services
const CONTENT_EXTRACTION_SYSTEM_PROMPT = `
You are an expert content analyst specializing in extracting structured information from text for visualization purposes.

Your task is to analyze content and extract:
1. Key points and main ideas (prioritize the most important insights)
2. Numerical data points (percentages, currencies, dates, metrics, statistics)
3. Relationships between concepts (causal, temporal, correlational, hierarchical)
4. Sentiment and complexity assessment
5. Content categories and themes

Return structured JSON with extracted information. Be thorough but concise.
Focus on information that would be valuable for creating compelling visual presentations.
`;

const VISUALIZATION_SCORING_SYSTEM_PROMPT = `
You are a data visualization expert who scores content across multiple dimensions to recommend optimal visual formats.

Score content on these dimensions (0-1 scale):
- complexity: Simple concepts (0) vs complex relationships (1)
- dataRichness: Text-heavy (0) vs data/numbers heavy (1)  
- narrativeFlow: Fragmented (0) vs clear story progression (1)
- temporalElements: Static (0) vs time-based information (1)
- quantitativeData: Qualitative (0) vs quantitative focus (1)
- conceptualDepth: Surface-level (0) vs deep analysis required (1)
- actionability: Informational (0) vs requires decisions/actions (1)
- audienceLevel: General audience (0) vs expert/technical (1)

Provide specific recommendations for visual formats based on scoring.
Consider cognitive load, information hierarchy, and audience engagement.
`;

const PRESENTATION_STRATEGY_SYSTEM_PROMPT = `
You are a presentation strategy expert who determines the optimal format and approach for content visualization.

Based on content scoring, recommend:
1. Format type: short (1 page), long (multiple pages), or hybrid
2. Visual approaches: bullet-list, timeline, chart, infographic, process-flow, data-story
3. Estimated pages and complexity level
4. Primary and secondary visualization types
5. Clear reasoning for each recommendation

Consider cognitive load, audience needs, information architecture principles, and visual storytelling best practices.
Prioritize clarity, engagement, and actionable insights.
`;

const VISUAL_GENERATION_SYSTEM_PROMPT = `
You are a visual design expert who generates specific visual elements for presentations.

Create detailed specifications for:
1. Visual elements (text blocks, charts, shapes, icons, images)
2. Layout and positioning (coordinates, sizing, spacing)
3. Styling (colors, fonts, backgrounds, borders)
4. Interactive elements and transitions
5. Data visualization specifications (chart types, data mapping)

Ensure elements follow design best practices: