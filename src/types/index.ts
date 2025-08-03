// Core content types
export interface ContentInput {
  content: string;
  type: 'text' | 'document' | 'url';
  metadata?: {
    title?: string;
    source?: string;
    dateCreated?: string;
    context?: string;
  };
}

export interface ContentAnalysis {
  id: string;
  originalContent: ContentInput;
  extractedData: {
    keyPoints: string[];
    dataPoints: string[];
    relationships: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
    complexity: number;
    categories: string[];
  };
  suggestions: VisualSuggestion[];
  createdAt: Date;
  smartAnalysis?: SmartAnalysisResult;
}

export interface SmartAnalysisResult {
  scoring: {
    complexity: number;
    dataRichness: number;
    narrativeFlow: number;
    temporalElements: number;
    quantitativeData: number;
    conceptualDepth: number;
    actionability: number;
    audienceLevel: number;
  };
  approaches: Array<{
    id: string;
    name: string;
    score: number;
    reasoning: string[];
    visualTypes: Array<{
      type: string;
      confidence: number;
    }>;
  }>;
  recommendations: string[];
  visualSuggestions: VisualSuggestion[];
  bestPractices: string[];
}

export interface VisualSuggestion {
  id: string;
  title: string;
  description: string;
  visualType: 'chart' | 'infographic' | 'timeline' | 'bullet-list' | 'process-flow' | 'data-story' | 'text';
  confidence: number;
  elements?: VisualElement[];
  approachData?: {
    name: string;
    reasoning: string[];
  };
}

export interface VisualElement {
  type: 'text' | 'chart' | 'image' | 'shape' | 'timeline';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style?: {
    color?: string;
    backgroundColor?: string;
    fontSize?: number;
    fontWeight?: string;
  };
}

export interface PresentationPage {
  id: string;
  title: string;
  content: string;
  elements: VisualElement[];
  visualType: string;
  order: number;
}

// Theme types
export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

// Export types
export interface ExportOptions {
  format: 'pptx' | 'pdf' | 'png' | 'html';
  quality: 'low' | 'medium' | 'high';
  includeNotes: boolean;
}
