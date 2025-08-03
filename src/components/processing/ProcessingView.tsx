import React from 'react';
import { Loader2, Brain, Search, Lightbulb } from 'lucide-react';

interface ProcessingViewProps {
  stage: 'analyzing' | 'generating' | 'optimizing' | 'complete';
  progress: number;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ stage, progress }) => {
  const getStageInfo = () => {
    switch (stage) {
      case 'analyzing':
        return {
          icon: Search,
          title: 'Analyzing Content',
          description: 'Understanding your content structure and key points...'
        };
      case 'generating':
        return {
          icon: Lightbulb,
          title: 'Generating Visuals',
          description: 'Creating visual suggestions based on your content...'
        };
      case 'optimizing':
        return {
          icon: Brain,
          title: 'Optimizing Results',
          description: 'Fine-tuning suggestions for best visual impact...'
        };
      case 'complete':
        return {
          icon: Brain,
          title: 'Processing Complete',
          description: 'Your visual suggestions are ready!'
        };
    }
  };

  const stageInfo = getStageInfo();
  const Icon = stageInfo.icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <div className="relative">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          {stage === 'complete' ? (
            <Icon className="w-10 h-10 text-blue-600" />
          ) : (
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          )}
        </div>
        
        {stage !== 'complete' && (
          <div className="absolute inset-0 w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
                className="text-blue-600 transition-all duration-300"
              />
            </svg>
          </div>
        )}
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">{stageInfo.title}</h3>
        <p className="text-gray-600 max-w-md">{stageInfo.description}</p>
        
        {stage !== 'complete' && (
          <div className="mt-4">
            <div className="text-sm text-gray-500 mb-2">{progress}% complete</div>
            <div className="w-64 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
