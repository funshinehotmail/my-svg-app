import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Edit, Share2, Download, Maximize, Minimize } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface PresentationData {
  id: string;
  title: string;
  description: string;
  slides: any[];
  createdAt: string;
  updatedAt: string;
}

const PresentationViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [presentation, setPresentation] = useState<PresentationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const loadPresentation = async () => {
      setLoading(true);
      
      try {
        // Mock presentation data
        const mockPresentation: PresentationData = {
          id: id || 'sample',
          title: 'Q4 Sales Report',
          description: 'Comprehensive analysis of Q4 sales performance and trends',
          slides: [
            {
              id: 'slide-1',
              type: 'title',
              content: {
                title: 'Q4 Sales Report',
                subtitle: 'Comprehensive Performance Analysis • 2024'
              }
            },
            {
              id: 'slide-2',
              type: 'content',
              content: {
                title: 'Key Performance Metrics',
                bullets: [
                  'Revenue increased by 23% compared to Q3',
                  'Customer acquisition grew by 15%',
                  'Average deal size improved by 18%',
                  'Customer retention rate reached 94%',
                  'New market segments contributed 12% of total revenue'
                ]
              }
            },
            {
              id: 'slide-3',
              type: 'chart',
              content: {
                title: 'Revenue Growth Trend',
                chartType: 'line',
                data: {
                  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                  values: [2.1, 2.8, 3.2, 3.9]
                }
              }
            },
            {
              id: 'slide-4',
              type: 'content',
              content: {
                title: 'Market Analysis',
                bullets: [
                  'North American market showed strongest growth at 28%',
                  'European expansion exceeded targets by 15%',
                  'Asia-Pacific region presents significant opportunities',
                  'Digital transformation initiatives drove 40% of new sales',
                  'Enterprise segment outperformed SMB by 22%'
                ]
              }
            },
            {
              id: 'slide-5',
              type: 'conclusion',
              content: {
                title: 'Looking Forward',
                text: 'Q4 results demonstrate strong momentum across all key metrics. Our strategic focus on digital transformation and market expansion has positioned us well for continued growth in 2024. Key priorities include scaling our enterprise solutions, expanding international presence, and investing in customer success initiatives.'
              }
            }
          ],
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-16T14:20:00Z'
        };
        
        setPresentation(mockPresentation);
      } catch (error) {
        console.error('Error loading presentation:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPresentation();
  }, [id]);

  const nextSlide = () => {
    if (presentation && currentSlide < presentation.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          toggleFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide, presentation, isFullscreen]);

  const renderSlide = (slide: any) => {
    if (!slide) return null;
    
    return (
      <div className="bg-white rounded-lg shadow-lg p-16 h-full flex flex-col justify-center">
        {slide.type === 'title' && (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-8">{slide.content.title}</h1>
            <p className="text-2xl text-gray-600">{slide.content.subtitle}</p>
          </div>
        )}
        
        {slide.type === 'content' && (
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-12">{slide.content.title}</h2>
            <ul className="space-y-6">
              {slide.content.bullets?.map((bullet: string, i: number) => (
                <li key={i} className="flex items-start text-xl">
                  <span className="w-3 h-3 bg-blue-600 rounded-full mt-2 mr-6 flex-shrink-0"></span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {slide.type === 'chart' && (
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">{slide.content.title}</h2>
            <div className="bg-gray-50 rounded-lg p-8 h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-600">Chart visualization would appear here</p>
                <p className="text-sm text-gray-500 mt-2">
                  Data: {slide.content.data?.labels?.join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {slide.type === 'conclusion' && (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-12">{slide.content.title}</h2>
            <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">{slide.content.text}</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner text="Loading presentation..." />;
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
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-gray-900`}>
      {/* Header - Hidden in fullscreen */}
      {!isFullscreen && (
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
                  <p className="text-sm text-gray-500">
                    Slide {currentSlide + 1} of {presentation.slides.length}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate(`/editor/${presentation.id}`)}
                  className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                
                <button className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
                
                <button className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                
                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Presentation Area */}
      <div className={`${isFullscreen ? 'h-full' : 'h-[calc(100vh-80px)]'} flex items-center justify-center p-8`}>
        <div className="w-full max-w-6xl h-full">
          {renderSlide(presentation.slides[currentSlide])}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black bg-opacity-75 rounded-full px-6 py-3">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="p-2 text-white hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex items-center space-x-2">
          {presentation.slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-blue-400' : 'bg-gray-500 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          disabled={currentSlide === presentation.slides.length - 1}
          className="p-2 text-white hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="p-2 text-white hover:text-blue-400 transition-colors ml-4"
          >
            <Minimize className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Slide Counter */}
      <div className="fixed top-8 right-8 bg-black bg-opacity-75 rounded-lg px-4 py-2 text-white text-sm">
        {currentSlide + 1} / {presentation.slides.length}
      </div>
    </div>
  );
};

export default PresentationViewerPage;
