import React from 'react';
import { useAppStore } from '../store/appStore';
import { VisualEditor } from '../components/editor/VisualEditor';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Download } from 'lucide-react';

export const EditingPage: React.FC = () => {
  const { previousStep, setCurrentStep, selectedSuggestion } = useAppStore();

  const handleExport = () => {
    setCurrentStep('export');
  };

  if (!selectedSuggestion) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Card>
            <Card.Content className="text-center py-12">
              <p className="text-gray-500 mb-4">No visual selected for editing</p>
              <Button onClick={previousStep}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back to Preview
              </Button>
            </Card.Content>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={previousStep}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Visual Editor
              </h1>
              <p className="text-sm text-gray-600">
                Editing: {selectedSuggestion.title}
              </p>
            </div>
          </div>
          
          <Button onClick={handleExport} className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <VisualEditor />
      </div>
    </div>
  );
};
