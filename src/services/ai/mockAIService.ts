import type { ContentInput, ContentAnalysis, VisualSuggestion } from '../../types';

class MockAIService {
  async analyzeContent(content: ContentInput): Promise<ContentAnalysis> {
    console.log('🔄 Using mock AI service for content analysis...');
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Extract basic information from content
    const text = content.content.toLowerCase();
    const words = text.split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Mock data extraction
    const numbers = content.content.match(/\d+(?:\.\d+)?%?/g) || [];
    const keyPhrases = this.extractKeyPhrases(content.content);
    
    // Mock scoring based on content characteristics
    const scoring = {
      complexity: Math.min(sentences.length / 10, 1),
      dataRichness: Math.min(numbers.length / 5, 1),
      narrativeFlow: sentences.length > 3 ? 0.7 : 0.4,
      temporalElements: /\b(before|after|then|next|finally|first|last)\b/i.test(text) ? 0.8 : 0.3,
      quantitativeData: numbers.length > 0 ? 0.8 : 0.2,
      conceptualDepth: words.length > 100 ? 0.7 : 0.4,
      actionability: /\b(should|must|need|recommend|suggest)\b/i.test(text) ? 0.8 : 0.4,
      audienceLevel: /\b(technical|advanced|expert|professional)\b/i.test(text) ? 0.8 : 0.5
    };

    // Generate visual suggestions based on content analysis
    const suggestions = this.generateMockSuggestions(content, scoring, keyPhrases, numbers);

    const analysis: ContentAnalysis = {
      id: `mock-analysis-${Date.now()}`,
      originalContent: content,
      extractedData: {
        keyPoints: keyPhrases.slice(0, 5),
        dataPoints: numbers.slice(0, 8),
        relationships: this.extractRelationships(content.content),
        sentiment: this.analyzeSentiment(text),
        complexity: Math.round(scoring.complexity * 10),
        categories: this.extractCategories(text)
      },
      suggestions,
      createdAt: new Date(),
      smartAnalysis: {
        scoring,
        approaches: this.generateApproaches(scoring),
        recommendations: this.generateRecommendations(scoring),
        visualSuggestions: suggestions,
        bestPractices: [
          'Use clear visual hierarchy',
          'Maintain consistent styling',
          'Focus on key messages',
          'Optimize for readability'
        ]
      }
    };

    console.log('✅ Mock AI analysis complete:', {
      keyPoints: analysis.extractedData.keyPoints.length,
      dataPoints: analysis.extractedData.dataPoints.length,
      suggestions: analysis.suggestions.length
    });

    return analysis;
  }

  private extractKeyPhrases(content: string): string[] {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences
      .map(s => s.trim())
      .filter(s => s.length > 20 && s.length < 150)
      .slice(0, 8);
  }

