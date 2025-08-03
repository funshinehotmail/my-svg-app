import React, { useState } from 'react';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { Input } from '../UI/Input';
import { Textarea } from '../UI/Textarea';
import { useAppStore } from '../../store/appStore';
import { FileText, Sparkles } from 'lucide-react';
import type { ContentInput as ContentInputType } from '../../types';

export const ContentInput: React.FC = () => {
  const { setContent, setCurrentStep } = useAppStore();
  const [title, setTitle] = useState('');
  const [content, setContentState] = useState('');
  const [contentType, setContentType] = useState<ContentInputType['type']>('presentation');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setContent({
      title,
      content,
      type: contentType,
      timestamp: new Date(),
    });

    setCurrentStep('processing');
    
    // Simulate processing time
    setTimeout(() => {
      setCurrentStep('preview');
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="w-6 h-6 text-primary-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Create Visual Content</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your presentation title..."
              required
            />
          </div>

          <div>
            <label htmlFor="content-type" className="block text-sm font-medium text-gray-700 mb-2">
              Content Type
            </label>
            <select
              id="content-type"
              value={contentType}
              onChange={(e) => setContentType(e.target.value as ContentInputType['type'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="presentation">Presentation</option>
              <option value="document">Document</option>
              <option value="infographic">Infographic</option>
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContentState(e.target.value)}
              placeholder="Describe your content, key points, or paste your text here..."
              rows={8}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full flex items-center justify-center space-x-2"
            disabled={!title.trim() || !content.trim()}
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Visual Content</span>
          </Button>
        </form>
      </Card>
    </div>
  );
};
