import type { VisualSuggestion, ContentInput, ExtractedData, VisualElement } from '../../types';
import { VISUAL_CONFIG } from '../../utils/constants';

export class VisualSuggestionEngine {
  private static instance: VisualSuggestionEngine;
  
  static getInstance(): VisualSuggestionEngine {
    if (!VisualSuggestionEngine.instance) {
      VisualSuggestionEngine.instance = new VisualSuggestionEngine();
    }
    return VisualSuggestionEngine.instance;
  }

  generateSuggestions(content: ContentInput, extractedData: ExtractedData): VisualSuggestion[] {
    const suggestions: VisualSuggestion[] = [];

    // Analyze content type and generate appropriate suggestions
    switch (content.type) {
      case 'presentation':
        suggestions.push(...this.generatePresentationSuggestions(extractedData));
        break;
      case 'document':
        suggestions.push(...this.generateDocumentSuggestions(extractedData));
        break;
      case 'infographic':
        suggestions.push(...this.generateInfographicSuggestions(extractedData));
        break;
    }

    // Add universal suggestions based on data patterns
    suggestions.push(...this.generateDataDrivenSuggestions(extractedData));

    return this.rankSuggestions(suggestions, extractedData);
  }

  private generatePresentationSuggestions(data: ExtractedData): VisualSuggestion[] {
    const suggestions: VisualSuggestion[] = [];

    // Title slide suggestion
    suggestions.push({
      id: 'presentation-title',
      title: 'Title Slide',
      description: 'Professional title slide with key message',
      visualType: 'infographic',
      elements: this.createTitleSlideElements(data),
      confidence: 0.9
    });

    // Key points slide
    if (data.keyPoints.length > 0) {
      suggestions.push({
        id: 'presentation-keypoints',
        title: 'Key Points Overview',
        description: 'Bullet points with visual hierarchy',
        visualType: 'infographic',
        elements: this.createKeyPointsElements(data.keyPoints),
        confidence: 0.85
      });
    }

    // Data slide if numerical data exists
    if (data.dataPoints.length >= 2) {
      suggestions.push({
        id: 'presentation-data',
        title: 'Data Visualization Slide',
        description: 'Charts and graphs for your data',
        visualType: 'chart',
        elements: this.createDataSlideElements(data.dataPoints),
        confidence: 0.8
      });
    }

    return suggestions;
  }

  private generateDocumentSuggestions(data: ExtractedData): VisualSuggestion[] {
    const suggestions: VisualSuggestion[] = [];

    // Document header
    suggestions.push({
      id: 'document-header',
      title: 'Document Header',
      description: 'Professional document layout with sections',
      visualType: 'infographic',
      elements: this.createDocumentHeaderElements(data),
      confidence: 0.8
    });

    // Process flow if relationships exist
    if (data.relationships.length > 0) {
      suggestions.push({
        id: 'document-process',
        title: 'Process Flow',
        description: 'Step-by-step process visualization',
        visualType: 'diagram',
        elements: this.createProcessFlowElements(data.relationships),
        confidence: 0.75
      });
    }

    return suggestions;
  }

  private generateInfographicSuggestions(data: ExtractedData): VisualSuggestion[] {
    const suggestions: VisualSuggestion[] = [];

    // Full infographic layout
    suggestions.push({
      id: 'infographic-full',
      title: 'Complete Infographic',
      description: 'Comprehensive visual story of your content',
      visualType: 'infographic',
      elements: this.createFullInfographicElements(data),
      confidence: 0.95
    });

    // Statistical infographic
    if (data.dataPoints.length >= 3) {
      suggestions.push({
        id: 'infographic-stats',
        title: 'Statistical Overview',
        description: 'Numbers and statistics with visual impact',
        visualType: 'infographic',
        elements: this.createStatisticalElements(data.dataPoints),
        confidence: 0.9
      });
    }

    return suggestions;
  }

