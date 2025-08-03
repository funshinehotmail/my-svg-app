import React from 'react';
import { Edit3, Type, Image, BarChart3, Save } from 'lucide-react';
import { usePresentationStore } from '../../store/presentationStore';
import type { PresentationPage } from '../../types';

interface VisualEditorProps {
  page: PresentationPage;
  pageIndex: number;
}

export const VisualEditor: React.FC<VisualEditorProps> = ({ page, pageIndex }) => {
  const { updatePage } = usePresentationStore();

  const handleTitleChange = (title: string) => {
    updatePage(pageIndex, { title });
  };

  const handleContentChange = (content: string) => {
    updatePage(pageIndex, { content });
  };

  if (!page) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No page selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Edit3 className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          Visual Editor
        </h3>
        <span className="text-sm text-gray-500">
          Page {pageIndex + 1}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slide Title
            </label>
            <input
              type="text"
              value={page.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter slide title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={page.content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={8}
              placeholder="Enter slide content..."
            />
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Type className="w-4 h-4" />
            <span>Visual Type: {page.visualType}</span>
          </div>

          {/* Element Tools */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Add Elements</h4>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Type className="w-4 h-4" />
                <span className="text-sm">Text Block</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Image className="w-4 h-4" />
                <span className="text-sm">Image</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm">Chart</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Edit3 className="w-4 h-4" />
                <span className="text-sm">Shape</span>
              </button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="bg-white rounded-lg shadow-sm p-6 min-h-96">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {page.title || 'Untitled Slide'}
            </h2>
            
            <div className="prose prose-sm max-w-none">
              {page.content ? (
                <div className="whitespace-pre-wrap text-gray-700">
                  {page.content}
                </div>
              ) : (
                <div className="text-gray-400 italic">
                  Enter content to see preview...
                </div>
              )}
            </div>

            {/* Elements Preview */}
            {page.elements && page.elements.length > 0 && (
              <div className="mt-6 space-y-4">
                {page.elements.map((element, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="text-sm text-gray-600">
                      Element: {element.type || 'Unknown'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auto-save indicator */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Save className="w-4 h-4" />
          <span>Changes saved automatically</span>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
