import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { FileText, Presentation, Image } from 'lucide-react';
import { mockAIService } from '../../services/ai/mockAIService';
import type { ContentInput } from '../../types';

export const ContentInputForm: React.FC = () => {
  const { setContentAnalysis, setCurrentStep, setLoading } = useAppStore();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'text' as ContentInput['type']
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const contentTypes = [
    {
      value: 'text' as const,
      label: 'Text Content',
      icon: FileText,
      description: 'Paste or type your content directly'
    },
    {
      value: 'document' as const,
      label: 'Document',
      icon: Presentation,
      description: 'Upload or paste document content'
    },
    {
      value: 'url' as const,
      label: 'Web Content',
      icon: Image,
      description: 'Analyze content from a URL'
    }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.trim().length < 50) {
      newErrors.content = 'Content must be at least 50 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    console.log('🚀 Starting content analysis process...');
    console.log('📝 Content length:', formData.content.length, 'characters');

    const contentInput: ContentInput = {
      content: formData.content.trim(), // Preserve full content
      type: formData.type,
      metadata: {
        title: formData.title.trim(),
        source: 'user-input',
        dateCreated: new Date().toISOString()
      }
    };

    setLoading(true);
    setCurrentStep('processing');

    try {
      console.log('🔍 Calling AI analysis service...');
      // Call the sophisticated AI analysis service
      const analysis = await mockAIService.analyzeContent(contentInput);
      
      console.log('✅ Analysis complete!');
      console.log('📊 Results:', {
        suggestions: analysis.suggestions.length,
        keyPoints: analysis.extractedData.keyPoints.length,
        dataPoints: analysis.extractedData.dataPoints.length
      });

      setContentAnalysis(analysis);
      setCurrentStep('preview');
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      setErrors({ content: 'Failed to analyze content. Please try again.' });
      setCurrentStep('input');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Transform Your Content
        </h1>
        <p className="text-lg text-gray-600">
          Turn your ideas into stunning visuals with AI-powered analysis
        </p>
      </div>

      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold">Content Input</h2>
          <p className="text-gray-600">
            Provide your content and we'll analyze it with sophisticated AI to suggest the best visual format
          </p>
        </Card.Header>

        <Card.Content>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">
                Content Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {contentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange('type', type.value)}
                      className={`p-4 border-2 rounded-lg text-left transition-all hover:border-blue-300 ${
                        formData.type === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${
                          formData.type === type.value ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <div className={`font-medium ${
                            formData.type === type.value ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {type.label}
                          </div>
                          <div className="text-sm text-gray-500">
                            {type.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title Input */}
            <Input
              label="Title"
              placeholder="Enter a descriptive title for your content"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={errors.title}
              helperText="A clear title helps generate better visual suggestions"
            />

            {/* Content Input */}
            <Textarea
              label="Content"
              placeholder="Paste your full content here... (minimum 50 characters)

💡 Tips for better AI analysis:
• Include specific data points, statistics, or key metrics
• Mention relationships between concepts or ideas  
• Describe any processes, timelines, or sequences
• Include comparisons or contrasts between items
• Specify your target audience or presentation context

The AI will analyze your complete content to suggest the optimal visual format."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              error={errors.content}
              rows={12}
              helperText={`${formData.content.length} characters (minimum 50 required) - Full content will be analyzed`}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={!formData.title.trim() || !formData.content.trim()}
            >
              🧠 Analyze Content with AI
            </Button>
          </form>
        </Card.Content>
      </Card>

      {/* Enhanced Tips Card */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium">🚀 AI Analysis Features</h3>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Sophisticated Content Analysis</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <strong>Multi-dimensional scoring:</strong> Complexity, data richness, narrative flow</li>
                <li>• <strong>Smart format selection:</strong> Short vs long vs hybrid presentations</li>
                <li>• <strong>Visual optimization:</strong> Charts, timelines, infographics, bullet lists</li>
                <li>• <strong>Best practices:</strong> Cognitive load management, visual hierarchy</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Content Preservation</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <strong>Full content analysis:</strong> No truncation or data loss</li>
                <li>• <strong>Intelligent extraction:</strong> Key points, data patterns, relationships</li>
                <li>• <strong>Context awareness:</strong> Maintains meaning and connections</li>
              </ul>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};
