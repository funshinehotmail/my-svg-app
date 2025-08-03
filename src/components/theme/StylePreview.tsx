import React from 'react';
import { type ThemeId, THEMES } from '../../utils/constants';
import { BarChart3 } from 'lucide-react';

interface StylePreviewProps {
  themeId: ThemeId;
  className?: string;
}

export const StylePreview: React.FC<StylePreviewProps> = ({ 
  themeId, 
  className = '' 
}) => {
  const theme = THEMES[themeId];

  return (
    <div 
      className={`relative w-full h-32 rounded-lg overflow-hidden border ${className}`}
      style={{ 
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.secondary + '40'
      }}
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, ${theme.colors.primary} 2px, transparent 2px)`,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Header Bar */}
      <div 
        className="h-8 flex items-center px-3"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <div 
          className="w-16 h-2 rounded-full"
          style={{ backgroundColor: theme.colors.primary }}
        />
        <div className="flex-1" />
        <div className="flex space-x-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: theme.colors.success }}
          />
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: theme.colors.warning }}
          />
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: theme.colors.error }}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 space-y-2">
        {/* Title */}
        <div 
          className="h-3 w-20 rounded"
          style={{ 
            backgroundColor: theme.colors.primary,
            borderRadius: theme.styles.borderRadius / 2
          }}
        />

        {/* Content Blocks */}
        <div className="flex space-x-2">
          <div 
            className="flex-1 h-12 rounded flex items-center justify-center"
            style={{ 
              backgroundColor: theme.colors.surface,
              borderRadius: theme.styles.borderRadius,
              border: `${theme.styles.borderWidth}px solid ${theme.colors.secondary}40`
            }}
          >
            <div 
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ backgroundColor: theme.colors.accent }}
            >
              <BarChart3 className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <div 
            className="w-12 h-12 rounded"
            style={{ 
              backgroundColor: theme.colors.accent,
              borderRadius: theme.styles.borderRadius
            }}
          />
        </div>

        {/* Chart Representation */}
        <div className="flex items-end space-x-1 h-8">
          {theme.chartColors.slice(0, 4).map((color, index) => (
            <div
              key={index}
              className="flex-1 rounded-t"
              style={{ 
                backgroundColor: color,
                height: `${20 + (index * 10)}px`,
                borderRadius: `${theme.styles.borderRadius / 2}px ${theme.styles.borderRadius / 2}px 0 0`
              }}
            />
          ))}
        </div>
      </div>

      {/* Theme Name Overlay */}
      <div className="absolute bottom-1 right-2">
        <span 
          className="text-xs font-medium px-2 py-1 rounded"
          style={{ 
            backgroundColor: theme.colors.primary + '20',
            color: theme.colors.primary,
            borderRadius: theme.styles.borderRadius / 2
          }}
        >
          {theme.name}
        </span>
      </div>
    </div>
  );
};
