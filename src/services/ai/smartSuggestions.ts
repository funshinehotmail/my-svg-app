import type { 
  ContentInput, 
  ExtractedData, 
  ScoringMetrics, 
  PresentationApproach,
  VisualSuggestion 
} from '../../types';
import { contentScorer } from './contentScorer';
import { presentationStrategy } from './presentationStrategy';

export interface SmartAnalysisResult {
  scoring: ScoringMetrics;
  approaches: PresentationApproach[];
  recommendations: AnalysisRecommendation[];
  visualSuggestions: VisualSuggestion[];
  bestPractices: BestPractice[];
}

export interface AnalysisRecommendation {
  type: 'format' | 'content' | 'design' | 'structure';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  reasoning: string;
  impact: string;
}

export interface BestPractice {
  category: 'cognitive-load' | 'visual-hierarchy' | 'information-design' | 'accessibility';
  principle: string;
  application: string;
  example: string;
}

export class SmartSuggestionEngine {
  private static instance: SmartSuggestionEngine;
  
  static getInstance(): SmartSuggestionEngine {
    if (!SmartSuggestionEngine.instance) {
      SmartSuggestionEngine.instance = new SmartSuggestionEngine();
    }
    return SmartSuggestionEngine.instance;
  }

  async generateSmartAnalysis(
    content: ContentInput, 
    extractedData: ExtractedData
  ): Promise<SmartAnalysisResult> {
    // Score the content across multiple dimensions
    const scoring = await contentScorer.scoreContent(content, extractedData);
    
    // Generate presentation approaches based on scoring
    const approaches = presentationStrategy.generateApproaches(scoring, extractedData);
    
    // Generate specific recommendations
    const recommendations = this.generateRecommendations(scoring, extractedData, approaches);
    
    // Convert approaches to visual suggestions
    const visualSuggestions = this.convertToVisualSuggestions(approaches);
    
    // Generate best practices guidance
    const bestPractices = this.generateBestPractices(scoring, approaches);

    return {
      scoring,
      approaches,
      recommendations,
      visualSuggestions,
      bestPractices
    };
  }

