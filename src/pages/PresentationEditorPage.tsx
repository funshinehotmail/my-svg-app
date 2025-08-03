import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Download, Share2, Settings } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface PresentationData {
  id: string;
  title: string;
  description: string;
  slides: any[];
  createdAt: string;
  updatedAt: string;
}

const PresentationEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [presentation, setPresentation] = useState<PresentationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const loadPresentation = async () => {
      setLoading(true);
      
      try {
        // Check if we have initial data from navigation state
        if (location.state) {
          const { title, description, contentInput } = location.state;
          
          // Create mock presentation data
          const mockPresentation: PresentationData = {
            id: id || 'new',
            title: title || 'Untitled Presentation',
            description: description || '',
            slides: [
              {
                id: 'slide-1',
                type: 'title',
                content: {
                  title: title || 'Untitled Presentation',
                  subtitle: description || 'AI-Generated Presentation'
                }
              },
              {
                id: 'slide-2',
                type: 'content',
                content: {
                  title: 'Key Points',
                  bullets: [
                    'AI-powered content analysis',
                    'Intelligent slide generation',
                    'Professional design templates',
                    'Interactive presentation tools'
                  ]
                }
              },
              {
                id: 'slide-3',
                type: 'conclusion',
                content: {
                  title: 'Summary',
                  text: 'This presentation was generated using advanced AI technology to transform your content into a professional presentation.'
                }
              }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          setPresentation(mockPresentation);
        } else {
          // Load existing presentation (mock for now)
          const mockPresentation: PresentationData = {
            id: id || 'existing',
            title: 'Sample Presentation',
            description: 'A sample presentation for demonstration',
            slides: [
              {
                id: 'slide-1',
                type: 'title',
                content: {
                  title: 'Sample Presentation',
                  subtitle: 'Professional AI-Generated Content'
                }
              }
            ],
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-16T14:20:00Z'
          };
          
          setPresentation(mockPresentation);
        }
      } catch (error) {
        console.error('Error loading presentation:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPresentation();
  }, [id, location.state]);

  const handleSave = async () => {
    if (!presentation) return;
    
    setSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPresentation(prev => prev ? {
        ...prev,
        updatedAt: new Date().toISOString()
      } : null);
      
      console.log('Presentation saved successfully');
    } catch (error) {
      console.error('Error saving presentation:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    if (presentation) {
      navigate(`/presentation/${presentation.id}`);
    }
  };

  const renderSlide = (slide: any, index: number) => {
    const isActive = index === activeSlide;
    
    return (
      <div
        key={slide.id}
        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
          isActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
        onClick={() => setActiveSlide(index)}
      >
        <div className="text-xs text-gray-500 mb-2">Slide {index + 1}</div>
        
        {slide.type === 'title' && (
          <div className="text-center">
            <h3 className="font-bold text-sm mb-1">{slide.content.title}</h3>
            <p className="text-xs text-gray-600">{slide.content.subtitle}</p>
          </div>
        )}
        
        {slide.type === 'content' && (
          <div>
            <h3 className="font-bold text-sm mb-2">{slide.content.title}</h3>
            <ul className="text-xs space-y-1">
              {slide.content.bullets?.slice(0, 3).map((bullet: string, i: number) => (
                <li key={i} className="flex items-start">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  <span className="truncate">{bullet}</span>
                </li>
              ))}
              {slide.content.bullets?.length > 3 && (
                <li className="text-gray-400">...</li>
              )}
            </ul>
          </div>
        )}
        
        {slide.type === 'conclusion' && (
          <div>
            <h3 className="font-bold text-sm mb-2">{slide.content.title}</h3>
            <p className="text-xs text-gray-600 line-clamp-3">{slide.content.text}</p>
          </div>
        )}
      </div>
    );
  };

  const renderMainSlide = (slide: any) => {
    if (!slide) return null;
    
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 h-full flex flex-col justify-center">
        {slide.type === 'title' && (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">{slide.content.title}</h1>
            <p className="text-xl text-gray-600">{slide.content.subtitle}</p>
          </div>
        )}
        
        {slide.type === 'content' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">{slide.content.title}</h2>
            <ul className="space-y-4">
              {slide.content.bullets?.map((bullet: string, i: number) => (
                <li key={i} className="flex items-start text-lg">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {slide.type === 'conclusion' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">{slide.content.title}</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">{slide.content.text}</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner text="Loading presentation editor..." />;
  }

  if (!presentation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Presentation Not Found</h2>
          <p className="text-gray-600 mb-4">The presentation you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{presentation.title}</h1>
                <p className="text-sm text-gray-500">Last updated: {new Date(presentation.updatedAt).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </button>
              
              <button
                onClick={handlePreview}
                className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
              
              <button className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              
              <button className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Slide Thumbnails */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4 h-full">
              <h3 className="font-semibold text-gray-900 mb-4">Slides ({presentation.slides.length})</h3>
              <div className="space-y-3 overflow-y-auto">
                {presentation.slides.map((slide, index) => renderSlide(slide, index))}
              </div>
            </div>
          </div>
          
          {/* Main Editor */}
          <div className="col-span-9">
            <div className="bg-gray-100 rounded-lg p-6 h-full">
              <div className="bg-white rounded-lg shadow-lg h-full aspect-video max-h-full">
                {renderMainSlide(presentation.slides[activeSlide])}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationEditorPage;
