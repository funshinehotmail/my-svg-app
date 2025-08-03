import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { ThemeSelector } from '../theme/ThemeSelector';
import { ThemedVisualRenderer } from '../theme/ThemedVisualRenderer';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ArrowRight, ArrowLeft, Palette } from 'lucide-react';
import { type ThemeId } from '../../utils/constants';

export const ThemePreviewGallery: React.FC = () => {
  const { 
    selectedSuggestion, 
    selectedTheme, 
    setSelectedTheme, 
    setCurrentStep 
  } = useAppStore();
  
  const [showThemeSelector, setShowThemeSelector] = useState(!selectedTheme);

  const handleThemeSelect = (themeId: ThemeId) => {
    setSelectedTheme(themeId);
    setShowThemeSelector(false);
  };

  const handleContinue = () => {
    setCurrentStep('editing');
  };

  const handleBack = () => {
    setCurrentStep('preview');
  };

  if (!selectedSuggestion) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Visual Selected</h2>
        <p className="text-gray-600 mb-6">Please go back and select a visual design first.</p>
        <Button onClick={handleBack} variant="outline">
          Back to Preview
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Customize Your Theme
        </h1>
        <p className="text-lg text-gray-600">
          Choose colors and styling that match your brand and audience
        </p>
      </div>

      {/* Selected Visual Summary */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Selected Design</h3>
              <p className="text-sm text-gray-600">{selectedSuggestion.title}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowThemeSelector(!showThemeSelector)}
              className="flex items-center space-x-2"
            >
              <Palette className="w-4 h-4" />
              <span>{showThemeSelector ? 'Hide' : 'Change'} Themes</span>
            </Button>
          </div>
        </Card.Header>
      </Card>

      {/* Theme Selector */}
      {showThemeSelector && (
        <Card>
          <Card.Content className="p-6">
            <ThemeSelector
              selectedTheme={selectedTheme}
              onThemeSelect={handleThemeSelect}
            />
          </Card.Content>
        </Card>
      )}

      {/* Themed Preview */}
      {selectedTheme && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium">Preview with {selectedTheme} Theme</h3>
          </Card.Header>
          <Card.Content>
            <ThemedVisualRenderer
              elements={selectedSuggestion.elements}
              themeId={selectedTheme}
              className="w-full"
            />
          </Card.Content>
        </Card>
      )}

      {/* Multiple Theme Comparison */}
      {selectedTheme && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <Card.Header>
              <h4 className="font-medium">Current Theme: {selectedTheme}</h4>
            </Card.Header>
            <Card.Content>
              <ThemedVisualRenderer
                elements={selectedSuggestion.elements.slice(0, 3)}
                themeId={selectedTheme}
                className="w-full h-64"
              />
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <h4 className="font-medium">Alternative Preview</h4>
            </Card.Header>
            <Card.Content>
              <ThemedVisualRenderer
                elements={selectedSuggestion.elements.slice(0, 3)}
                themeId={selectedTheme === 'professional' ? 'creative' : 'professional'}
                className="w-full h-64"
              />
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleThemeSelect(selectedTheme === 'professional' ? 'creative' : 'professional')}
                >
                  Switch to this theme
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Designs</span>
        </Button>

        <Button
          onClick={handleContinue}
          disabled={!selectedTheme}
          className="flex items-center space-x-2"
          size="lg"
        >
          <span>Continue to Editor</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Theme Information */}
      {selectedTheme && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium">Theme Details</h3>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Color Scheme</h4>
                <p className="text-sm text-gray-600">
                  Carefully selected colors that work harmoniously together
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Typography</h4>
                <p className="text-sm text-gray-600">
                  Professional font pairings optimized for readability
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Visual Style</h4>
                <p className="text-sm text-gray-600">
                  Consistent spacing, shadows, and border treatments
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};
