import type { ScoringMetrics, PresentationApproach, ExtractedData, VisualSuggestion } from '../../types';

export interface VisualFormat {
  type: 'bullet-list' | 'timeline' | 'chart' | 'infographic' | 'comparison' | 'process-flow' | 'data-story';
  priority: number;
  reasoning: string;
  requirements: FormatRequirements;
}

export interface FormatRequirements {
  imagery: ImagerySpec;
  layout: LayoutSpec;
  interactivity: InteractivitySpec;
  dataVisualization?: ChartSpec;
}

export interface ImagerySpec {
  type: 'icons' | 'photos' | 'illustrations' | 'diagrams' | 'mixed';
  style: 'minimal' | 'detailed' | 'professional' | 'creative';
  sources: string[];
  quantity: number;
}

export interface LayoutSpec {
  structure: 'single-column' | 'two-column' | 'grid' | 'timeline' | 'radial';
  spacing: 'tight' | 'comfortable' | 'spacious';
  hierarchy: 'flat' | 'nested' | 'progressive';
  breakpoints: string[];
}

export interface InteractivitySpec {
  level: 'static' | 'hover' | 'click' | 'animated';
  transitions: boolean;
  progressive: boolean;
}

export interface ChartSpec {
  types: string[];
  complexity: 'simple' | 'moderate' | 'complex';
  interactivity: boolean;
  annotations: boolean;
}

export class PresentationStrategy {
  private static instance: PresentationStrategy;
  
  static getInstance(): PresentationStrategy {
    if (!PresentationStrategy.instance) {
      PresentationStrategy.instance = new PresentationStrategy();
    }
    return PresentationStrategy.instance;
  }

  generateApproaches(
    scoring: ScoringMetrics, 
    extractedData: ExtractedData
  ): PresentationApproach[] {
    const approaches: PresentationApproach[] = [];

    // Short Version Approaches
    approaches.push(...this.generateShortApproaches(scoring, extractedData));
    
    // Long Version Approaches
    approaches.push(...this.generateLongApproaches(scoring, extractedData));
    
    // Hybrid Approaches
    approaches.push(...this.generateHybridApproaches(scoring, extractedData));

    return this.rankApproaches(approaches, scoring);
  }

