import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Settings, 
  Palette, 
  Type, 
  Layout,
  Eye,
  EyeOff
} from 'lucide-react';
import { type ThemeId } from '../../utils/constants';

interface PropertiesPanelProps {
  editor: Editor | null;
  theme: ThemeId | null;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ editor, theme }) => {
  const [activeTab, setActiveTab] = useState<'style' | 'layout' | 'preview'>('style');

  if (!editor) return null;

  const tabs = [
    { id: 'style' as const, label: 'Style', icon: Palette },
    { id: 'layout' as const, label: 'Layout', icon: Layout },
    { id: 'preview' as const, label: 'Preview', icon: Eye }
  ];

  const textSizes = [
    { label: 'Small', class: 'text-sm' },
    { label: 'Medium', class: 'text-base' },
    { label: 'Large', class: 'text-lg' },
    { label: 'X-Large', class: 'text-xl' }
  ];

  const applyTextSize = (sizeClass: string) => {
    // This would typically apply CSS classes to selected text
    console.log('Applying text size:', sizeClass);
  };

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Properties
          </h3>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center space-x-1"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </Card.Header>
      
      <Card.Content className="space-y-4">
        {activeTab === 'style' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                {textSizes.map((size) => (
                  <Button
                    key={size.class}
                    variant="outline"
                    size="sm"
                    onClick={() => applyTextSize(size.class)}
                    className="text-xs"
                  >
                    {size.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Theme
              </label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span className="text-sm font-medium capitalize">
                    {theme || 'No theme selected'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Actions
              </label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => editor.chain().focus().selectAll().run()}
                >
                  Select All Content
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => editor.chain().focus().clearContent().run()}
                >
                  Clear All Content
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Width
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md text-sm">
                <option>Full Width</option>
                <option>Narrow</option>
                <option>Wide</option>
                <option>Extra Wide</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spacing
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">Compact</Button>
                <Button variant="outline" size="sm">Normal</Button>
                <Button variant="outline" size="sm">Relaxed</Button>
                <Button variant="outline" size="sm">Loose</Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alignment
              </label>
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                >
                  Left
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                >
                  Center
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                >
                  Right
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview Mode
              </label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Desktop View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Tablet View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Mobile View
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Preview
              </label>
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                Preview how your content will appear in the final export format.
              </div>
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};
