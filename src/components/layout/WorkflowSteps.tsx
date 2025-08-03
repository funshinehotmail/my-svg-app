import React from 'react';
import { useAppStore } from '../../store/appStore';
import { FileText, Brain, Eye, Edit, Download } from 'lucide-react';
import type { WorkflowStep } from '../../types';

const steps: Array<{
  id: WorkflowStep;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}> = [
  {
    id: 'input',
    label: 'Input',
    icon: FileText,
    description: 'Provide your content'
  },
  {
    id: 'processing',
    label: 'Processing',
    icon: Brain,
    description: 'AI analysis'
  },
  {
    id: 'preview',
    label: 'Preview',
    icon: Eye,
    description: 'Choose design'
  },
  {
    id: 'editing',
    label: 'Edit',
    icon: Edit,
    description: 'Customize visuals'
  },
  {
    id: 'export',
    label: 'Export',
    icon: Download,
    description: 'Download results'
  }
];

export const WorkflowSteps: React.FC = () => {
  const { currentStep } = useAppStore();
  
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <nav className="flex justify-center">
            <ol className="flex items-center space-x-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                const isUpcoming = index > currentStepIndex;

                return (
                  <li key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                        isCompleted
                          ? 'bg-green-600 border-green-600 text-white'
                          : isActive
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="mt-2 text-center">
                        <p className={`text-sm font-medium ${
                          isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-gray-400 hidden sm:block">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 ml-4 ${
                        index < currentStepIndex ? 'bg-green-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
};