  private generateShortApproaches(
    scoring: ScoringMetrics, 
    extractedData: ExtractedData
  ): PresentationApproach[] {
    const approaches: PresentationApproach[] = [];

    // Bullet List with Icons (Best for actionable, low complexity content)
    if (scoring.actionability > 0.6 && scoring.complexity < 0.5) {
      approaches.push({
        id: 'bullet-icons',
        name: 'Bullet List with Icons',
        score: this.calculateBulletScore(scoring, extractedData),
        reasoning: [
          'High actionability suggests clear action items',
          'Low complexity allows for concise presentation',
          'Icons enhance visual appeal and comprehension'
        ],
        format: 'short',
        visualTypes: [{
          type: 'bullet-list',
          priority: 1,
          reasoning: 'Optimal for scannable, actionable content',
          requirements: {
            imagery: {
              type: 'icons',
              style: 'minimal',
              sources: ['lucide-react', 'heroicons'],
              quantity: extractedData.keyPoints.length
            },
            layout: {
              structure: 'single-column',
              spacing: 'comfortable',
              hierarchy: 'flat',
              breakpoints: ['mobile', 'tablet', 'desktop']
            },
            interactivity: {
              level: 'hover',
              transitions: true,
              progressive: false
            }
          }
        }],
        estimatedPages: 1
      });
    }

    // Timeline (Best for temporal content)
    if (scoring.temporalElements > 0.5) {
      approaches.push({
        id: 'timeline-short',
        name: 'Key Dates Timeline',
        score: this.calculateTimelineScore(scoring, extractedData),
        reasoning: [
          'Strong temporal elements detected',
          'Timeline format shows progression clearly',
          'Dates provide concrete anchors for understanding'
        ],
        format: 'short',
        visualTypes: [{
          type: 'timeline',
          priority: 1,
          reasoning: 'Temporal data best presented chronologically',
          requirements: {
            imagery: {
              type: 'icons',
              style: 'professional',
              sources: ['timeline-icons', 'date-markers'],
              quantity: Math.min(extractedData.dataPoints.filter(d => d.category === 'year').length, 6)
            },
            layout: {
              structure: 'timeline',
              spacing: 'spacious',
              hierarchy: 'progressive',
              breakpoints: ['mobile-vertical', 'tablet-horizontal', 'desktop-horizontal']
            },
            interactivity: {
              level: 'click',
              transitions: true,
              progressive: true
            }
          }
        }],
        estimatedPages: 1
      });
    }

    // Simple Chart (Best for data-rich, quantitative content)
    if (scoring.quantitativeData > 0.6 && scoring.dataRichness > 0.5) {
      approaches.push({
        id: 'simple-chart',
        name: 'Key Metrics Chart',
        score: this.calculateChartScore(scoring, extractedData),
        reasoning: [
          'High quantitative data density',
          'Charts communicate numbers more effectively than text',
          'Single chart maintains focus and clarity'
        ],
        format: 'short',
        visualTypes: [{
          type: 'chart',
          priority: 1,
          reasoning: 'Quantitative data requires visual representation',
          requirements: {
            imagery: {
              type: 'diagrams',
              style: 'minimal',
              sources: ['chart-elements'],
              quantity: 1
            },
            layout: {
              structure: 'single-column',
              spacing: 'comfortable',
              hierarchy: 'flat',
              breakpoints: ['responsive']
            },
            interactivity: {
              level: 'hover',
              transitions: true,
              progressive: false
            },
            dataVisualization: {
              types: this.determineOptimalChartTypes(extractedData),
              complexity: 'simple',
              interactivity: true,
              annotations: false
            }
          }
        }],
        estimatedPages: 1
      });
    }

    return approaches;
  }

  private generateLongApproaches(
    scoring: ScoringMetrics, 
    extractedData: ExtractedData
  ): PresentationApproach[] {
    const approaches: PresentationApproach[] = [];

    // Detailed Breakdown (Best for complex, deep content)
    if (scoring.conceptualDepth > 0.6 || scoring.complexity > 0.7) {
      approaches.push({
        id: 'detailed-breakdown',
        name: 'Detailed Topic Breakdown',
        score: this.calculateDetailedScore(scoring, extractedData),
        reasoning: [
          'High conceptual depth requires thorough explanation',
          'Complex topics benefit from structured breakdown',
          'Multiple pages allow proper development of ideas'
        ],
        format: 'long',
        visualTypes: [
          {
            type: 'infographic',
            priority: 1,
            reasoning: 'Overview page with visual hierarchy',
            requirements: this.getInfographicRequirements()
          },
          {
            type: 'process-flow',
            priority: 2,
            reasoning: 'Break down complex processes',
            requirements: this.getProcessFlowRequirements()
          },
          {
            type: 'chart',
            priority: 3,
            reasoning: 'Supporting data visualization',
            requirements: this.getComplexChartRequirements(extractedData)
          }
        ],
        estimatedPages: Math.ceil(extractedData.keyPoints.length / 2) + 2
      });
    }

    // Data Story (Best for data-rich narratives)
    if (scoring.dataRichness > 0.7 && scoring.narrativeFlow > 0.5) {
      approaches.push({
        id: 'data-story',
        name: 'Comprehensive Data Story',
        score: this.calculateDataStoryScore(scoring, extractedData),
        reasoning: [
          'Rich data set supports detailed analysis',
          'Strong narrative flow enables story structure',
          'Multiple visualizations reveal different insights'
        ],
        format: 'long',
        visualTypes: [
          {
            type: 'data-story',
            priority: 1,
            reasoning: 'Narrative structure with data integration',
            requirements: this.getDataStoryRequirements(extractedData)
          }
        ],
        estimatedPages: 4 + Math.floor(extractedData.dataPoints.length / 3)
      });
    }

    return approaches;
  }

