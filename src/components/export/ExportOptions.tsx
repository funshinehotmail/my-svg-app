import React, { useState } from 'react';
import { Download, FileText, Image, Share2 } from 'lucide-react';
import { usePresentationStore } from '../../store/presentationStore';

export const ExportOptions: React.FC = () => {
  const { pages, currentPresentation } = usePresentationStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPowerPoint = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would generate and download a PowerPoint file
      console.log('Exporting to PowerPoint:', {
        title: currentPresentation.title,
        pages: pages.length,
        theme: currentPresentation.selectedTheme
      });
      
      // Create a mock download
      const element = document.createElement('a');
      element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(
        `PowerPoint Export\n\nTitle: ${currentPresentation.title}\nPages: ${pages.length}\nTheme: ${currentPresentation.selectedTheme}\n\n${pages.map((page, index) => `Slide ${index + 1}: ${page.title}\n${page.content}`).join('\n\n')}`
      );
      element.download = `${currentPresentation.title || 'presentation'}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    {
      id: 'powerpoint',
      name: 'PowerPoint',
      description: 'Export as .pptx file',
      icon: FileText,
      action: handleExportPowerPoint,
      primary: true
    },
    {
      id: 'pdf',
      name: 'PDF',
      description: 'Export as PDF document',
      icon: FileText,
      action: () => console.log('PDF export'),
      disabled: true
    },
    {
      id: 'images',
      name: 'Images',
      description: 'Export slides as PNG images',
      icon: Image,
      action: () => console.log('Image export'),
      disabled: true
    },
    {
      id: 'share',
      name: 'Share Link',
      description: 'Generate shareable link',
      icon: Share2,
      action: () => console.log('Share link'),
      disabled: true
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Download className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          Export Your Presentation
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={option.action}
              disabled={option.disabled || isExporting}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                option.primary
                  ? 'border-green-500 bg-green-50 hover:bg-green-100'
                  : option.disabled
                  ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Icon className={`w-6 h-6 ${
                  option.primary ? 'text-green-600' : 'text-gray-400'
                }`} />
                <h4 className={`font-medium ${
                  option.primary ? 'text-green-900' : 'text-gray-900'
                }`}>
                  {option.name}
                </h4>
              </div>
              <p className="text-sm text-gray-600">
                {option.description}
              </p>
              {option.disabled && (
                <div className="mt-2 text-xs text-gray-500">
                  Coming soon
                </div>
              )}
            </button>
          );
        })}
      </div>

      {isExporting && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-blue-800">Generating PowerPoint presentation...</span>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Export Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Title:</span>
            <div className="font-medium">{currentPresentation.title}</div>
          </div>
          <div>
            <span className="text-gray-600">Pages:</span>
            <div className="font-medium">{pages.length}</div>
          </div>
          <div>
            <span className="text-gray-600">Theme:</span>
            <div className="font-medium capitalize">{currentPresentation.selectedTheme}</div>
          </div>
          <div>
            <span className="text-gray-600">Status:</span>
            <div className="font-medium capitalize">{currentPresentation.status}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