  private generateDataDrivenSuggestions(data: ExtractedData): VisualSuggestion[] {
    const suggestions: VisualSuggestion[] = [];

    // Chart suggestions based on data types
    if (data.dataPoints.length >= 2) {
      const chartTypes = this.determineOptimalChartTypes(data.dataPoints);
      
      chartTypes.forEach((chartType, index) => {
        suggestions.push({
          id: `chart-${chartType}-${index}`,
          title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
          description: `Visualize your data with a ${chartType} chart`,
          visualType: 'chart',
          elements: this.createChartElements(data.dataPoints, chartType),
          confidence: this.calculateChartConfidence(chartType, data.dataPoints)
        });
      });
    }

    // Timeline for temporal data
    const temporalData = data.dataPoints.filter(d => d.category === 'year');
    if (temporalData.length >= 2) {
      suggestions.push({
        id: 'timeline-temporal',
        title: 'Timeline Visualization',
        description: 'Show chronological progression',
        visualType: 'timeline',
        elements: this.createTimelineElements(temporalData),
        confidence: 0.85
      });
    }

    // Comparison layout for comparative data
    if (data.relationships.some(r => r.type === 'correlational')) {
      suggestions.push({
        id: 'comparison-layout',
        title: 'Comparison View',
        description: 'Side-by-side comparison layout',
        visualType: 'comparison',
        elements: this.createComparisonElements(data),
        confidence: 0.7
      });
    }

    return suggestions;
  }

  private determineOptimalChartTypes(dataPoints: any[]): string[] {
    const types: string[] = [];
    
    // Analyze data characteristics
    const hasCategories = dataPoints.some(d => d.category && d.category !== 'metric');
    const hasTimeData = dataPoints.some(d => d.category === 'year');
    const hasPercentages = dataPoints.some(d => d.category === 'percentage');
    
    if (hasTimeData) {
      types.push('line');
    }
    
    if (hasPercentages && dataPoints.length <= 6) {
      types.push('pie');
    }
    
    if (hasCategories) {
      types.push('bar');
    }
    
    // Default to bar chart if no specific patterns
    if (types.length === 0) {
      types.push('bar');
    }
    
    return types.slice(0, 3); // Limit to 3 chart types
  }

  private calculateChartConfidence(chartType: string, dataPoints: any[]): number {
    let confidence = 0.6; // Base confidence
    
    switch (chartType) {
      case 'line':
        if (dataPoints.some(d => d.category === 'year')) confidence += 0.3;
        break;
      case 'pie':
        if (dataPoints.some(d => d.category === 'percentage') && dataPoints.length <= 6) confidence += 0.3;
        break;
      case 'bar':
        if (dataPoints.length >= 3 && dataPoints.length <= 10) confidence += 0.2;
        break;
    }
    
    return Math.min(confidence, 1.0);
  }

  private createTitleSlideElements(data: ExtractedData): VisualElement[] {
    return [
      {
        id: 'title-main',
        type: 'text',
        content: 'Presentation Title',
        position: { x: 100, y: 150 },
        size: { width: 600, height: 80 },
        style: {
          fontSize: 36,
          fontWeight: 'bold',
          textColor: '#1f2937'
        }
      },
      {
        id: 'title-subtitle',
        type: 'text',
        content: data.keyPoints[0] || 'Key insights and findings',
        position: { x: 100, y: 250 },
        size: { width: 600, height: 60 },
        style: {
          fontSize: 18,
          textColor: '#6b7280'
        }
      }
    ];
  }

  private createKeyPointsElements(keyPoints: string[]): VisualElement[] {
    return keyPoints.slice(0, 5).map((point, index) => ({
      id: `keypoint-${index}`,
      type: 'text',
      content: `• ${point}`,
      position: { x: 100, y: 100 + (index * 60) },
      size: { width: 600, height: 50 },
      style: {
        fontSize: 16,
        textColor: '#374151',
        backgroundColor: index % 2 === 0 ? '#f9fafb' : '#ffffff'
      }
    }));
  }

