import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Copy,
  MoreVertical,
  Grid,
  Layout
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PageLayout {
  id: string;
  name: string;
  description: string | null;
  layout_type: 'title' | 'content' | 'comparison' | 'conclusion' | 'custom';
  template_data: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminLayouts: React.FC = () => {
  const [layouts, setLayouts] = useState<PageLayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    loadLayouts();
  }, []);

  const loadLayouts = async () => {
    try {
      const { data, error } = await supabase
        .from('page_layouts')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setLayouts(data || []);
    } catch (error) {
      console.error('Error loading layouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLayouts = layouts.filter(layout => {
    const matchesSearch = layout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         layout.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || layout.layout_type === filterType;
    
    return matchesSearch && matchesType;
  });

  const getLayoutIcon = (type: string) => {
    switch (type) {
      case 'title':
        return <Layout className="h-5 w-5 text-blue-500" />;
      case 'content':
        return <Grid className="h-5 w-5 text-green-500" />;
      case 'comparison':
        return <Layers className="h-5 w-5 text-purple-500" />;
      case 'conclusion':
        return <Layout className="h-5 w-5 text-orange-500" />;
      default:
        return <Grid className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      title: 'bg-blue-100 text-blue-800',
      content: 'bg-green-100 text-green-800',
      comparison: 'bg-purple-100 text-purple-800',
      conclusion: 'bg-orange-100 text-orange-800',
      custom: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[type as keyof typeof styles]}`}>
        {type}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Layout Management</h1>
        <p className="text-gray-600">Manage page layouts and templates</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search layouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="title">Title</option>
              <option value="content">Content</option>
              <option value="comparison">Comparison</option>
              <option value="conclusion">Conclusion</option>
              <option value="custom">Custom</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              New Layout
            </button>
          </div>
        </div>
      </div>

      {/* Layouts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLayouts.map((layout) => (
          <div key={layout.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {getLayoutIcon(layout.layout_type)}
                  <h3 className="ml-2 text-lg font-semibold text-gray-900">{layout.name}</h3>
                </div>
                <div className="flex items-center space-x-1">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                {getTypeBadge(layout.layout_type)}
                {layout.is_active && (
                  <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                )}
              </div>

              {layout.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {layout.description}
                </p>
              )}

              {/* Layout Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 h-24 flex items-center justify-center">
                <div className="text-gray-400 text-sm">Layout Preview</div>
              </div>

              <div className="text-xs text-gray-500 mb-4">
                Updated {new Date(layout.updated_at).toLocaleDateString()}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900" title="View">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900" title="Edit">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-purple-600 hover:text-purple-900" title="Duplicate">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-900" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLayouts.length === 0 && (
        <div className="text-center py-12">
          <Layers className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No layouts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterType !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Get started by creating your first layout template.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminLayouts;
