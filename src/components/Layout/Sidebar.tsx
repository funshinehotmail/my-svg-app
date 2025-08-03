import React from 'react';
import { FileText, Eye, Palette, Download } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export const Sidebar: React.FC = () => {
  const { currentStep } = useAppStore();
  
  const steps = [
    { id: 'input', label: 'Content Input', icon: FileText },
    { id: 'processing', label: 'Processing', icon: Palette },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'export', label: 'Export', icon: Download },
  ];

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 p-6">
      <nav className="space-y-2">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          
          return (
            <div
              key={step.id}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 border border-primary-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{step.label}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
