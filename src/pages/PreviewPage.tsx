import React from 'react';
import { useAppStore } from '../store/appStore';
import { PreviewStep } from '../components/workflow/PreviewStep';

export const PreviewPage: React.FC = () => {
  const { setCurrentStep } = useAppStore();

  const handleNext = () => {
    setCurrentStep('editing');
  };

  const handleEdit = () => {
    setCurrentStep('editing');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <PreviewStep onNext={handleNext} onEdit={handleEdit} />
      </div>
    </div>
  );
};
