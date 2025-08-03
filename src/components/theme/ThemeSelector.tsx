import React from 'react';
import { useAppStore } from '../../store/appStore';
import { Check, Palette } from 'lucide-react';
import type { Theme } from '../../types';

const themes: Theme[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#10B981',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#1F2937',
      textSecondary: '#6B7280'
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      headingSize: '2rem',
      bodySize: '1rem'
    }
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional business style',
    colors: {
      primary: '#1E40AF',
      secondary: '#374151',
      accent: '#059669',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#4B5563'
    },
    typography: {
      headingFont: 'Roboto',
      bodyFont: 'Roboto',
      headingSize: '1.875rem',
      bodySize: '0.875rem'
    }
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and artistic approach',
    colors: {
      primary: '#EC4899',
      secondary: '#F59E0B',
      accent: '#8B5CF6',
      background: '#FEFEFE',
      surface: '#FDF2F8',
      text: '#1F2937',
      textSecondary: '#6B7280'
    },
    typography: {
      headingFont: 'Poppins',
      bodyFont: 'Open Sans',
      headingSize: '2.25rem',
      bodySize: '1rem'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant design',
    colors: {
      primary: '#000000',
      secondary: '#6B7280',
      accent: '#3B82F6',
      background: '#FFFFFF',
      surface: '#FAFAFA',
      text: '#000000',
      textSecondary: '#6B7280'
    },
    typography: {
      headingFont: 'Helvetica',
      bodyFont: 'Helvetica',
      headingSize: '1.75rem',
      bodySize: '0.875rem'
    }
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Energetic and colorful style',
    colors: {
      primary: '#DC2626',
      secondary: '#EA580C',
      accent: '#16A34A',
      background: '#FFFFFF',
      surface: '#FEF2F2',
      text: '#1F2937',
      textSecondary: '#6B7280'
    },
    typography: {
      headingFont: 'Montserrat',
      bodyFont: 'Source Sans Pro',
      headingSize: '2rem',
      bodySize: '1rem'
    }
  }
];

export const ThemeSelector: React.FC = () => {
  const { selectedTheme, setSelectedTheme } = useAppStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <Palette className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Choose Theme</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedTheme?.id === theme.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
            onClick={() => setSelectedTheme(theme)}
          >
            {selectedTheme?.id === theme.id && (
              <div className="absolute top-2 right-2">
                <Check className="w-5 h-5 text-blue-600" />
              </div>
            )}
            
            <div className="mb-3">
              <div className="flex space-x-1 mb-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.colors.secondary }}
                />
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.colors.accent }}
                />
              </div>
              
              <h4 className="font-semibold text-gray-900">{theme.name}</h4>
              <p className="text-sm text-gray-600">{theme.description}</p>
            </div>
            
            <div className="text-xs text-gray-500">
              <div>Font: {theme.typography.headingFont}</div>
              <div>Style: {theme.colors.primary}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
