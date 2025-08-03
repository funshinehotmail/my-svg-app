import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Eye, Edit, BarChart3, Clock, GitCompare, FileImage, Network } from 'lucide-react';
import type { VisualSuggestion } from '../../types';

interface VisualSuggestionCardProps {
  suggestion: VisualSuggestion;
  onSelect: (suggestion: VisualSuggestion) => void;
  isSelected?: boolean;
  className?: string;
}

const visualTypeIcons = {
  chart: BarChart3,
  timeline: Clock,
  comparison: GitCompare,
  infographic: FileImage,
  diagram: Network
};

export const VisualSuggestionCard: React.FC<VisualSuggestionCardProps> = ({
  suggestion,
  onSelect,
  isSelected = false,
  className = ''
}) => {
  const Icon = visualTypeIcons[suggestion.visualType] || FileImage;
  const confidencePercentage = Math.round(suggestion.confidence * 100);

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-200' : ''
      } ${className}`}
      onClick={() => onSelect(suggestion)}
    >
      <Card.Content className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">{suggestion.title}</h3>
          </div>
          <Badge variant={confidencePercentage >= 80 ? "default" : "secondary"}>
            {confidencePercentage}% match
          </Badge>
        </div>

        {/* Preview Area */}
        <div className="bg-gray-50 rounded-lg p-4 mb-3 h-32 flex items-center justify-center">
          <div className="text-center">
            <Icon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500 capitalize">
              {suggestion.visualType} Preview
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {suggestion.description}
        </p>

        {/* Elements Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{suggestion.elements.length} elements</span>
          <span className="capitalize">{suggestion.visualType}</span>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(suggestion);
            }}
            size="sm"
            className="flex-1"
            variant={isSelected ? "default" : "outline"}
          >
            <Eye className="w-4 h-4 mr-1" />
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};
