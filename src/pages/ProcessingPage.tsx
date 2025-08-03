import React from 'react';
import { useAppStore } from '../store/appStore';
import { ProcessingStep } from '../components/workflow/ProcessingStep';

export const ProcessingPage: React.FC = () => {
  const { setCurrentStep } = useAppStore();

  const handleComplete = () => {
    setCurrentStep('preview');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ProcessingStep onComplete={handleComplete} />
      </div>
    </div>
  );
};
