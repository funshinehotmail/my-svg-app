import React from 'react';
import { Brain, BarChart3, Target, Lightbulb, CheckCircle } from 'lucide-react';
import { usePresentationStore } from '../../store/presentationStore';

export const AnalysisResults: React.FC = () => {
  const { currentPresentation } = usePresentationStore();
  const analysis = currentPresentation.contentAnalysis;

  if (!analysis) {
    return null;
  }

  const { extractedData, smartAnalysis } = analysis;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Brain className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          AI Analysis Complete
        </h3>
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span>Analysis successful</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Overview */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h4 className="text-lg font-medium text-gray-900">Content Overview</h4>
          </div>

          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Key Points Extracted</h5>
              <div className="space-y-2">
                {extractedData.keyPoints.slice(0, 3).map((point, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{point}</span>
                  </div>
                ))}
                {extractedData.keyPoints.length > 3 && (
                  <div className="text-sm text-gray-500">
                    +{extractedData.keyPoints.length - 3} more points identified
                  </div>
                )}
              </div>
            </div>

            {extractedData.dataPoints.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Data Points Found</h5>
                <div className="flex flex-wrap gap-2">
                  {extractedData.dataPoints.slice(0, 6).map((data, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {data}
                    </span>
                  ))}
                  {extractedData.dataPoints.length > 6 && (
                    <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                      +{extractedData.dataPoints.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-5 h-5 text-purple-600" />
            <h4 className="text-lg font-medium text-gray-900">AI Recommendations</h4>
          </div>

          {smartAnalysis && (
            <div className="space-y-3">
              {/* Visualization Scoring */}
              {smartAnalysis.scoring && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Content Analysis Scores</h5>
                  <div className="space-y-2">
                    {Object.entries(smartAnalysis.scoring).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(value as number) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {Math.round((value as number) * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {smartAnalysis.recommendations && smartAnalysis.recommendations.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-2">AI Recommendations</h5>
                  <div className="space-y-2">
                    {smartAnalysis.recommendations.slice(0, 3).map((rec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Visual Suggestions Preview */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          Generated Visual Suggestions ({analysis.suggestions.length})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysis.suggestions.slice(0, 3).map((suggestion, index) => (
            <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900">{suggestion.title}</h5>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {Math.round(suggestion.confidence * 100)}% match
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 capitalize">
                  {suggestion.visualType}
                </span>
                <span className="text-xs text-gray-500">
                  {suggestion.elements?.length || 0} elements
                </span>
              </div>
            </div>
          ))}
        </div>
        {analysis.suggestions.length > 3 && (
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-500">
              +{analysis.suggestions.length - 3} more suggestions available in the next step
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
