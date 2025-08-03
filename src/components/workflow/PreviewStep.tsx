import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Eye, Edit, Download, Sparkles, BarChart3, Users, FileText } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { VisualSuggestionCard } from '../visual/VisualSuggestionCard';
import { ChartPreview } from '../visual/ChartPreview';
import { chartGenerator } from '../../services/visual/chartGenerator';

interface PreviewStepProps {
  onNext: () => void;
  onEdit: () => void;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({ onNext, onEdit }) => {
  const { 
    contentAnalysis, 
    visualSuggestions, 
    selectedSuggestion, 
    setSelectedSuggestion 
  } = useAppStore();
  
  const [activeTab, setActiveTab] = useState('suggestions');

  if (!contentAnalysis) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No content analysis available</p>
      </div>
    );
  }

  const { extractedData } = contentAnalysis;
  const hasDataPoints = extractedData.dataPoints.length > 0;
  const hasRelationships = extractedData.relationships.length > 0;

  const chartTypes = hasDataPoints ? chartGenerator['determineOptimalChartTypes'](extractedData.dataPoints) : [];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Preview & Select Your Visual
        </h2>
        <p className="text-gray-600">
          Choose from AI-generated suggestions or explore different chart options
        </p>
      </div>

      {/* Content Summary */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Content Analysis Summary
            </h3>
            <div className="flex space-x-2">
              <Badge variant="secondary">
                {extractedData.keyPoints.length} key points
              </Badge>
              <Badge variant="secondary">
                {extractedData.dataPoints.length} data points
              </Badge>
              <Badge variant={extractedData.sentiment === 'positive' ? 'default' : 'secondary'}>
                {extractedData.sentiment} sentiment
              </Badge>
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Insights</h4>
              <ul className="space-y-1">
                {extractedData.keyPoints.slice(0, 3).map((point, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Data Overview</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Complexity:</span>
                  <Badge variant="outline">{extractedData.complexity}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Relationships:</span>
                  <span className="text-gray-900">{extractedData.relationships.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Data Categories:</span>
                  <span className="text-gray-900">
                    {[...new Set(extractedData.dataPoints.map(d => d.category))].length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Visual Options */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggestions" className="flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Suggestions ({visualSuggestions.length})
          </TabsTrigger>
          <TabsTrigger value="charts" disabled={!hasDataPoints} className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Charts ({chartTypes.length})
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4">
          {visualSuggestions.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visualSuggestions.map((suggestion) => (
                <VisualSuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onSelect={setSelectedSuggestion}
                  isSelected={selectedSuggestion?.id === suggestion.id}
                />
              ))}
            </div>
          ) : (
            <Card>
              <Card.Content className="text-center py-12">
                <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No visual suggestions generated</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adding more content or data points
                </p>
              </Card.Content>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          {hasDataPoints ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chartTypes.map((chartType) => (
                <ChartPreview
                  key={chartType}
                  dataPoints={extractedData.dataPoints}
                  chartType={chartType}
                  onSelect={(chart) => {
                    // Convert chart to visual suggestion format
                    const suggestion = {
                      id: `chart-${chartType}-${Date.now()}`,
                      title: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
                      description: `Visualize your data with a ${chartType} chart`,
                      visualType: 'chart' as const,
                      elements: [chart],
                      confidence: 0.8
                    };
                    setSelectedSuggestion(suggestion);
                  }}
                />
              ))}
            </div>
          ) : (
            <Card>
              <Card.Content className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No numerical data found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Add numbers, percentages, or dates to see chart options
                </p>
              </Card.Content>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">Data Points</h3>
              </Card.Header>
              <Card.Content>
                {extractedData.dataPoints.length > 0 ? (
                  <div className="space-y-2">
                    {extractedData.dataPoints.slice(0, 8).map((point, index) => (
                      <div key={point.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{point.label}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {point.category}
                          </Badge>
                          <span className="text-sm font-medium">{point.value}</span>
                        </div>
                      </div>
                    ))}
                    {extractedData.dataPoints.length > 8 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{extractedData.dataPoints.length - 8} more data points
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No data points extracted</p>
                )}
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">Relationships</h3>
              </Card.Header>
              <Card.Content>
                {extractedData.relationships.length > 0 ? (
                  <div className="space-y-2">
                    {extractedData.relationships.map((rel, index) => (
                      <div key={rel.id} className="p-2 bg-gray-50 rounded">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">
                            {rel.source} → {rel.target}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {rel.type}
                          </Badge>
                        </div>
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-blue-500 h-1 rounded-full" 
                              style={{ width: `${rel.strength * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No relationships detected</p>
                )}
              </Card.Content>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <div className="flex items-center space-x-4">
          {selectedSuggestion && (
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">
                Selected: {selectedSuggestion.title}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Customize
          </Button>
          <Button 
            onClick={onNext}
            disabled={!selectedSuggestion}
          >
            Continue to Themes
          </Button>
        </div>
      </div>
    </div>
  );
};
