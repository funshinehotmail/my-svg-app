import React from 'react';
import { Editor } from '@tiptap/react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Type, 
  Image, 
  BarChart3, 
  List, 
  Quote, 
  Minus,
  Plus
} from 'lucide-react';

interface ElementPanelProps {
  editor: Editor | null;
}

export const ElementPanel: React.FC<ElementPanelProps> = ({ editor }) => {
  if (!editor) return null;

  const elements = [
    {
      type: 'heading',
      label: 'Heading',
      icon: Type,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run()
    },
    {
      type: 'paragraph',
      label: 'Text Block',
      icon: Type,
      action: () => editor.chain().focus().setParagraph().run()
    },
    {
      type: 'image',
      label: 'Image',
      icon: Image,
      action: () => {
        const url = prompt('Enter image URL:') || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400';
        editor.chain().focus().setImage({ src: url }).run();
      }
    },
    {
      type: 'chart',
      label: 'Chart',
      icon: BarChart3,
      action: () => {
        const chartHtml = `
          <div class="chart-placeholder bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg border-2 border-dashed border-blue-300 text-center my-4">
            <div class="flex items-center justify-center mb-2">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-800 mb-1">Interactive Chart</h3>
            <p class="text-sm text-gray-600">Click to configure chart data and type</p>
          </div>
        `;
        editor.chain().focus().insertContent(chartHtml).run();
      }
    },
    {
      type: 'list',
      label: 'Bullet List',
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run()
    },
    {
      type: 'quote',
      label: 'Quote',
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run()
    },
    {
      type: 'divider',
      label: 'Divider',
      icon: Minus,
      action: () => {
        const dividerHtml = '<hr class="my-6 border-gray-300">';
        editor.chain().focus().insertContent(dividerHtml).run();
      }
    }
  ];

  return (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-medium flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add Elements
        </h3>
      </Card.Header>
      <Card.Content className="space-y-2">
        {elements.map((element) => {
          const Icon = element.icon;
          return (
            <Button
              key={element.type}
              variant="ghost"
              className="w-full justify-start text-left p-3 h-auto"
              onClick={element.action}
            >
              <Icon className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <div className="font-medium">{element.label}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {element.type === 'heading' && 'Add section heading'}
                  {element.type === 'paragraph' && 'Add text content'}
                  {element.type === 'image' && 'Insert image'}
                  {element.type === 'chart' && 'Add data visualization'}
                  {element.type === 'list' && 'Create bullet points'}
                  {element.type === 'quote' && 'Add highlighted quote'}
                  {element.type === 'divider' && 'Insert section break'}
                </div>
              </div>
            </Button>
          );
        })}
      </Card.Content>
    </Card>
  );
};
