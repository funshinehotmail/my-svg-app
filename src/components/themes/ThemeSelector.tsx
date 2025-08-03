import React from 'react';
import { Palette, Check } from 'lucide-react';
import { usePresentationStore } from '../../store/presentationStore';

const themes = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design',
    colors: ['#3B82F6', '#1E40AF', '#F3F4F6', '#111827'],
    preview: 'bg-gradient-to-br from-blue-500 to-blue-700'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate and business-focused',
    colors: ['#374151', '#6B7280', '#F9FAFB', '#1F2937'],
    preview: 'bg-gradient-to-br from-gray-600 to-gray-800'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant and artistic',
    colors: ['#8B5CF6', '#A855F7', '#F3E8FF', '#581C87'],
    preview: 'bg-gradient-to-br from-purple-500 to-purple-700'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant',
    colors: ['#000000', '#6B7280', '#FFFFFF', '#F3F4F6'],
    preview: 'bg-gradient-to-br from-gray-900 to-black'
  },
  {
    id: 'warm',
    name: 'Warm',
    description: 'Friendly and approachable',
    colors: ['#F59E0B', '#D97706', '#FEF3C7', '#92400E'],
    preview: 'bg-gradient-to-br from-amber-500 to-amber-700'
  },
  {
    id: 'cool',
    name: 'Cool',
    description: 'Fresh and calming',
    colors: ['#06B6D4', '#0891B2', '#CFFAFE', '#164E63'],
    preview: 'bg-gradient-to-br from-cyan-500 to-cyan-700'
  }
];

export const ThemeSelector: React.FC = () => {
  const { currentPresentation, setSelectedTheme } = usePresentationStore();
  const selectedTheme = currentPresentation.selectedTheme;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Palette className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          Choose Your Theme
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setSelectedTheme(theme.id)}
            className={`relative p-4 rounded-lg border-2 transition-all hover:border-purple-300 ${
              selectedTheme === theme.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            {/* Theme Preview */}
            <div className={`w-full h-20 rounded-lg mb-3 ${theme.preview}`} />
            
            {/* Theme Info */}
            <div className="text-left">
              <div className="flex items-center justify-between mb-1">
                <h4 className={`font-medium ${
                  selectedTheme === theme.id ? 'text-purple-900' : 'text-gray-900'
                }`}>
                  {theme.name}
                </h4>
                {selectedTheme === theme.id && (
                  <Check className="w-5 h-5 text-purple-600" />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {theme.description}
              </p>
              
              {/* Color Palette */}
              <div className="flex space-x-1">
                {theme.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Theme Features</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Consistent color scheme across all slides</li>
          <li>• Optimized typography and spacing</li>
          <li>• Professional visual hierarchy</li>
          <li>• Export-ready for PowerPoint</li>
        </ul>
      </div>
    </div>
  );
};
