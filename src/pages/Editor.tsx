import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { usePresentationStore } from '../store/presentationStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { VisualEditor } from '../components/editor/VisualEditor';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  Plus, 
  Eye,
  Settings,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const Editor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    currentPresentation, 
    loadPresentation, 
    createPresentation,
    savePresentation 
  } = usePresentationStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const initializeEditor = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        if (id && id !== 'new') {
          await loadPresentation(id);
        } else {
          await createPresentation({
            title: 'Untitled Presentation',
            content: '',
            user_id: user.id
          });
        }
      } catch (error) {
        console.error('Failed to initialize editor:', error);
        toast.error('Failed to load presentation');
      } finally {
        setIsLoading(false);
      }
    };

    initializeEditor();
  }, [id, user, loadPresentation, createPresentation]);

  const handleSave = async () => {
    if (!currentPresentation) return;
    
    setIsSaving(true);
    try {
      await savePresentation();
      toast.success('Presentation saved successfully');
    } catch (error) {
      console.error('Failed to save presentation:', error);
      toast.error('Failed to save presentation');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    toast.success('Export feature coming soon!');
  };

  const handlePreview = () => {
    toast.success('Preview feature coming soon!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading presentation...</p>
        </div>
      </div>
    );
  }

  if (!currentPresentation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <Card.Content className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Presentation Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The presentation you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {currentPresentation.title}
              </h1>
              <p className="text-sm text-gray-600">
                Last saved: {new Date(currentPresentation.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handlePreview}
              className="flex items-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            
            <Button
              onClick={handleExport}
              className="flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        <VisualEditor />
      </div>
    </div>
  );
};

export default Editor;
