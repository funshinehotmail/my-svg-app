import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { CheckCircle, AlertCircle, Loader2, Brain, BarChart3, Palette, Lightbulb } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useAIAnalysis } from '../../hooks/useAIAnalysis';

interface ProcessingStepProps {
  onComplete: () => void;
}

interface ProcessingStage {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  duration: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export const ProcessingStep: React.FC<ProcessingStepProps> = ({ onComplete }) => {
  const { content, setContentAnalysis, setVisualSuggestions, setError } = useAppStore();
  const { analyzeContent, loading } = useAIAnalysis();
  
  const [currentStage, setCurrentStage] = useState(0);
  const [stages, setStages] = useState<ProcessingStage[]>([
    {
      id: 'content-analysis',
      name: 'Content Analysis',
      description: 'Analyzing your content for key insights and data points',
      icon: Brain,
      duration: 2000,
      status: 'pending'
    },
    {
      id: 'data-extraction',
      name: 'Data Extraction',
      description: 'Identifying numerical data, relationships, and patterns',
      icon: BarChart3,
      duration: 1500,
      status: 'pending'
    },
    {
      id: 'visual-suggestions',
      name: 'Visual Suggestions',
      description: 'Generating optimal visual layouts and chart recommendations',
      icon: Lightbulb,
      duration: 1800,
      status: 'pending'
    },
    {
      id: 'theme-preparation',
      name: 'Theme Preparation',
      description: 'Preparing visual themes and styling options',
      icon: Palette,
      duration: 1000,
      status: 'pending'
    }
  ]);

  useEffect(() => {
    if (content) {
      startProcessing();
    }
  }, [content]);

  const startProcessing = async () => {
    if (!content) return;

    try {
      // Process each stage sequentially
      for (let i = 0; i < stages.length; i++) {
        setCurrentStage(i);
        
        // Update stage status to processing
        setStages(prev => prev.map((stage, index) => 
          index === i ? { ...stage, status: 'processing' } : stage
        ));

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, stages[i].duration));

        // Perform actual processing for the first stage
        if (i === 0) {
          const analysis = await analyzeContent(content);
          if (analysis) {
            setContentAnalysis(analysis);
            setVisualSuggestions(analysis.suggestions);
          } else {
            throw new Error('Failed to analyze content');
          }
        }

        // Update stage status to completed
        setStages(prev => prev.map((stage, index) => 
          index === i ? { ...stage, status: 'completed' } : stage
        ));
      }

      // All stages completed
      setTimeout(() => {
        onComplete();
      }, 500);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Processing failed';
      setError(errorMessage);
      
      // Mark current stage as error
      setStages(prev => prev.map((stage, index) => 
        index === currentStage ? { ...stage, status: 'error' } : stage
      ));
    }
  };

  const getOverallProgress = () => {
    const completedStages = stages.filter(stage => stage.status === 'completed').length;
    return (completedStages / stages.length) * 100;
  };

  const getStageIcon = (stage: ProcessingStage) => {
    const IconComponent = stage.icon;
    
    switch (stage.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <IconComponent className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStageStatusColor = (stage: ProcessingStage) => {
    switch (stage.status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'processing':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Processing Your Content
        </h2>
        <p className="text-gray-600">
          Our AI is analyzing your content and generating visual suggestions
        </p>
      </div>

      {/* Overall Progress */}
      <Card>
        <Card.Content className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-500">{Math.round(getOverallProgress())}%</span>
          </div>
          <Progress value={getOverallProgress()} className="h-2" />
        </Card.Content>
      </Card>

      {/* Processing Stages */}
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <Card key={stage.id} className={`transition-all duration-300 ${getStageStatusColor(stage)}`}>
            <Card.Content className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {getStageIcon(stage)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900">
                    {stage.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {stage.description}
                  </p>
                  {stage.status === 'processing' && (
                    <div className="mt-2">
                      <Progress value={75} className="h-1" />
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {stage.status === 'completed' && (
                    <span className="text-xs text-green-600 font-medium">Complete</span>
                  )}
                  {stage.status === 'error' && (
                    <span className="text-xs text-red-600 font-medium">Error</span>
                  )}
                  {stage.status === 'processing' && (
                    <span className="text-xs text-blue-600 font-medium">Processing...</span>
                  )}
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {/* Content Preview */}
      {content && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Content Being Processed</h3>
          </Card.Header>
          <Card.Content>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 line-clamp-4">
                {content.content}
              </p>
              {content.content.length > 200 && (
                <p className="text-xs text-gray-500 mt-2">
                  {content.content.length} characters • {content.type}
                </p>
              )}
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};
