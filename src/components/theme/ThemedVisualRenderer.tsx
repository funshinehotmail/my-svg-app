import React from 'react';
import { type ThemeId } from '../../utils/constants';
import { themeRenderer } from '../../services/theme/themeRenderer';
import type { VisualElement } from '../../types';

interface ThemedVisualRendererProps {
  elements: VisualElement[];
  themeId: ThemeId;
  className?: string;
}

export const ThemedVisualRenderer: React.FC<ThemedVisualRendererProps> = ({
  elements,
  themeId,
  className = ''
}) => {
  const themedElements = themeRenderer.applyThemeToElements(elements, themeId);

  return (
    <div className={`relative bg-white rounded-lg border overflow-hidden ${className}`}>
      <svg
        width="100%"
        height="400"
        viewBox="0 0 800 400"
        className="w-full h-full"
      >
        {themedElements.map((element) => {
          switch (element.type) {
            case 'text':
              return (
                <g key={element.id}>
                  {/* Background rectangle for text */}
                  <rect
                    x={element.position.x}
                    y={element.position.y}
                    width={element.size.width}
                    height={element.size.height}
                    fill={element.style?.backgroundColor || '#ffffff'}
                    stroke={element.style?.borderColor || 'transparent'}
                    strokeWidth={element.style?.borderWidth || 0}
                    rx={element.style?.borderRadius || 0}
                  />
                  {/* Text content */}
                  <text
                    x={element.position.x + (element.style?.padding || 12)}
                    y={element.position.y + (element.size.height / 2)}
                    fill={element.style?.textColor || '#000000'}
                    fontSize={element.style?.fontSize || 14}
                    fontFamily={element.style?.fontFamily || 'Inter, sans-serif'}
                    fontWeight={element.style?.fontWeight || 'normal'}
                    dominantBaseline="middle"
                    className="select-none"
                  >
                    {element.content.length > 50 
                      ? element.content.substring(0, 50) + '...' 
                      : element.content
                    }
                  </text>
                </g>
              );

            case 'shape':
              return (
                <g key={element.id}>
                  <rect
                    x={element.position.x}
                    y={element.position.y}
                    width={element.size.width}
                    height={element.size.height}
                    fill={element.style?.backgroundColor || '#3b82f6'}
                    stroke={element.style?.borderColor || 'transparent'}
                    strokeWidth={element.style?.borderWidth || 0}
                    rx={element.style?.borderRadius || 0}
                  />
                  <text
                    x={element.position.x + element.size.width / 2}
                    y={element.position.y + element.size.height / 2}
                    fill={element.style?.textColor || '#ffffff'}
                    fontSize={element.style?.fontSize || 14}
                    fontFamily={element.style?.fontFamily || 'Inter, sans-serif'}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="select-none"
                  >
                    {element.content}
                  </text>
                </g>
              );

            case 'chart':
              return (
                <g key={element.id}>
                  <rect
                    x={element.position.x}
                    y={element.position.y}
                    width={element.size.width}
                    height={element.size.height}
                    fill={element.style?.backgroundColor || '#ffffff'}
                    stroke={element.style?.borderColor || '#e5e7eb'}
                    strokeWidth={element.style?.borderWidth || 1}
                    rx={element.style?.borderRadius || 8}
                  />
                  {/* Simple chart representation */}
                  <rect
                    x={element.position.x + 20}
                    y={element.position.y + element.size.height - 60}
                    width={30}
                    height={40}
                    fill="#3b82f6"
                    rx={2}
                  />
                  <rect
                    x={element.position.x + 60}
                    y={element.position.y + element.size.height - 80}
                    width={30}
                    height={60}
                    fill="#10b981"
                    rx={2}
                  />
                  <rect
                    x={element.position.x + 100}
                    y={element.position.y + element.size.height - 50}
                    width={30}
                    height={30}
                    fill="#f59e0b"
                    rx={2}
                  />
                  <text
                    x={element.position.x + element.size.width / 2}
                    y={element.position.y + 20}
                    fill={element.style?.textColor || '#1f2937'}
                    fontSize="12"
                    textAnchor="middle"
                    className="select-none"
                  >
                    Chart Visualization
                  </text>
                </g>
              );

            default:
              return null;
          }
        })}
      </svg>
    </div>
  );
};
