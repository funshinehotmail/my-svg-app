import type { DataPoint, VisualElement } from '../../types';

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'scatter' | 'area';
  title?: string;
  colors?: string[];
  responsive?: boolean;
  animation?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
  }[];
}

export class ChartGenerator {
  private static instance: ChartGenerator;
  
  static getInstance(): ChartGenerator {
    if (!ChartGenerator.instance) {
      ChartGenerator.instance = new ChartGenerator();
    }
    return ChartGenerator.instance;
  }

  private defaultColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', 
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];

  generateChart(dataPoints: DataPoint[], config: ChartConfig): VisualElement {
    const chartData = this.prepareChartData(dataPoints, config);
    const chartOptions = this.generateChartOptions(config);

    return {
      id: `chart-${config.type}-${Date.now()}`,
      type: 'chart',
      content: JSON.stringify({
        type: config.type,
        data: chartData,
        options: chartOptions
      }),
      position: { x: 100, y: 100 },
      size: { width: 500, height: 350 },
      style: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }
    };
  }

  generateMultipleCharts(dataPoints: DataPoint[]): VisualElement[] {
    const charts: VisualElement[] = [];
    const optimalTypes = this.determineOptimalChartTypes(dataPoints);

    optimalTypes.forEach((type, index) => {
      const config: ChartConfig = {
        type,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
        colors: this.defaultColors,
        responsive: true,
        animation: true
      };

      const chart = this.generateChart(dataPoints, config);
      chart.position = { 
        x: 50 + (index % 2) * 400, 
        y: 50 + Math.floor(index / 2) * 400 
      };
      charts.push(chart);
    });

    return charts;
  }

  private prepareChartData(dataPoints: DataPoint[], config: ChartConfig): ChartData {
    const colors = config.colors || this.defaultColors;
    
    // Sort data points for better visualization
    const sortedData = this.sortDataPoints(dataPoints, config.type);
    
    const labels = sortedData.map(point => this.formatLabel(point));
    const values = sortedData.map(point => typeof point.value === 'number' ? point.value : 0);

    const dataset = {
      label: 'Data',
      data: values,
      backgroundColor: this.getBackgroundColors(config.type, colors, values.length),
      borderColor: this.getBorderColors(config.type, colors, values.length),
      borderWidth: config.type === 'line' ? 3 : 1,
      fill: config.type === 'area'
    };

    return {
      labels,
      datasets: [dataset]
    };
  }

  private sortDataPoints(dataPoints: DataPoint[], chartType: string): DataPoint[] {
    const sorted = [...dataPoints];

    switch (chartType) {
      case 'line':
        // Sort by value for line charts (usually temporal)
        if (dataPoints.some(d => d.category === 'year')) {
          return sorted.sort((a, b) => (a.value as number) - (b.value as number));
        }
        break;
      case 'bar':
        // Sort by value descending for bar charts
        return sorted.sort((a, b) => (b.value as number) - (a.value as number));
      case 'pie':
      case 'doughnut':
        // Sort by value descending for pie charts
        return sorted.sort((a, b) => (b.value as number) - (a.value as number));
    }

    return sorted;
  }

  private formatLabel(dataPoint: DataPoint): string {
    // Extract meaningful label from data point
    if (dataPoint.label.includes(':')) {
      return dataPoint.label.split(':')[0].trim();
    }
    
    // Remove common prefixes/suffixes
    let label = dataPoint.label.replace(/^\$/, '').replace(/%$/, '');
    
    // Truncate long labels
    if (label.length > 15) {
      label = label.substring(0, 12) + '...';
    }
    
    return label;
  }

  private getBackgroundColors(chartType: string, colors: string[], dataLength: number): string | string[] {
    if (chartType === 'pie' || chartType === 'doughnut') {
      return colors.slice(0, dataLength);
    }
    
    if (chartType === 'line' || chartType === 'area') {
      return colors[0] + '20'; // Add transparency
    }
    
    return colors[0];
  }

  private getBorderColors(chartType: string, colors: string[], dataLength: number): string | string[] {
    if (chartType === 'pie' || chartType === 'doughnut') {
      return colors.slice(0, dataLength);
    }
    
    return colors[0];
  }

  private generateChartOptions(config: ChartConfig) {
    const baseOptions = {
      responsive: config.responsive !== false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          display: true
        },
        title: {
          display: !!config.title,
          text: config.title || '',
          font: {
            size: 16,
            weight: 'bold' as const
          }
        }
      },
      animation: config.animation !== false ? {
        duration: 1000,
        easing: 'easeInOutQuart' as const
      } : false
    };

    // Chart-specific options
    switch (config.type) {
      case 'bar':
        return {
          ...baseOptions,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#f3f4f6'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        };

      case 'line':
      case 'area':
        return {
          ...baseOptions,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#f3f4f6'
              }
            },
            x: {
              grid: {
                color: '#f3f4f6'
              }
            }
          },
          elements: {
            point: {
              radius: 4,
              hoverRadius: 6
            },
            line: {
              tension: 0.4
            }
          }
        };

      case 'pie':
      case 'doughnut':
        return {
          ...baseOptions,
          plugins: {
            ...baseOptions.plugins,
            legend: {
              position: 'right' as const
            }
          }
        };

      case 'scatter':
        return {
          ...baseOptions,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: '#f3f4f6'
              }
            },
            x: {
              beginAtZero: true,
              grid: {
                color: '#f3f4f6'
              }
            }
          },
          elements: {
            point: {
              radius: 6,
              hoverRadius: 8
            }
          }
        };

      default:
        return baseOptions;
    }
  }

  private determineOptimalChartTypes(dataPoints: DataPoint[]): ChartConfig['type'][] {
    const types: ChartConfig['type'][] = [];
    
    // Analyze data characteristics
    const hasTimeData = dataPoints.some(d => d.category === 'year');
    const hasPercentages = dataPoints.some(d => d.category === 'percentage');
    const hasCurrency = dataPoints.some(d => d.category === 'currency');
    const hasRatings = dataPoints.some(d => d.category === 'rating');
    const dataCount = dataPoints.length;

    // Time series data - line chart
    if (hasTimeData && dataCount >= 3) {
      types.push('line');
    }

    // Percentage data with few items - pie chart
    if (hasPercentages && dataCount <= 6) {
      types.push('pie');
    }

    // Currency or rating data - bar chart
    if (hasCurrency || hasRatings || dataCount >= 3) {
      types.push('bar');
    }

    // Many data points - scatter plot
    if (dataCount >= 8) {
      types.push('scatter');
    }

    // Area chart for trend data
    if (hasTimeData && dataCount >= 4) {
      types.push('area');
    }

    // Default to bar chart if no specific patterns
    if (types.length === 0) {
      types.push('bar');
    }

    // Limit to 3 chart types
    return types.slice(0, 3);
  }

  // Utility methods for chart customization
  generateCustomChart(
    dataPoints: DataPoint[], 
    chartType: ChartConfig['type'],
    customOptions: Partial<ChartConfig> = {}
  ): VisualElement {
    const config: ChartConfig = {
      type: chartType,
      title: customOptions.title || `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
      colors: customOptions.colors || this.defaultColors,
      responsive: customOptions.responsive !== false,
      animation: customOptions.animation !== false
    };

    return this.generateChart(dataPoints, config);
  }

  getChartPreview(dataPoints: DataPoint[], chartType: ChartConfig['type']): string {
    // Generate a simple text preview of what the chart would look like
    const sortedData = this.sortDataPoints(dataPoints, chartType);
    const preview = sortedData.slice(0, 5).map(point => 
      `${this.formatLabel(point)}: ${point.value}`
    ).join(', ');

    return `${chartType.toUpperCase()} - ${preview}${sortedData.length > 5 ? '...' : ''}`;
  }

  validateDataForChart(dataPoints: DataPoint[], chartType: ChartConfig['type']): boolean {
    if (dataPoints.length === 0) return false;

    switch (chartType) {
      case 'pie':
      case 'doughnut':
        return dataPoints.length <= 8 && dataPoints.every(d => typeof d.value === 'number' && d.value > 0);
      case 'line':
      case 'area':
        return dataPoints.length >= 2;
      case 'scatter':
        return dataPoints.length >= 3;
      default:
        return dataPoints.length >= 1;
    }
  }
}

export const chartGenerator = ChartGenerator.getInstance();
