import type { VisualElement, Theme } from '../../types';
import { THEMES, type ThemeId } from '../../utils/constants';

export class ThemeRenderer {
  private static instance: ThemeRenderer;
  
  static getInstance(): ThemeRenderer {
    if (!ThemeRenderer.instance) {
      ThemeRenderer.instance = new ThemeRenderer();
    }
    return ThemeRenderer.instance;
  }

  applyThemeToElements(elements: VisualElement[], themeId: ThemeId): VisualElement[] {
    const theme = THEMES[themeId];
    
    return elements.map(element => ({
      ...element,
      style: {
        ...element.style,
        ...this.getThemedStyles(element, theme)
      }
    }));
  }

  private getThemedStyles(element: VisualElement, theme: typeof THEMES[ThemeId]) {
    const baseStyles = {
      fontFamily: element.type === 'text' ? theme.fonts.body : undefined,
      borderRadius: theme.styles.borderRadius,
      borderWidth: theme.styles.borderWidth
    };

    switch (element.type) {
      case 'text':
        return {
          ...baseStyles,
          textColor: element.style?.textColor || theme.colors.primary,
          backgroundColor: element.style?.backgroundColor || theme.colors.surface,
          borderColor: theme.colors.secondary,
          fontSize: this.getThemedFontSize(element.style?.fontSize, theme),
          fontWeight: element.style?.fontWeight || 'normal',
          padding: this.getThemedSpacing(theme)
        };

      case 'chart':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.secondary,
          ...this.getThemedChartStyles(element, theme)
        };

      case 'shape':
        return {
          ...baseStyles,
          backgroundColor: element.style?.backgroundColor || theme.colors.accent,
          textColor: this.getContrastColor(element.style?.backgroundColor || theme.colors.accent),
          borderColor: theme.colors.primary,
          ...this.getThemedShadow(theme)
        };

      case 'icon':
        return {
          ...baseStyles,
          color: element.style?.textColor || theme.colors.primary,
          backgroundColor: element.style?.backgroundColor || 'transparent'
        };

      default:
        return baseStyles;
    }
  }

  private getThemedFontSize(originalSize?: number, theme: typeof THEMES[ThemeId]): number {
    if (!originalSize) return 14;
    
    // Adjust font sizes based on theme spacing
    const multiplier = theme.styles.spacing === 'spacious' ? 1.1 : 
                      theme.styles.spacing === 'minimal' ? 0.9 : 1;
    
    return Math.round(originalSize * multiplier);
  }

  private getThemedSpacing(theme: typeof THEMES[ThemeId]): number {
    switch (theme.styles.spacing) {
      case 'minimal': return 8;
      case 'comfortable': return 12;
      case 'spacious': return 16;
      default: return 12;
    }
  }

  private getThemedShadow(theme: typeof THEMES[ThemeId]) {
    switch (theme.styles.shadowLevel) {
      case 'none':
        return {};
      case 'subtle':
        return { boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' };
      case 'moderate':
        return { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' };
      case 'elevated':
        return { boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' };
      default:
        return { boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' };
    }
  }

  private getThemedChartStyles(element: VisualElement, theme: typeof THEMES[ThemeId]) {
    try {
      const chartData = JSON.parse(element.content);
      
      // Update chart colors to match theme
      if (chartData.data && chartData.data.datasets) {
        chartData.data.datasets = chartData.data.datasets.map((dataset: any, index: number) => ({
          ...dataset,
          backgroundColor: Array.isArray(dataset.backgroundColor) 
            ? theme.chartColors
            : theme.chartColors[index % theme.chartColors.length],
          borderColor: theme.colors.primary,
          borderWidth: theme.styles.borderWidth
        }));
      }

      return {
        chartData: JSON.stringify(chartData)
      };
    } catch (error) {
      console.warn('Failed to parse chart data for theming:', error);
      return {};
    }
  }

  private getContrastColor(backgroundColor: string): string {
    // Simple contrast calculation - in a real app, you'd use a proper color library
    const darkColors = ['#000000', '#1f2937', '#374151', '#1e3a8a', '#7c3aed', '#0f172a'];
    return darkColors.includes(backgroundColor) ? '#ffffff' : '#000000';
  }

  generateThemePreview(themeId: ThemeId): VisualElement[] {
    const theme = THEMES[themeId];
    
    return [
      {
        id: 'preview-title',
        type: 'text',
        content: theme.name,
        position: { x: 20, y: 20 },
        size: { width: 200, height: 40 },
        style: {
          fontSize: 24,
          fontWeight: 'bold',
          textColor: theme.colors.primary,
          backgroundColor: 'transparent'
        }
      },
      {
        id: 'preview-card',
        type: 'shape',
        content: 'Sample Card',
        position: { x: 20, y: 80 },
        size: { width: 180, height: 100 },
        style: {
          backgroundColor: theme.colors.surface,
          textColor: theme.colors.primary,
          borderColor: theme.colors.secondary
        }
      },
      {
        id: 'preview-accent',
        type: 'shape',
        content: 'Accent',
        position: { x: 220, y: 80 },
        size: { width: 80, height: 40 },
        style: {
          backgroundColor: theme.colors.accent,
          textColor: this.getContrastColor(theme.colors.accent)
        }
      },
      {
        id: 'preview-chart',
        type: 'chart',
        content: JSON.stringify({
          type: 'bar',
          data: {
            labels: ['A', 'B', 'C'],
            datasets: [{
              data: [30, 50, 20],
              backgroundColor: theme.chartColors.slice(0, 3)
            }]
          }
        }),
        position: { x: 20, y: 200 },
        size: { width: 280, height: 120 },
        style: {
          backgroundColor: theme.colors.background
        }
      }
    ];
  }
}

export const themeRenderer = ThemeRenderer.getInstance();
