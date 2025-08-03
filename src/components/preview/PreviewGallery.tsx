import React from 'react';
import { useAppStore } from '../../store/appStore';
import { Eye, Download, Edit } from 'lucide-react';
import type { VisualSuggestion } from '../../types';

interface PreviewGalleryProps {
  suggestions: VisualSuggestion[];
  onSelect: (suggestion: VisualSuggestion) => void;
  onEdit: (suggestion: VisualSuggestion) => void;
}

export const PreviewGallery: React.FC<PreviewGalleryProps> = ({
  suggestions,
  onSelect,
  onEdit
}) => {
  const { selectedTheme } = useAppStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {suggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">{suggestion.icon}</div>
              <h3 className="font-semibold text-gray-800">{suggestion.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}
              </span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">
                  {Math.round(suggestion.confidence * 100)}% match
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => onSelect(suggestion)}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-1"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              
              <button
                onClick={() => onEdit(suggestion)}
                className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-1"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
