import React, { useState } from 'react';
import { FileText, Sparkles, Upload, Type, Brain } from 'lucide-react';
import { usePresentationStore } from '../../store/presentationStore';
import type { ContentInput as ContentInputType } from '../../types';

export const ContentInput: React.FC = () => {
  const { setContentInput, analyzeContent, isAnalyzing, error } = usePresentationStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<ContentInputType['type']>('text');
  const [context, setContext] = useState('');

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
      icon: Type,
      description: 'Upload or paste document content'
    },
    {
      value: 'url' as const,
      label: 'Web Content',
      icon: Upload,
      description: 'Analyze content from a URL'
    }
  ];

  const examplePrompts = [
    "Our Q4 sales increased by 25% compared to last year, with mobile sales leading at 40% growth. Desktop sales grew 15% while tablet sales remained flat. The marketing team attributes this success to our new social media strategy and improved customer targeting.",
    "The customer journey consists of 5 stages: Awareness (social media, ads), Consideration (website visits, demos), Purchase (checkout process), Onboarding (welcome emails, tutorials), and Retention (support, updates). Each stage has specific touchpoints and success metrics.",
    "Our team structure includes Product (5 people), Engineering (12 people), Design (3 people), and Marketing (4 people). We're planning to hire 6 more engineers next quarter to support our new AI features and mobile app development."
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }

    const contentInput: ContentInputType = {
      content: content.trim(),
      type: contentType,
      metadata: {
        title: title.trim() || 'Untitled Content',
        source: 'user-input',
        dateCreated: new Date().toISOString(),
        context: context.trim() || undefined
      }
    };

    setContentInput(contentInput);
    await analyzeContent();
  };

  const handleExampleClick = (example: string) => {
    setContent(example);
    setTitle('Example Content');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Input */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Brain className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                Transform Your Content with AI
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title (Optional)
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a title for your content..."
                />
              </div>

              {/* Content Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Content Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {contentTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setContentType(type.value)}
                        className={`p-4 border-2 rounded-lg text-left transition-all hover:border-blue-300 ${
                          contentType === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className={`w-5 h-5 mt-0.5 ${
                            contentType === type.value ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <div>
                            <div className={`font-medium text-sm ${
                              contentType === type.value ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {type.label}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {type.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Input */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={8}
                  placeholder="Enter your content here... 

💡 Tips for better AI analysis:
• Include specific data points, statistics, or key metrics
• Mention relationships between concepts or ideas  
• Describe any processes, timelines, or sequences
• Include comparisons or contrasts between items
• Specify your target audience or presentation context

The AI will analyze your complete content to suggest the optimal visual format."
                  required
                />
                <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                  <span>{content.length} characters</span>
                  <span>Minimum 50 characters recommended</span>
                </div>
              </div>

              {/* Context Input */}
              <div>
                <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Context (Optional)
                </label>
                <input
                  id="context"
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide additional context or specific requirements..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Help AI understand your specific needs, audience, or presentation goals
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!content.trim() || isAnalyzing}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Analyze Content with AI</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Example Prompts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Example Content
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Click to use these examples and see AI analysis in action
            </p>
            <div className="space-y-3">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(prompt)}
                  className="w-full p-3 text-left text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  <div className="font-medium text-gray-900 mb-1">
                    Example {index + 1}
                  </div>
                  <div className="text-gray-600 line-clamp-3">
                    {prompt.substring(0, 120)}...
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Features */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              🧠 AI Analysis Features
            </h4>
            <div className="space-y-4 text-sm">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">
                  Sophisticated Content Analysis
                </h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• Multi-dimensional scoring system</li>
                  <li>• Smart format selection</li>
                  <li>• Visual optimization recommendations</li>
                  <li>• Cognitive load management</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-900 mb-2">
                  Content Preservation
                </h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• Full content analysis (no truncation)</li>
                  <li>• Intelligent key point extraction</li>
                  <li>• Context-aware suggestions</li>
                  <li>• Maintains meaning and connections</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Next Steps
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-gray-700">AI analyzes your content</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-300 rounded-full" />
                <span className="text-gray-500">Generate visual suggestions</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-300 rounded-full" />
                <span className="text-gray-500">Choose your preferred theme</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-300 rounded-full" />
                <span className="text-gray-500">Edit in visual editor</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-300 rounded-full" />
                <span className="text-gray-500">Export to PowerPoint</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