  private extractRelationships(content: string): string[] {
    const relationships = [];
    
    if (/\b(because|due to|caused by)\b/i.test(content)) {
      relationships.push('Causal relationships identified');
    }
    if (/\b(compared to|versus|vs|than)\b/i.test(content)) {
      relationships.push('Comparative relationships found');
    }
    if (/\b(before|after|then|next)\b/i.test(content)) {
      relationships.push('Temporal sequence detected');
    }
    if (/\b(includes|contains|consists of)\b/i.test(content)) {
      relationships.push('Hierarchical structure present');
    }
    
    return relationships;
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['good', 'great', 'excellent', 'success', 'growth', 'increase', 'improve'];
    const negativeWords = ['bad', 'poor', 'decline', 'decrease', 'problem', 'issue', 'fail'];
    
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private extractCategories(text: string): string[] {
    const categories = [];
    
    if (/\b(sales|revenue|profit|financial|money)\b/i.test(text)) categories.push('Financial');
    if (/\b(team|people|employee|staff|human)\b/i.test(text)) categories.push('Human Resources');
    if (/\b(product|feature|development|technology)\b/i.test(text)) categories.push('Product');
    if (/\b(market|customer|client|user)\b/i.test(text)) categories.push('Marketing');
    if (/\b(process|workflow|procedure|system)\b/i.test(text)) categories.push('Operations');
    
    return categories.length > 0 ? categories : ['General'];
  }

  private generateApproaches(scoring: any) {
    const approaches = [];
    
    if (scoring.dataRichness > 0.6) {
      approaches.push({
        id: 'data-visualization',
        name: 'Data Visualization',
        score: scoring.dataRichness,
        reasoning: ['High data content detected', 'Charts and graphs recommended'],
        visualTypes: [
          { type: 'chart', confidence: scoring.dataRichness },
          { type: 'infographic', confidence: 0.7 }
        ]
      });
    }

    if (scoring.narrativeFlow > 0.6) {
      approaches.push({
        id: 'story-presentation',
        name: 'Story Presentation',
        score: scoring.narrativeFlow,
        reasoning: ['Clear narrative structure found', 'Sequential presentation recommended'],
        visualTypes: [
          { type: 'timeline', confidence: scoring.temporalElements },
          { type: 'process-flow', confidence: 0.8 }
        ]
      });
    }

    if (scoring.complexity < 0.5) {
      approaches.push({
        id: 'simple-layout',
        name: 'Simple Layout',
        score: 1 - scoring.complexity,
        reasoning: ['Content is straightforward', 'Clean, minimal design recommended'],
        visualTypes: [
          { type: 'bullet-list', confidence: 0.8 },
          { type: 'infographic', confidence: 0.6 }
        ]
      });
    }

    return approaches.length > 0 ? approaches : [{
      id: 'default',
      name: 'Standard Presentation',
      score: 0.7,
      reasoning: ['Balanced approach for general content'],
      visualTypes: [{ type: 'infographic', confidence: 0.7 }]
    }];
  }

  private generateRecommendations(scoring: any): string[] {
    const recommendations = [];
    
    if (scoring.dataRichness > 0.6) {
      recommendations.push('Use charts and graphs to visualize numerical data');
    }
    if (scoring.complexity > 0.7) {
      recommendations.push('Break complex information into multiple slides');
    }
    if (scoring.narrativeFlow > 0.6) {
      recommendations.push('Organize content in a logical sequence');
    }
    if (scoring.actionability > 0.6) {
      recommendations.push('Highlight actionable items and recommendations');
    }
    
    recommendations.push('Use consistent visual hierarchy');
    recommendations.push('Maintain clear and readable typography');
    
    return recommendations;
  }

  private generateMockSuggestions(
    content: ContentInput, 
    scoring: any, 
    keyPhrases: string[], 
    numbers: string[]
  ): VisualSuggestion[] {
    const suggestions: VisualSuggestion[] = [];

    // Data-heavy content suggestion
    if (scoring.dataRichness > 0.5) {
      suggestions.push({
        id: 'data-visualization',
        title: 'Data Visualization',
        description: 'Present your data with charts and infographics for maximum impact',
        visualType: 'chart',
        confidence: scoring.dataRichness,
        elements: [
          {
            type: 'chart',
            content: `Data visualization for: ${numbers.join(', ')}`,
            position: { x: 100, y: 100 },
            size: { width: 400, height: 300 }
          },
          {
            type: 'text',
            content: keyPhrases[0] || 'Key insight from your data',
            position: { x: 100, y: 450 },
            size: { width: 400, height: 100 }
          }
        ],
        approachData: {
          name: 'Data-Driven Approach',
          reasoning: ['High data content detected', 'Visual charts enhance comprehension']
        }
      });
    }

    // Process/Timeline suggestion
    if (scoring.temporalElements > 0.5 || scoring.narrativeFlow > 0.6) {
      suggestions.push({
        id: 'timeline-process',
        title: 'Timeline & Process',
        description: 'Show progression and relationships with timeline layouts',
        visualType: 'timeline',
        confidence: Math.max(scoring.temporalElements, scoring.narrativeFlow),
        elements: [
          {
            type: 'timeline',
            content: 'Process flow based on your content structure',
            position: { x: 50, y: 200 },
            size: { width: 500, height: 200 }
          }
        ],
        approachData: {
          name: 'Sequential Approach',
          reasoning: ['Temporal elements detected', 'Clear narrative flow identified']
        }
      });
    }

    // Simple infographic for general content
    suggestions.push({
      id: 'infographic-layout',
      title: 'Clean Infographic',
      description: 'Professional layout with balanced text and visual elements',
      visualType: 'infographic',
      confidence: 0.8,
      elements: [
        {
          type: 'text',
          content: keyPhrases[0] || content.content.substring(0, 100) + '...',
          position: { x: 100, y: 100 },
          size: { width: 400, height: 150 }
        },
        {
          type: 'shape',
          content: 'Visual accent elements',
          position: { x: 520, y: 100 },
          size: { width: 100, height: 150 }
        }
      ],
      approachData: {
        name: 'Balanced Layout',
        reasoning: ['Versatile format', 'Good for mixed content types']
      }
    });

    // Bullet list for structured content
    if (keyPhrases.length > 2) {
      suggestions.push({
        id: 'bullet-list',
        title: 'Structured List',
        description: 'Organize key points in a clear, scannable format',
        visualType: 'bullet-list',
        confidence: 0.7,
        elements: keyPhrases.slice(0, 5).map((phrase, index) => ({
          type: 'text',
          content: phrase,
          position: { x: 100, y: 100 + (index * 60) },
          size: { width: 500, height: 50 }
        })),
        approachData: {
          name: 'List-Based Approach',
          reasoning: ['Multiple key points identified', 'Clear structure preferred']
        }
      });
    }

    return suggestions;
  }
}

export const mockAIService = new MockAIService();
