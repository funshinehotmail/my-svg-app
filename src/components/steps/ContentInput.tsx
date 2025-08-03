import React, { useState } from 'react';
import { FileText, Sparkles, Upload, Type } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Input from '../ui/Input';
import { validateContent, generateId } from '../../utils/helpers';
import { APP_CONFIG } from '../../utils/constants';
import type { ContentInput as ContentInputType } from '../../types';

const ContentInput: React.FC = () => {
  const { setCurrentContent, addToContentHistory, setActiveStep } = useAppStore();
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState<ContentInputType['type']>('presentation');
  const [context, setContext] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = async () => {
    const validation = validateContent(text);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid content');
      return;
    }
    
    setError(null);
    setIsProcessing(true);
    
    try {
      const content: ContentInputType = {
        id: generateId(),
        text: text.trim(),
        type: contentType,
        context: context.trim() || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setCurrentContent(content);
      addToContentHistory(content);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setActiveStep('analysis');
    } catch (err) {
      setError('Failed to process content. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const contentTypes = [
    { id: 'presentation', name: 'Presentation', description: 'Slide-based presentation', icon: FileText },
    { id: 'infographic', name: 'Infographic', description: 'Visual information graphic', icon: Sparkles },
    { id: 'chart', name: 'Chart', description: 'Data visualization', icon: Type },
    { id: 'diagram', name: 'Diagram', description: 'Process or concept diagram', icon: Upload },
  ] as const;
  
  const examplePrompts = [
    "Our Q4 sales increased by 25% compared to last year, with mobile sales leading at 40% growth. Desktop sales grew 15% while tablet sales remained flat.",
    "The customer journey consists of 5 stages: Awareness, Consideration, Purchase, Onboarding, and Retention. Each stage has specific touchpoints and metrics.",
    "Our team structure includes Product (5 people), Engineering (12 people), Design (3 people), and Marketing (4 people). We're planning to hire 6 more engineers next quarter.",
  ];
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Transform Your Content into Visuals
        </h1>
        <p className="text-lg text-secondary-600">
          Enter your content and let AI create compelling visual presentations
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Input</CardTitle>
              <CardDescription>
                Enter the content you want to transform into visuals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Title (Optional)"
                placeholder="Enter a title for your content..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              
              <Textarea
                label="Content"
                placeholder="Enter your content here... (e.g., data, concepts, processes, or any text you want to visualize)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                error={error}
                helperText={`${text.length}/${APP_CONFIG.maxContentLength} characters`}
              />
              
              <Input
                label="Context (Optional)"
                placeholder="Provide additional context or specific requirements..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                helperText="Help AI understand your specific needs or audience"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Content Type</CardTitle>
              <CardDescription>
                Select the type of visual output you want to create
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {contentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setContentType(type.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        contentType === type.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-secondary-200 hover:border-secondary-300'
                      }`}
                    >
                      <Icon className={`h-5 w-5 mb-2 ${
                        contentType === type.id ? 'text-primary-600' : 'text-secondary-500'
                      }`} />
                      <h3 className={`font-medium ${
                        contentType === type.id ? 'text-primary-900' : 'text-secondary-900'
                      }`}>
                        {type.name}
                      </h3>
                      <p className={`text-sm ${
                        contentType === type.id ? 'text-primary-600' : 'text-secondary-600'
                      }`}>
                        {type.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Example Prompts</CardTitle>
              <CardDescription>
                Click to use these examples
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setText(prompt)}
                  className="w-full p-3 text-left text-sm bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
                >
                  {prompt.substring(0, 100)}...
                </button>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-secondary-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full" />
                  AI will analyze your content
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary-300 rounded-full" />
                  Generate visual suggestions
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary-300 rounded-full" />
                  Choose your preferred style
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary-300 rounded-full" />
                  Fine-tune in the editor
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary-300 rounded-full" />
                  Export to PowerPoint
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-center pt-6">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={!text.trim() || isProcessing}
          loading={isProcessing}
          icon={<Sparkles className="h-5 w-5" />}
        >
          {isProcessing ? 'Processing...' : 'Generate Visuals'}
        </Button>
      </div>
    </div>
  );
};

export default ContentInput;
