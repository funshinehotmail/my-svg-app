import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { PowerPointExportService, type ExportOptions } from '../../services/PowerPointExportService';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  Download, 
  FileText, 
  Settings, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const ExportPanel: React.FC = () => {
  const { 
    contentAnalysis, 
    visualSuggestions, 
    selectedTheme,
    content 
  } = useAppStore();

  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    title: 'Visual Content Presentation',
    author: 'VisualAI User',
    subject: 'AI-Generated Visual Content',
    includeNotes: true,
    slideLayout: 'widescreen',
    quality: 'high'
  });

  const handleExport = async () => {
    if (!contentAnalysis || !visualSuggestions.length) {
      setExportStatus('error');
      return;
    }

    setIsExporting(true);
    setExportStatus('idle');

    try {
      const exportService = new PowerPointExportService(selectedTheme || 'professional');
      
      // Get editor content if available
      const editorContent = document.querySelector('.ProseMirror')?.innerHTML || '';
      
      await exportService.exportFromAnalysis(
        contentAnalysis,
        visualSuggestions,
        editorContent,
        exportOptions
      );

      setExportStatus('success');
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleQuickExport = async () => {
    if (!contentAnalysis || !visualSuggestions.length) return;

    setIsExporting(true);
    try {
      const exportService = new PowerPointExportService(selectedTheme || 'professional');
      await exportService.exportFromAnalysis(
        contentAnalysis,
        visualSuggestions,
        '',
        { title: 'Quick Export' }
      );
      setExportStatus('success');
    } catch (error) {
      setExportStatus('error');
    } finally {
      setIsExporting(false);
    }
  };

  const isExportReady = contentAnalysis && visualSuggestions.length > 0;

  return (
    <div className="space-y-6">
      {/* Export Status */}
      {exportStatus === 'success' && (
        <Card className="border-green-200 bg-green-50">
          <Card.Content className="flex items-center space-x-3 py-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Export Successful!</p>
              <p className="text-sm text-green-600">Your PowerPoint presentation has been downloaded.</p>
            </div>
          </Card.Content>
        </Card>
      )}

      {exportStatus === 'error' && (
        <Card className="border-red-200 bg-red-50">
          <Card.Content className="flex items-center space-x-3 py-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Export Failed</p>
              <p className="text-sm text-red-600">Please ensure you have content to export and try again.</p>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Quick Export */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Quick Export
          </h3>
          <p className="text-sm text-gray-600">
            Export your content with default settings
          </p>
        </Card.Header>
        <Card.Content>
          <Button
            onClick={handleQuickExport}
            disabled={!isExportReady || isExporting}
            className="w-full"
            size="lg"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Export to PowerPoint
              </>
            )}
          </Button>
          
          {!isExportReady && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Please analyze content and generate suggestions first
            </p>
          )}
        </Card.Content>
      </Card>

      {/* Advanced Export Options */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Export Settings
          </h3>
          <p className="text-sm text-gray-600">
            Customize your PowerPoint export
          </p>
        </Card.Header>
        <Card.Content className="space-y-4">
          {/* Presentation Details */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Presentation Title
              </label>
              <Input
                value={exportOptions.title}
                onChange={(e) => setExportOptions(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter presentation title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <Input
                value={exportOptions.author}
                onChange={(e) => setExportOptions(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Enter author name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <Input
                value={exportOptions.subject}
                onChange={(e) => setExportOptions(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Enter presentation subject"
              />
            </div>
          </div>

          {/* Layout Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slide Layout
            </label>
            <div className="flex space-x-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="slideLayout"
                  value="standard"
                  checked={exportOptions.slideLayout === 'standard'}
                  onChange={(e) => setExportOptions(prev => ({ 
                    ...prev, 
                    slideLayout: e.target.value as 'standard' | 'widescreen' 
                  }))}
                  className="mr-2"
                />
                <span className="text-sm">Standard (4:3)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="slideLayout"
                  value="widescreen"
                  checked={exportOptions.slideLayout === 'widescreen'}
                  onChange={(e) => setExportOptions(prev => ({ 
                    ...prev, 
                    slideLayout: e.target.value as 'standard' | 'widescreen' 
                  }))}
                  className="mr-2"
                />
                <span className="text-sm">Widescreen (16:9)</span>
              </label>
            </div>
          </div>

          {/* Quality Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Quality
            </label>
            <div className="flex space-x-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="quality"
                  value="standard"
                  checked={exportOptions.quality === 'standard'}
                  onChange={(e) => setExportOptions(prev => ({ 
                    ...prev, 
                    quality: e.target.value as 'standard' | 'high' 
                  }))}
                  className="mr-2"
                />
                <span className="text-sm">Standard</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="quality"
                  value="high"
                  checked={exportOptions.quality === 'high'}
                  onChange={(e) => setExportOptions(prev => ({ 
                    ...prev, 
                    quality: e.target.value as 'standard' | 'high' 
                  }))}
                  className="mr-2"
                />
                <span className="text-sm">High Quality</span>
              </label>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={exportOptions.includeNotes}
                onChange={(e) => setExportOptions(prev => ({ 
                  ...prev, 
                  includeNotes: e.target.checked 
                }))}
                className="mr-2"
              />
              <span className="text-sm">Include speaker notes</span>
            </label>
          </div>

          {/* Export Button */}
          <Button
            onClick={handleExport}
            disabled={!isExportReady || isExporting}
            className="w-full"
            variant="primary"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Presentation...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export with Custom Settings
              </>
            )}
          </Button>
        </Card.Content>
      </Card>

      {/* Export Info */}
      <Card className="bg-blue-50 border-blue-200">
        <Card.Content className="py-3">
          <h4 className="font-medium text-blue-800 mb-2">What's Included in Your Export:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Title slide with presentation details</li>
            <li>• Content overview with key insights</li>
            <li>• Individual slides for each visual suggestion</li>
            <li>• Charts, diagrams, and visual elements</li>
            <li>• Visual editor content (if available)</li>
            <li>• Summary slide with recommendations</li>
          </ul>
        </Card.Content>
      </Card>
    </div>
  );
};
