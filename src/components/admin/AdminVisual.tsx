import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Upload,
  MoreVertical,
  Image,
  Tag
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SmartIcon {
  id: string;
  name: string;
  description: string | null;
  svg_content: string;
  tags: string[];
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminVisual: React.FC = () => {
  const [icons, setIcons] = useState<SmartIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    loadIcons();
  }, []);

  const loadIcons = async () => {
    try {
      const { data, error } = await supabase
        .from('smart_icons')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setIcons(data || []);
    } catch (error) {
      console.error('Error loading icons:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIcons = icons.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         icon.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         icon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || icon.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(icons.map(icon => icon.category))];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
        <h1 className="text-2xl font-bold text-gray-900">Visual Elements</h1>
        <p className="text-gray-600">Manage smart icons and visual assets</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              New Icon
            </button>
          </div>
        </div>
      </div>

      {/* Icons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredIcons.map((icon) => (
          <div key={icon.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{icon.name}</h3>
                <div className="flex items-center space-x-1">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Icon Preview */}
              <div className="bg-gray-50 rounded-lg p-6 mb-4 h-24 flex items-center justify-center">
                {icon.svg_content ? (
                  <div 
                    className="w-12 h-12"
                    dangerouslySetInnerHTML={{ __html: icon.svg_content }}
                  />
                ) : (
                  <Image className="h-12 w-12 text-gray-400" />
                )}
              </div>

              <div className="mb-4">
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {icon.category}
                </span>
                {icon.is_active && (
                  <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                )}
              </div>

              {icon.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {icon.description}
                </p>
              )}

              {/* Tags */}
              {icon.tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {icon.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {icon.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{icon.tags.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 mb-4">
                Updated {new Date(icon.updated_at).toLocaleDateString()}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900" title="View">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900" title="Edit">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="text-purple-600 hover:text-purple-900" title="Download">
                    <Download className="h-4 w-4" />
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

      {filteredIcons.length === 0 && (
        <div className="text-center py-12">
          <Palette className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No icons found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterCategory !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Get started by uploading your first smart icon.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminVisual;
