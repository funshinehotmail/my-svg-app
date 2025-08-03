import React, { useState, useCallback } from 'react';
import { Search, Download, Plus, X, Eye, Tag, FileText } from 'lucide-react';
import { svgRepoService } from '../../services/svgRepo';
import { svgImportsDB, smartIconsDB, visualMetaphorsDB } from '../../lib/adminSupabase';
import { useAuth } from '../auth/AuthProvider';
import type { SVGRepoSearchResult } from '../../types/admin';

interface SVGImporterProps {
  onImport?: (svgData: any) => void;
  importType?: 'icon' | 'metaphor' | 'import';
  isOpen: boolean;
  onClose: () => void;
}

const SVGImporter: React.FC<SVGImporterProps> = ({ 
  onImport, 
  importType = 'import',
  isOpen,
  onClose 
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SVGRepoSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSVG, setSelectedSVG] = useState<SVGRepoSearchResult | null>(null);
  const [svgContent, setSvgContent] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Import form state
  const [importForm, setImportForm] = useState({
    name: '',
    description: '',
    category: '',
    tags: '',
    ai_description: '',
    metaphor_type: '',
    keywords: '',
    usage_context: ''
  });

  const handleSearch = useCallback(async (query: string, page = 1) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await svgRepoService.search(query, page, 20);
      setSearchResults(response.results);
      setTotalResults(response.total);
      setCurrentPage(page);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSelectSVG = async (svg: SVGRepoSearchResult) => {
    setSelectedSVG(svg);
    setImportForm(prev => ({
      ...prev,
      name: svg.title,
      description: svg.description || '',
      tags: svg.tags.join(', '),
      category: svg.tags[0] || 'general'
    }));

    // Download SVG content
    try {
      const content = await svgRepoService.downloadSVG(svg.id);
      setSvgContent(content);
    } catch (error) {
      console.error('Failed to download SVG:', error);
    }
  };

  const handleImport = async () => {
    if (!selectedSVG || !user) return;

    setIsImporting(true);
    try {
      // First, save to SVG imports
      const svgImportData = {
        source: 'svgrepo',
        source_id: selectedSVG.id,
        source_url: selectedSVG.url,
        name: importForm.name,
        description: importForm.description,
        svg_content: svgContent,
        tags: importForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        license: selectedSVG.license,
        imported_by: user.id
      };

      const { data: importedSVG, error: importError } = await svgImportsDB.create(svgImportData);
      if (importError) throw importError;

      // Then create the specific type based on importType
      if (importType === 'icon') {
        const iconData = {
          name: importForm.name,
          description: importForm.description,
          category: importForm.category || 'general',
          svg_content: svgContent,
          svg_url: selectedSVG.url,
          tags: importForm.tags.split(',').map(t => t.trim()).filter(Boolean),
          ai_description: importForm.ai_description,
          keywords: importForm.keywords.split(',').map(k => k.trim()).filter(Boolean),
          size_variants: [
            { name: 'small', size: 16 },
            { name: 'medium', size: 24 },
            { name: 'large', size: 32 }
          ],
          style_variants: [
            { name: 'outline', style: 'outline' },
            { name: 'filled', style: 'filled' }
          ],
          is_active: true,
          created_by: user.id
        };

        const { data: icon, error: iconError } = await smartIconsDB.create(iconData);
        if (iconError) throw iconError;

        onImport?.(icon);
      } else if (importType === 'metaphor') {
        const metaphorData = {
          name: importForm.name,
          description: importForm.description,
          metaphor_type: importForm.metaphor_type || 'general',
          svg_content: svgContent,
          svg_url: selectedSVG.url,
          tags: importForm.tags.split(',').map(t => t.trim()).filter(Boolean),
          ai_description: importForm.ai_description,
          usage_context: importForm.usage_context,
          color_variants: [
            { name: 'default', colors: { primary: '#3B82F6', secondary: '#1E40AF' } },
            { name: 'success', colors: { primary: '#10B981', secondary: '#047857' } },
            { name: 'warning', colors: { primary: '#F59E0B', secondary: '#D97706' } }
          ],
          is_active: true,
          created_by: user.id
        };

        const { data: metaphor, error: metaphorError } = await visualMetaphorsDB.create(metaphorData);
        if (metaphorError) throw metaphorError;

        onImport?.(metaphor);
      } else {
        onImport?.(importedSVG);
      }

      // Reset form and close
      setSelectedSVG(null);
      setSvgContent('');
      setImportForm({
        name: '',
        description: '',
        category: '',
        tags: '',
        ai_description: '',
        metaphor_type: '',
        keywords: '',
        usage_context: ''
      });
      onClose();
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Import SVG {importType === 'icon' ? 'Icon' : importType === 'metaphor' ? 'Metaphor' : 'Asset'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex h-[calc(90vh-80px)]">
            {/* Search Panel */}
            <div className="w-1/2 border-r border-gray-200 flex flex-col">
              {/* Search Input */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search SVG icons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => handleSearch(searchQuery)}
                  disabled={isSearching || !searchQuery.trim()}
                  className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto p-4">
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {searchResults.map((svg) => (
                      <div
                        key={svg.id}
                        onClick={() => handleSelectSVG(svg)}
                        className={`
                          p-4 border rounded-lg cursor-pointer transition-colors
                          ${selectedSVG?.id === svg.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <div className="flex items-center justify-center h-16 mb-2">
                          <img 
                            src={svg.preview_url} 
                            alt={svg.title}
                            className="max-h-full max-w-full"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {svg.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {svg.license}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 mt-8">
                    <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Search for SVG icons to import</p>
                  </div>
                )}
              </div>
            </div>

            {/* Import Form Panel */}
            <div className="w-1/2 flex flex-col">
              {selectedSVG ? (
                <>
                  {/* SVG Preview */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg mb-4">
                      {svgContent ? (
                        <div 
                          dangerouslySetInnerHTML={{ __html: svgContent }}
                          className="h-16 w-16"
                        />
                      ) : (
                        <div className="text-gray-400">Loading...</div>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900">{selectedSVG.title}</h3>
                    <p className="text-sm text-gray-500">{selectedSVG.description}</p>
                  </div>

                  {/* Import Form */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={importForm.name}
                        onChange={(e) => setImportForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={importForm.description}
                        onChange={(e) => setImportForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {importType === 'icon' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                          </label>
                          <select
                            value={importForm.category}
                            onChange={(e) => setImportForm(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="general">General</option>
                            <option value="business">Business</option>
                            <option value="tech">Technology</option>
                            <option value="people">People</option>
                            <option value="objects">Objects</option>
                            <option value="nature">Nature</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Keywords (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={importForm.keywords}
                            onChange={(e) => setImportForm(prev => ({ ...prev, keywords: e.target.value }))}
                            placeholder="business, chart, data, analytics"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </>
                    )}

                    {importType === 'metaphor' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Metaphor Type
                          </label>
                          <select
                            value={importForm.metaphor_type}
                            onChange={(e) => setImportForm(prev => ({ ...prev, metaphor_type: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="bridge">Bridge</option>
                            <option value="signpost">Signpost</option>
                            <option value="tree">Tree</option>
                            <option value="pyramid">Pyramid</option>
                            <option value="funnel">Funnel</option>
                            <option value="cycle">Cycle</option>
                            <option value="timeline">Timeline</option>
                            <option value="network">Network</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Usage Context
                          </label>
                          <textarea
                            value={importForm.usage_context}
                            onChange={(e) => setImportForm(prev => ({ ...prev, usage_context: e.target.value }))}
                            placeholder="When to use this metaphor..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={importForm.tags}
                        onChange={(e) => setImportForm(prev => ({ ...prev, tags: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        AI Description *
                      </label>
                      <textarea
                        value={importForm.ai_description}
                        onChange={(e) => setImportForm(prev => ({ ...prev, ai_description: e.target.value }))}
                        placeholder="Detailed description for AI matching..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Import Button */}
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={handleImport}
                      disabled={isImporting || !importForm.name || !importForm.ai_description}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isImporting ? (
                        'Importing...'
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Import {importType === 'icon' ? 'Icon' : importType === 'metaphor' ? 'Metaphor' : 'SVG'}
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Select an SVG to preview and import</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SVGImporter;
