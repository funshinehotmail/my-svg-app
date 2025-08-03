export const VISUAL_CONFIG = {
  defaultChartColors: [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', 
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ],
  chartTypes: ['bar', 'line', 'pie', 'doughnut', 'scatter', 'area'] as const,
  maxDataPoints: 20,
  maxSuggestions: 6
};

export const THEMES = {
  professional: {
    id: 'professional' as const,
    name: 'Professional',
    description: 'Clean, corporate design with blue accents',
    colors: {
      primary: '#1e40af',
      secondary: '#64748b',
      accent: '#3b82f6',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    styles: {
      borderRadius: 8,
      borderWidth: 1,
      spacing: 'comfortable' as const,
      shadowLevel: 'subtle' as const
    },
    chartColors: [
      '#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'
    ]
  },
  creative: {
    id: 'creative' as const,
    name: 'Creative',
    description: 'Vibrant, modern design with colorful elements',
    colors: {
      primary: '#7c3aed',
      secondary: '#ec4899',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#faf5ff',
      text: '#1f2937'
    },
    fonts: {
      heading: 'Poppins',
      body: 'Inter'
    },
    styles: {
      borderRadius: 12,
      borderWidth: 2,
      spacing: 'spacious' as const,
      shadowLevel: 'moderate' as const
    },
    chartColors: [
      '#7c3aed', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'
    ]
  },
  minimal: {
    id: 'minimal' as const,
    name: 'Minimal',
    description: 'Simple, elegant design with subtle colors',
    colors: {
      primary: '#374151',
      secondary: '#9ca3af',
      accent: '#6b7280',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    styles: {
      borderRadius: 4,
      borderWidth: 1,
      spacing: 'minimal' as const,
      shadowLevel: 'none' as const
    },
    chartColors: [
      '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6'
    ]
  },
  bold: {
    id: 'bold' as const,
    name: 'Bold',
    description: 'High-contrast design with strong visual impact',
    colors: {
      primary: '#dc2626',
      secondary: '#1f2937',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#fef2f2',
      text: '#111827'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    styles: {
      borderRadius: 6,
      borderWidth: 2,
      spacing: 'comfortable' as const,
      shadowLevel: 'elevated' as const
    },
    chartColors: [
      '#dc2626', '#f59e0b', '#1f2937', '#374151', '#6b7280'
    ]
  }
} as const;

// Export themes for components that expect this named export
export const themes = THEMES;

export type ThemeId = keyof typeof THEMES;

export const CONTENT_TYPES = {
  presentation: 'Presentation',
  document: 'Document', 
  infographic: 'Infographic'
} as const;

export const VISUAL_TYPES = {
  chart: 'Chart',
  timeline: 'Timeline',
  comparison: 'Comparison',
  infographic: 'Infographic',
  diagram: 'Diagram'
} as const;

export const WORKFLOW_STEPS = {
  input: 'Content Input',
  processing: 'AI Processing',
  preview: 'Preview & Select',
  editing: 'Visual Editing',
  export: 'Export & Share'
} as const;

export const AI_CONFIG = {
  mockDelay: 2000,
  maxContentLength: 10000,
  minContentLength: 50,
  confidenceThreshold: 0.6
} as const;

export const EXPORT_FORMATS = {
  pptx: 'PowerPoint (.pptx)',
  pdf: 'PDF Document (.pdf)',
  png: 'PNG Image (.png)',
  svg: 'SVG Vector (.svg)'
} as const;