  private generateHybridApproaches(
    scoring: ScoringMetrics, 
    extractedData: ExtractedData
  ): PresentationApproach[] {
    const approaches: PresentationApproach[] = [];

    // Executive Summary + Details
    if (scoring.actionability > 0.5 && scoring.conceptualDepth > 0.5) {
      approaches.push({
        id: 'executive-hybrid',
        name: 'Executive Summary + Deep Dive',
        score: this.calculateHybridScore(scoring, extractedData),
        reasoning: [
          'Actionable content needs executive summary',
          'Conceptual depth requires detailed exploration',
          'Two-tier approach serves different audience needs'
        ],
        format: 'hybrid',
        visualTypes: [
          {
            type: 'bullet-list',
            priority: 1,
            reasoning: 'Executive summary page',
            requirements: this.getBulletListRequirements()
          },
          {
            type: 'infographic',
            priority: 2,
            reasoning: 'Detailed breakdown pages',
            requirements: this.getInfographicRequirements()
          }
        ],
        estimatedPages: 1 + Math.ceil(extractedData.keyPoints.length / 3)
      });
    }

    return approaches;
  }

  private calculateBulletScore(scoring: ScoringMetrics, data: ExtractedData): number {
    let score = 0.5; // Base score
    
    // Boost for actionability
    score += scoring.actionability * 0.3;
    
    // Boost for appropriate complexity (not too high, not too low)
    score += (1 - scoring.complexity) * 0.2;
    
    // Boost for clear key points
    score += Math.min(data.keyPoints.length / 5, 0.2);
    
    // Penalty for high data richness (charts better for data)
    score -= scoring.dataRichness * 0.1;
    
    return Math.min(score, 1);
  }

  private calculateTimelineScore(scoring: ScoringMetrics, data: ExtractedData): number {
    let score = 0.3; // Base score
    
    // Strong boost for temporal elements
    score += scoring.temporalElements * 0.5;
    
    // Boost for narrative flow
    score += scoring.narrativeFlow * 0.2;
    
    // Boost for appropriate number of time points
    const timePoints = data.dataPoints.filter(d => d.category === 'year').length;
    if (timePoints >= 3 && timePoints <= 8) {
      score += 0.2;
    }
    
    return Math.min(score, 1);
  }

  private calculateChartScore(scoring: ScoringMetrics, data: ExtractedData): number {
    let score = 0.4; // Base score
    
    // Strong boost for quantitative data
    score += scoring.quantitativeData * 0.4;
    
    // Boost for data richness
    score += scoring.dataRichness * 0.3;
    
    // Boost for appropriate data point count
    if (data.dataPoints.length >= 3 && data.dataPoints.length <= 10) {
      score += 0.2;
    }
    
    // Penalty for high narrative flow (stories better for narrative)
    score -= scoring.narrativeFlow * 0.1;
    
    return Math.min(score, 1);
  }

  private calculateDetailedScore(scoring: ScoringMetrics, data: ExtractedData): number {
    let score = 0.4; // Base score
    
    // Strong boost for conceptual depth
    score += scoring.conceptualDepth * 0.4;
    
    // Boost for complexity
    score += scoring.complexity * 0.3;
    
    // Boost for rich content
    if (data.keyPoints.length >= 5) {
      score += 0.2;
    }
    
    // Boost for audience level
    score += scoring.audienceLevel * 0.1;
    
    return Math.min(score, 1);
  }

  private calculateDataStoryScore(scoring: ScoringMetrics, data: ExtractedData): number {
    let score = 0.3; // Base score
    
    // Strong boost for data richness
    score += scoring.dataRichness * 0.4;
    
    // Strong boost for narrative flow
    score += scoring.narrativeFlow * 0.4;
    
    // Boost for quantitative data
    score += scoring.quantitativeData * 0.2;
    
    return Math.min(score, 1);
  }