  private generateRecommendations(
    scoring: ScoringMetrics,
    data: ExtractedData,
    approaches: PresentationApproach[]
  ): AnalysisRecommendation[] {
    const recommendations: AnalysisRecommendation[] = [];

    // Format recommendations
    const topApproach = approaches[0];
    if (topApproach) {
      recommendations.push({
        type: 'format',
        priority: 'high',
        title: `Recommended: ${topApproach.name}`,
        description: `Based on your content analysis, ${topApproach.name.toLowerCase()} will be most effective`,
        reasoning: topApproach.reasoning.join('. '),
        impact: `Expected to improve comprehension by ${Math.round(topApproach.score * 100)}%`
      });
    }

    // Content structure recommendations
    if (scoring.complexity > 0.7) {
      recommendations.push({
        type: 'structure',
        priority: 'high',
        title: 'Break Down Complex Concepts',
        description: 'Your content has high complexity. Consider breaking it into smaller, digestible sections.',
        reasoning: 'Complex information overwhelms audiences and reduces retention',
        impact: 'Improves comprehension and reduces cognitive load'
      });
    }

    if (scoring.dataRichness > 0.6 && scoring.quantitativeData > 0.5) {
      recommendations.push({
        type: 'design',
        priority: 'high',
        title: 'Prioritize Data Visualization',
        description: 'Your content is data-rich. Visual charts will communicate more effectively than text.',
        reasoning: 'Numerical data is processed faster visually than textually',
        impact: 'Increases data comprehension by up to 400%'
      });
    }

    // Cognitive load recommendations
    if (data.keyPoints.length > 7) {
      recommendations.push({
        type: 'content',
        priority: 'medium',
        title: 'Reduce Information Density',
        description: `You have ${data.keyPoints.length} key points. Consider grouping or prioritizing to stay within 5-7 items per view.`,
        reasoning: 'Miller\'s Rule: humans can only process 7±2 items simultaneously',
        impact: 'Improves focus and retention'
      });
    }

    // Temporal recommendations
    if (scoring.temporalElements > 0.5) {
      recommendations.push({
        type: 'design',
        priority: 'medium',
        title: 'Use Timeline Visualization',
        description: 'Your content has strong temporal elements. A timeline will show progression clearly.',
        reasoning: 'Chronological presentation matches natural mental models',
        impact: 'Enhances understanding of cause-and-effect relationships'
      });
    }

    // Audience level recommendations
    if (scoring.audienceLevel > 0.7) {
      recommendations.push({
        type: 'content',
        priority: 'medium',
        title: 'Consider Technical Audience',
        description: 'Your content appears technical. Ensure visual design matches audience sophistication.',
        reasoning: 'Expert audiences prefer detailed, precise information',
        impact: 'Maintains credibility and engagement'
      });
    } else if (scoring.audienceLevel < 0.3) {
      recommendations.push({
        type: 'design',
        priority: 'medium',
        title: 'Simplify for General Audience',
        description: 'Use more visual elements and less technical language.',
        reasoning: 'General audiences benefit from simplified, visual communication',
        impact: 'Increases accessibility and comprehension'
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private convertToVisualSuggestions(approaches: PresentationApproach[]): VisualSuggestion[] {
    return approaches.map((approach, index) => ({
      id: approach.id,
      type: this.mapApproachToVisualType(approach),
      title: approach.name,
      description: approach.reasoning[0] || approach.name,
      confidence: approach.score,
      icon: this.getIconForApproach(approach),
      preview: this.generatePreview(approach),
      data: {
        approach,
        estimatedPages: approach.estimatedPages,
        format: approach.format,
        visualTypes: approach.visualTypes
      }
    }));
  }

  private mapApproachToVisualType(approach: PresentationApproach): any {
    const primaryType = approach.visualTypes[0]?.type;
    
    switch (primaryType) {
      case 'bullet-list': return 'infographic';
      case 'timeline': return 'timeline';
      case 'chart': return 'chart';
      case 'data-story': return 'infographic';
      case 'process-flow': return 'flowchart';
      default: return 'infographic';
    }
  }

  private getIconForApproach(approach: PresentationApproach): string {
    const primaryType = approach.visualTypes[0]?.type;
    
    switch (primaryType) {
      case 'bullet-list': return 'List';
      case 'timeline': return 'Clock';
      case 'chart': return 'BarChart3';
      case 'data-story': return 'BookOpen';
      case 'process-flow': return 'GitBranch';
      case 'infographic': return 'Layout';
      default: return 'FileText';
    }
  }

  private generatePreview(approach: PresentationApproach): string {
    const format = approach.format.charAt(0).toUpperCase() + approach.format.slice(1);
    const pages = approach.estimatedPages === 1 ? '1 page' : `${approach.estimatedPages} pages`;
    const confidence = Math.round(approach.score * 100);
    
    return `${format} format • ${pages} • ${confidence}% match`;
  }

  private generateBestPractices(
    scoring: ScoringMetrics,
    approaches: PresentationApproach[]
  ): BestPractice[] {
    const practices: BestPractice[] = [];

    // Cognitive load practices
    practices.push({
      category: 'cognitive-load',
      principle: 'Miller\'s Rule (7±2)',
      application: 'Limit information chunks to 5-7 items per view',
      example: 'Use bullet points, group related items, create multiple pages for long lists'
    });

    practices.push({
      category: 'cognitive-load',
      principle: 'Progressive Disclosure',
      application: 'Reveal information gradually based on user needs',
      example: 'Start with overview, then provide detailed breakdowns on subsequent pages'
    });

    // Visual hierarchy practices
    practices.push({
      category: 'visual-hierarchy',
      principle: 'F-Pattern Reading',
      application: 'Place important information in top-left, use headings to guide eye movement',
      example: 'Key message at top, supporting details below, call-to-action at bottom'
    });

    practices.push({
      category: 'visual-hierarchy',
      principle: 'Contrast for Emphasis',
      application: 'Use size, color, and spacing to highlight important elements',
      example: 'Larger fonts for headings, bold colors for key metrics, white space for separation'
    });

    // Information design practices
    if (scoring.dataRichness > 0.5) {
      practices.push({
        category: 'information-design',
        principle: 'Data-Ink Ratio',
        application: 'Maximize information, minimize decorative elements in charts',
        example: 'Remove unnecessary grid lines, use direct labels instead of legends'
      });
    }

    if (scoring.temporalElements > 0.5) {
      practices.push({
        category: 'information-design',
        principle: 'Chronological Flow',
        application: 'Present time-based information in natural sequence',
        example: 'Left-to-right timeline, past-to-future progression, clear date markers'
      });
    }

    // Accessibility practices
    practices.push({
      category: 'accessibility',
      principle: 'Color Independence',
      application: 'Don\'t rely solely on color to convey information',
      example: 'Use icons, patterns, or text labels alongside color coding'
    });

    practices.push({
      category: 'accessibility',
      principle: 'Readable Typography',
      application: 'Ensure sufficient contrast and appropriate font sizes',
      example: 'Minimum 16px body text, 4.5:1 contrast ratio, clear font families'
    });

    return practices;
  }
}

export const smartSuggestionEngine = SmartSuggestionEngine.getInstance();
