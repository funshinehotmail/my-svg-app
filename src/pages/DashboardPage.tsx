import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Clock, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '../components/auth/AuthProvider';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface Presentation {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
  views: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPresentations: 0,
    totalViews: 0,
    recentActivity: 0
  });

  useEffect(() => {
    // Simulate loading presentations
    const loadPresentations = async () => {
      setLoading(true);
      
      // Mock data for now
      const mockPresentations: Presentation[] = [
        {
          id: '1',
          title: 'Q4 Sales Report',
          description: 'Comprehensive analysis of Q4 sales performance and trends',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-16T14:20:00Z',
          status: 'published',
          views: 245
        },
        {
          id: '2',
          title: 'Marketing Strategy 2024',
          description: 'Strategic marketing initiatives for the upcoming year',
          createdAt: '2024-01-10T09:15:00Z',
          updatedAt: '2024-01-12T16:45:00Z',
          status: 'draft',
          views: 89
        },
        {
          id: '3',
          title: 'Product Launch Presentation',
          description: 'New product features and market positioning',
          createdAt: '2024-01-08T11:00:00Z',
          updatedAt: '2024-01-08T11:00:00Z',
          status: 'published',
          views: 156
        }
      ];

      setPresentations(mockPresentations);
      setStats({
        totalPresentations: mockPresentations.length,
        totalViews: mockPresentations.reduce((sum, p) => sum + p.views, 0),
        recentActivity: mockPresentations.filter(p => 
          new Date(p.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length
      });
      
      setLoading(false);
    };

    loadPresentations();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.email}</p>
            </div>
            <Link
              to="/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Presentation
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Presentations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPresentations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentActivity}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Presentations */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Presentations</h2>
          </div>
          
          {presentations.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No presentations yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first AI-powered presentation</p>
              <Link
                to="/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Presentation
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {presentations.map((presentation) => (
                <div key={presentation.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link 
                            to={`/editor/${presentation.id}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {presentation.title}
                          </Link>
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          presentation.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {presentation.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">{presentation.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Created {formatDate(presentation.createdAt)}</span>
                        <span>•</span>
                        <span>Updated {formatDate(presentation.updatedAt)}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {presentation.views} views
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/editor/${presentation.id}`}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/presentation/${presentation.id}`}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