  private createDataSlideElements(dataPoints: any[]): VisualElement[] {
    return [
      {
        id: 'data-chart',
        type: 'chart',
        content: JSON.stringify({
          type: 'bar',
          data: {
            labels: dataPoints.slice(0, 6).map(d => d.label),
            datasets: [{
              label: 'Values',
              data: dataPoints.slice(0, 6).map(d => typeof d.value === 'number' ? d.value : 0),
              backgroundColor: VISUAL_CONFIG.defaultChartColors.slice(0, 6)
            }]
          }
        }),
        position: { x: 50, y: 100 },
        size: { width: 500, height: 300 },
        style: {
          backgroundColor: '#ffffff',
          borderRadius: 8
        }
      }
    ];
  }

  private createDocumentHeaderElements(data: ExtractedData): VisualElement[] {
    return [
      {
        id: 'doc-title',
        type: 'text',
        content: 'Document Title',
        position: { x: 50, y: 50 },
        size: { width: 700, height: 60 },
        style: {
          fontSize: 28,
          fontWeight: 'bold',
          textColor: '#111827'
        }
      },
      {
        id: 'doc-summary',
        type: 'text',
        content: data.keyPoints.slice(0, 3).join(' • '),
        position: { x: 50, y: 120 },
        size: { width: 700, height: 80 },
        style: {
          fontSize: 14,
          textColor: '#6b7280',
          backgroundColor: '#f3f4f6',
          borderRadius: 6
        }
      }
    ];
  }

  private createProcessFlowElements(relationships: any[]): VisualElement[] {
    return relationships.slice(0, 4).map((rel, index) => ({
      id: `process-${index}`,
      type: 'shape',
      content: `Step ${index + 1}`,
      position: { x: 100 + (index * 150), y: 200 },
      size: { width: 120, height: 80 },
      style: {
        backgroundColor: VISUAL_CONFIG.defaultChartColors[index % VISUAL_CONFIG.defaultChartColors.length],
        textColor: '#ffffff',
        borderRadius: 8
      }
    }));
  }

  private createFullInfographicElements(data: ExtractedData): VisualElement[] {
    const elements: VisualElement[] = [];
    
    // Header
    elements.push({
      id: 'infographic-header',
      type: 'text',
      content: 'Visual Story',
      position: { x: 50, y: 30 },
      size: { width: 700, height: 60 },
      style: {
        fontSize: 32,
        fontWeight: 'bold',
        textColor: '#1f2937'
      }
    });

    // Key statistics
    data.dataPoints.slice(0, 3).forEach((point, index) => {
      elements.push({
        id: `stat-${index}`,
        type: 'text',
        content: `${point.value}\n${point.label}`,
        position: { x: 100 + (index * 200), y: 120 },
        size: { width: 150, height: 100 },
        style: {
          fontSize: 24,
          fontWeight: 'bold',
          textColor: VISUAL_CONFIG.defaultChartColors[index],
          backgroundColor: '#f8fafc',
          borderRadius: 12
        }
      });
    });

    // Key points
    data.keyPoints.slice(0, 4).forEach((point, index) => {
      elements.push({
        id: `infographic-point-${index}`,
        type: 'text',
        content: point,
        position: { x: 50, y: 250 + (index * 60) },
        size: { width: 650, height: 50 },
        style: {
          fontSize: 14,
          textColor: '#374151',
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          borderRadius: 6
        }
      });
    });

    return elements;
  }

  private createStatisticalElements(dataPoints: any[]): VisualElement[] {
    return dataPoints.slice(0, 6).map((point, index) => ({
      id: `stat-element-${index}`,
      type: 'text',
      content: `${point.value}\n${point.label}`,
      position: { 
        x: 100 + (index % 3) * 200, 
        y: 150 + Math.floor(index / 3) * 150 
      },
      size: { width: 160, height: 120 },
      style: {
        fontSize: 20,
        fontWeight: 'bold',
        textColor: '#ffffff',
        backgroundColor: VISUAL_CONFIG.defaultChartColors[index % VISUAL_CONFIG.defaultChartColors.length],
        borderRadius: 12
      }
    }));
  }