  private calculateHybridScore(scoring: ScoringMetrics, data: ExtractedData): number {
    let score = 0.5; // Base score
    
    // Boost for balanced characteristics
    const balance = 1 - Math.abs(scoring.actionability - scoring.conceptualDepth);
    score += balance * 0.3;
    
    // Boost for rich content that supports both approaches
    score += Math.min(data.keyPoints.length / 8, 0.2);
    
    return Math.min(score, 1);
  }

  private determineOptimalChartTypes(data: ExtractedData): string[] {
    const types: string[] = [];
    
    const hasTimeData = data.dataPoints.some(d => d.category === 'year');
    const hasPercentages = data.dataPoints.some(d => d.category === 'percentage');
    const hasCurrency = data.dataPoints.some(d => d.category === 'currency');
    
    if (hasTimeData) types.push('line');
    if (hasPercentages && data.dataPoints.length <= 6) types.push('pie');
    if (hasCurrency || data.dataPoints.length >= 3) types.push('bar');
    
    return types.length > 0 ? types : ['bar'];
  }

  private getBulletListRequirements(): FormatRequirements {
    return {
      imagery: {
        type: 'icons',
        style: 'minimal',
        sources: ['lucide-react', 'heroicons'],
        quantity: 5
      },
      layout: {
        structure: 'single-column',
        spacing: 'comfortable',
        hierarchy: 'flat',
        breakpoints: ['mobile', 'tablet', 'desktop']
      },
      interactivity: {
        level: 'hover',
        transitions: true,
        progressive: false
      }
    };
  }

  private getInfographicRequirements(): FormatRequirements {
    return {
      imagery: {
        type: 'mixed',
        style: 'professional',
        sources: ['pexels', 'icons', 'illustrations'],
        quantity: 8
      },
      layout: {
        structure: 'grid',
        spacing: 'spacious',
        hierarchy: 'nested',
        breakpoints: ['mobile', 'tablet', 'desktop']
      },
      interactivity: {
        level: 'click',
        transitions: true,
        progressive: true
      }
    };
  }

  private getProcessFlowRequirements(): FormatRequirements {
    return {
      imagery: {
        type: 'diagrams',
        style: 'detailed',
        sources: ['flow-charts', 'process-icons'],
        quantity: 6
      },
      layout: {
        structure: 'timeline',
        spacing: 'comfortable',
        hierarchy: 'progressive',
        breakpoints: ['mobile-vertical', 'desktop-horizontal']
      },
      interactivity: {
        level: 'animated',
        transitions: true,
        progressive: true
      }
    };
  }

  private getComplexChartRequirements(data: ExtractedData): FormatRequirements {
    return {
      imagery: {
        type: 'diagrams',
        style: 'detailed',
        sources: ['chart-elements'],
        quantity: 3
      },
      layout: {
        structure: 'two-column',
        spacing: 'comfortable',
        hierarchy: 'nested',
        breakpoints: ['responsive']
      },
      interactivity: {
        level: 'click',
        transitions: true,
        progressive: false
      },
      dataVisualization: {
        types: this.determineOptimalChartTypes(data),
        complexity: 'complex',
        interactivity: true,
        annotations: true
      }
    };
  }

  private getDataStoryRequirements(data: ExtractedData): FormatRequirements {
    return {
      imagery: {
        type: 'mixed',
        style: 'professional',
        sources: ['pexels', 'charts', 'infographics'],
        quantity: 12
      },
      layout: {
        structure: 'grid',
        spacing: 'spacious',
        hierarchy: 'progressive',
        breakpoints: ['mobile', 'tablet', 'desktop']
      },
      interactivity: {
        level: 'animated',
        transitions: true,
        progressive: true
      },
      dataVisualization: {
        types: ['line', 'bar', 'pie', 'scatter'],
        complexity: 'complex',
        interactivity: true,
        annotations: true
      }
    };
  }

  private rankApproaches(
    approaches: PresentationApproach[], 
    scoring: ScoringMetrics
  ): PresentationApproach[] {
    return approaches
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Return top 5 approaches
  }
}

export const presentationStrategy = PresentationStrategy.getInstance();
