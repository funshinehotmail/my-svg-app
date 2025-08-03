import React from 'react';
import { useAppStore } from '../store/appStore';
import { ExportPanel } from '../components/export/ExportPanel';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Download, FileText, Presentation } from 'lucide-react';

export const ExportPage: React.FC = () => {
  const { 
    previousStep, 
    contentAnalysis, 
    visualSuggestions, 
    selectedTheme 
  } = useAppStore();

  const exportStats = {
    totalSlides: 3 + (visualSuggestions?.length || 0) + (contentAnalysis ? 1 : 0),
    visualElements: visualSuggestions?.length || 0,
    dataPoints: contentAnalysis?.dataPoints?.length || 0,
    keyInsights: contentAnalysis?.keyPoints?.length || 0
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Export Presentation</h1>
          <p className="text-gray-600 mt-2">
            Generate a professional PowerPoint presentation from your visual content
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={previousStep}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Editor
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Panel */}
        <div className="lg:col-span-2">
          <ExportPanel />
        </div>

        {/* Export Preview & Stats */}
        <div className="space-y-6">
          {/* Export Preview */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium flex items-center">
                <Presentation className="w-5 h-5 mr-2" />
                Presentation Preview
              </h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-lg border">
                  <div className="flex items-center justify-center h-24 bg-white rounded border-2 border-dashed border-blue-300">
                    <div className="text-center">
                      <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm text-blue-600 font-medium">Title Slide</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: Math.min(4, exportStats.totalSlides - 1) }).map((_, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded border">
                      <div className="flex items-center justify-center h-12 bg-white rounded border border-gray-200">
                        <div className="text-center">
                          <div className="w-4 h-4 bg-gray-300 rounded mx-auto mb-1"></div>
                          <p className="text-xs text-gray-500">Slide {index + 2}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {exportStats.totalSlides > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{exportStats.totalSlides - 5} more slides
                  </p>
                )}
              </div>
            </Card.Content>
          </Card>

          {/* Export Statistics */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium">Export Statistics</h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Slides</span>
                  <span className="font-medium">{exportStats.totalSlides}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Visual Elements</span>
                  <span className="font-medium">{exportStats.visualElements}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Data Points</span>
                  <span className="font-medium">{exportStats.dataPoints}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Key Insights</span>
                  <span className="font-medium">{exportStats.keyInsights}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-gray-600">Selected Theme</span>
                  <span className="font-medium capitalize">{selectedTheme || 'Professional'}</span>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Export Tips */}
          <Card className="bg-amber-50 border-amber-200">
            <Card.Header>
              <h3 className="text-lg font-medium text-amber-800">Export Tips</h3>
            </Card.Header>
            <Card.Content>
              <ul className="text-sm text-amber-700 space-y-2">
                <li>• Presentations are optimized for 16:9 widescreen format</li>
                <li>• Charts and visuals are embedded as high-quality graphics</li>
                <li>• Speaker notes are included when enabled</li>
                <li>• All content follows your selected theme styling</li>
                <li>• Files are compatible with PowerPoint 2016+</li>
              </ul>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};
