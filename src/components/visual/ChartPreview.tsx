import React, { useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { BarChart3, LineChart, PieChart, TrendingUp, Zap } from 'lucide-react';
import type { VisualElement, DataPoint } from '../../types';
import { chartGenerator, type ChartConfig } from '../../services/visual/chartGenerator';

interface ChartPreviewProps {
  dataPoints: DataPoint[];
  chartType: ChartConfig['type'];
  onSelect?: (chart: VisualElement) => void;
  onCustomize?: (chartType: ChartConfig['type']) => void;
  className?: string;
}

const chartTypeIcons = {
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  doughnut: PieChart,
  scatter: Zap,
  area: TrendingUp
};

const chartTypeNames = {
  bar: 'Bar Chart',
  line: 'Line Chart',
  pie: 'Pie Chart',
  doughnut: 'Doughnut Chart',
  scatter: 'Scatter Plot',
  area: 'Area Chart'
};

export const ChartPreview: React.FC<ChartPreviewProps> = ({
  dataPoints,
  chartType,
  onSelect,
  onCustomize,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  const Icon = chartTypeIcons[chartType];
  const chartName = chartTypeNames[chartType];
  const isValidData = chartGenerator.validateDataForChart(dataPoints, chartType);
  const preview = chartGenerator.getChartPreview(dataPoints, chartType);

  useEffect(() => {
    if (!canvasRef.current || !isValidData) return;

    // Cleanup previous chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new chart (mock implementation for preview)
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      // Simple preview rendering
      renderChartPreview(ctx, dataPoints, chartType);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [dataPoints, chartType, isValidData]);

  const renderChartPreview = (ctx: CanvasRenderingContext2D, data: DataPoint[], type: ChartConfig['type']) => {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    if (data.length === 0) return;

    const values = data.map(d => typeof d.value === 'number' ? d.value : 0);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;

    switch (type) {
      case 'bar':
        renderBarPreview(ctx, values, width, height, maxValue);
        break;
      case 'line':
      case 'area':
        renderLinePreview(ctx, values, width, height, maxValue, minValue, type === 'area');
        break;
      case 'pie':
      case 'doughnut':
        renderPiePreview(ctx, values, width, height, type === 'doughnut');
        break;
      case 'scatter':
        renderScatterPreview(ctx, values, width, height, maxValue, minValue);
        break;
    }
  };

  const renderBarPreview = (ctx: CanvasRenderingContext2D, values: number[], width: number, height: number, maxValue: number) => {
    const barWidth = width / values.length * 0.8;
    const barSpacing = width / values.length * 0.2;
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

    values.forEach((value, index) => {
      const barHeight = (value / maxValue) * height * 0.8;
      const x = index * (barWidth + barSpacing) + barSpacing / 2;
      const y = height - barHeight - 20;

      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(x, y, barWidth, barHeight);
    });
  };

  const renderLinePreview = (ctx: CanvasRenderingContext2D, values: number[], width: number, height: number, maxValue: number, minValue: number, filled: boolean) => {
    if (values.length < 2) return;

    const stepX = width / (values.length - 1);
    const range = maxValue - minValue || 1;

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();

    values.forEach((value, index) => {
      const x = index * stepX;
      const y = height - ((value - minValue) / range) * height * 0.8 - 20;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    if (filled) {
      ctx.fillStyle = '#3b82f620';
      ctx.lineTo(width, height - 20);
      ctx.lineTo(0, height - 20);
      ctx.closePath();
      ctx.fill();
    }
  };

  const renderPiePreview = (ctx: CanvasRenderingContext2D, values: number[], width: number, height: number, isDoughnut: boolean) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;
    const total = values.reduce((sum, val) => sum + val, 0);
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

    let currentAngle = -Math.PI / 2;

    values.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      
      ctx.fillStyle = colors[index % colors.length];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      currentAngle += sliceAngle;
    });

    if (isDoughnut) {
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const renderScatterPreview = (ctx: CanvasRenderingContext2D, values: number[], width: number, height: number, maxValue: number, minValue: number) => {
    const range = maxValue - minValue || 1;
    ctx.fillStyle = '#3b82f6';

    values.forEach((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - minValue) / range) * height * 0.8 - 20;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const handleSelect = () => {
    if (onSelect && isValidData) {
      const chart = chartGenerator.generateCustomChart(dataPoints, chartType);
      onSelect(chart);
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${className}`}>
      <Card.Content className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">{chartName}</h3>
          </div>
          <Badge variant={isValidData ? "secondary" : "destructive"}>
            {dataPoints.length} points
          </Badge>
        </div>

        {/* Chart Preview */}
        <div className="bg-gray-50 rounded-lg p-4 mb-3 h-32 flex items-center justify-center">
          {isValidData ? (
            <canvas
              ref={canvasRef}
              width={200}
              height={100}
              className="max-w-full max-h-full"
            />
          ) : (
            <div className="text-center text-gray-500">
              <Icon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-xs">Insufficient data</p>
            </div>
          )}
        </div>

        {/* Preview Text */}
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {preview}
        </p>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            onClick={handleSelect}
            disabled={!isValidData}
            size="sm"
            className="flex-1"
          >
            Select
          </Button>
          {onCustomize && (
            <Button
              onClick={() => onCustomize(chartType)}
              variant="outline"
              size="sm"
            >
              Customize
            </Button>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};
