import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, Link as LinkIcon, Sparkles } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface ContentInput {
  type: 'text' | 'file' | 'url';
  content: string;
  metadata?: Record<string, any>;
}

const CreatePresentationPage: React.FC = () => {
  const navigate = useNavigate();
  const [inputType, setInputType] = useState<'text' | 'file' | 'url'>('text');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Read file content for text files
      if (selectedFile.type.startsWith('text/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setContent(e.target?.result as string);
        };
        reader.readAsText(selectedFile);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a presentation title');
      return;
    }

    let inputContent = '';
    let contentType: 'text' | 'file' | 'url' = 'text';

    switch (inputType) {
      case 'text':
        if (!content.trim()) {
          alert('Please enter some content');
          return;
        }
        inputContent = content;
        contentType = 'text';
        break;
      case 'file':
        if (!file) {
          alert('Please select a file');
          return;
        }
        inputContent = content || file.name;
        contentType = 'file';
        break;
      case 'url':
        if (!url.trim()) {
          alert('Please enter a URL');
          return;
        }
        inputContent = url;
        contentType = 'url';
        break;
    }

    setIsAnalyzing(true);

    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a new presentation ID
      const presentationId = `pres-${Date.now()}`;
      
      // Navigate to editor with the new presentation
      navigate(`/editor/${presentationId}`, {
        state: {
          title,
          description,
          contentInput: {
            type: contentType,
            content: inputContent,
            metadata: {
              originalFile: file?.name,
              originalUrl: url,
              createdAt: new Date().toISOString()
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating presentation:', error);
      alert('Failed to create presentation. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Content</h2>
            <p className="text-gray-600 mb-4">Our AI is processing your content and generating presentation suggestions...</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>This may take a few moments</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Presentation</h1>
              <p className="text-gray-600 mt-1">Transform your content into stunning presentations with AI</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Presentation Details</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter presentation title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of your presentation"
                />
              </div>
            </div>
          </div>

          {/* Content Input */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Content Source</h2>
            
            {/* Input Type Selection */}
            <div className="flex space-x-4 mb-6">
              <button
                type="button"
                onClick={() => setInputType('text')}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  inputType === 'text'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-5 h-5 mr-2" />
                Text Input
              </button>
              
              <button
                type="button"
                onClick={() => setInputType('file')}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  inputType === 'file'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Upload className="w-5 h-5 mr-2" />
                File Upload
              </button>
              
              <button
                type="button"
                onClick={() => setInputType('url')}
                className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                  inputType === 'url'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <LinkIcon className="w-5 h-5 mr-2" />
                URL/Link
              </button>
            </div>

            {/* Content Input Fields */}
            {inputType === 'text' && (
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Paste your content here... (articles, reports, notes, data, etc.)"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Tip: The more detailed your content, the better AI can create your presentation
                </p>
              </div>
            )}

            {inputType === 'file' && (
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".txt,.md,.doc,.docx,.pdf"
                  />
                  <label
                    htmlFor="file"
                    className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Click to upload a file
                  </label>
                  <p className="text-sm text-gray-500 mt-1">
                    Supports: TXT, MD, DOC, DOCX, PDF (Max 10MB)
                  </p>
                  {file && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {inputType === 'url' && (
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  URL/Link *
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/article"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Enter a URL to an article, blog post, or webpage to analyze
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isAnalyzing}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Presentation with AI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePresentationPage;