  private createChartElements(dataPoints: any[], chartType: string): VisualElement[] {
    return [
      {
        id: `chart-${chartType}`,
        type: 'chart',
        content: JSON.stringify({
          type: chartType,
          data: {
            labels: dataPoints.slice(0, 8).map(d => d.label),
            datasets: [{
              label: 'Data',
              data: dataPoints.slice(0, 8).map(d => typeof d.value === 'number' ? d.value : 0),
              backgroundColor: chartType === 'pie' || chartType === 'doughnut' 
                ? VISUAL_CONFIG.defaultChartColors.slice(0, dataPoints.length)
                : VISUAL_CONFIG.defaultChartColors[0]
            }]
          }
        }),
        position: { x: 100, y: 100 },
        size: { width: 500, height: 350 },
        style: {
          backgroundColor: '#ffffff',
          borderRadius: 8
        }
      }
    ];
  }

  private createTimelineElements(temporalData: any[]): VisualElement[] {
    return temporalData
      .sort((a, b) => (a.value as number) - (b.value as number))
      .slice(0, 6)
      .map((event, index) => ({
        id: `timeline-event-${index}`,
        type: 'text',
        content: `${event.value}\n${event.label}`,
        position: { x: 80 + (index * 120), y: 200 },
        size: { width: 100, height: 80 },
        style: {
          fontSize: 12,
          textColor: '#1f2937',
          backgroundColor: '#dbeafe',
          borderColor: '#3b82f6',
          borderWidth: 2,
          borderRadius: 8
        }
      }));
  }

  private createComparisonElements(data: ExtractedData): VisualElement[] {
    const leftPoints = data.keyPoints.slice(0, 3);
    const rightPoints = data.keyPoints.slice(3, 6);

    const elements: VisualElement[] = [];

    // Left side
    leftPoints.forEach((point, index) => {
      elements.push({
        id: `comparison-left-${index}`,
        type: 'text',
        content: point,
        position: { x: 50, y: 100 + (index * 80) },
        size: { width: 300, height: 60 },
        style: {
          fontSize: 14,
          textColor: '#065f46',
          backgroundColor: '#ecfdf5',
          borderRadius: 6
        }
      });
    });

    // Right side
    rightPoints.forEach((point, index) => {
      elements.push({
        id: `comparison-right-${index}`,
        type: 'text',
        content: point,
        position: { x: 400, y: 100 + (index * 80) },
        size: { width: 300, height: 60 },
        style: {
          fontSize: 14,
          textColor: '#991b1b',
          backgroundColor: '#fef2f2',
          borderRadius: 6
        }
      });
    });

    return elements;
  }

  private rankSuggestions(suggestions: VisualSuggestion[], data: ExtractedData): VisualSuggestion[] {
    return suggestions
      .map(suggestion => ({
        ...suggestion,
        confidence: this.adjustConfidenceBasedOnData(suggestion, data)
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 6); // Limit to top 6 suggestions
  }

  private adjustConfidenceBasedOnData(suggestion: VisualSuggestion, data: ExtractedData): number {
    let confidence = suggestion.confidence;

    // Boost confidence for suggestions that match data characteristics
    if (suggestion.visualType === 'chart' && data.dataPoints.length >= 3) {
      confidence += 0.1;
    }

    if (suggestion.visualType === 'timeline' && data.dataPoints.some(d => d.category === 'year')) {
      confidence += 0.15;
    }

    if (suggestion.visualType === 'infographic' && data.keyPoints.length >= 4) {
      confidence += 0.1;
    }

    if (suggestion.visualType === 'comparison' && data.relationships.length > 0) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }
}

export const visualSuggestionEngine = VisualSuggestionEngine.getInstance();
