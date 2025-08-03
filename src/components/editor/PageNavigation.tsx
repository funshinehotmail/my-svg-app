import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  Copy, 
  Trash2, 
  Edit3,
  GripVertical
} from 'lucide-react';

export const PageNavigation: React.FC = () => {
  const { 
    editorPages, 
    currentPageIndex, 
    setCurrentPageIndex, 
    addPage, 
    removePage, 
    duplicatePage,
    updatePageTitle
  } = useAppStore();

  const [editingPageIndex, setEditingPageIndex] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showPageMenu, setShowPageMenu] = useState<number | null>(null);

  const handlePageClick = (index: number) => {
    setCurrentPageIndex(index);
    setShowPageMenu(null);
  };

  const handleAddPage = () => {
    addPage();
  };

  const handleEditTitle = (index: number, currentTitle: string) => {
    setEditingPageIndex(index);
    setEditingTitle(currentTitle);
    setShowPageMenu(null);
  };

  const handleSaveTitle = () => {
    if (editingPageIndex !== null && editingTitle.trim()) {
      updatePageTitle(editingPageIndex, editingTitle.trim());
    }
    setEditingPageIndex(null);
    setEditingTitle('');
  };

  const handleCancelEdit = () => {
    setEditingPageIndex(null);
    setEditingTitle('');
  };

  const handleDuplicate = (index: number) => {
    duplicatePage(index);
    setShowPageMenu(null);
  };

  const handleDelete = (index: number) => {
    if (editorPages.length > 1) {
      removePage(index);
    }
    setShowPageMenu(null);
  };

  const canNavigatePrev = currentPageIndex > 0;
  const canNavigateNext = currentPageIndex < editorPages.length - 1;

  return (
    <Card className="mb-6">
      <Card.Content className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Pages</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => canNavigatePrev && setCurrentPageIndex(currentPageIndex - 1)}
              disabled={!canNavigatePrev}
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 px-2">
              {currentPageIndex + 1} of {editorPages.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => canNavigateNext && setCurrentPageIndex(currentPageIndex + 1)}
              disabled={!canNavigateNext}
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Page Thumbnails */}
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {editorPages.map((page, index) => (
            <div
              key={page.id}
              className={`relative flex-shrink-0 group ${
                index === currentPageIndex ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div
                className={`w-24 h-16 bg-white border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  index === currentPageIndex 
                    ? 'border-blue-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePageClick(index)}
              >
                <div className="p-2 h-full flex flex-col justify-center">
                  <div className="w-full h-2 bg-gray-200 rounded mb-1"></div>
                  <div className="w-3/4 h-1 bg-gray-200 rounded mb-1"></div>
                  <div className="w-1/2 h-1 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Page Title */}
              <div className="mt-1 text-center">
                {editingPageIndex === index ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={handleSaveTitle}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTitle();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    className="w-20 text-xs text-center border border-blue-500 rounded px-1 py-0.5"
                    autoFocus
                  />
                ) : (
                  <p className="text-xs text-gray-600 truncate w-24" title={page.title}>
                    {page.title}
                  </p>
                )}
              </div>

              {/* Page Menu */}
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-6 h-6 p-0 bg-white border border-gray-200 shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPageMenu(showPageMenu === index ? null : index);
                    }}
                  >
                    <MoreVertical className="w-3 h-3" />
                  </Button>

                  {showPageMenu === index && (
                    <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <div className="py-1">
                        <button
                          className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          onClick={() => handleEditTitle(index, page.title)}
                        >
                          <Edit3 className="w-3 h-3 mr-2" />
                          Rename
                        </button>
                        <button
                          className="w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                          onClick={() => handleDuplicate(index)}
                        >
                          <Copy className="w-3 h-3 mr-2" />
                          Duplicate
                        </button>
                        {editorPages.length > 1 && (
                          <button
                            className="w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                            onClick={() => handleDelete(index)}
                          >
                            <Trash2 className="w-3 h-3 mr-2" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Drag Handle */}
              <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-3 h-3 text-gray-400 cursor-move" />
              </div>
            </div>
          ))}

          {/* Add Page Button */}
          <div className="flex-shrink-0">
            <button
              onClick={handleAddPage}
              className="w-24 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-6 h-6 text-gray-400" />
            </button>
            <p className="text-xs text-gray-500 text-center mt-1">Add Page</p>
          </div>
        </div>

        {/* Page Info */}
        {editorPages[currentPageIndex] && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Current: <strong>{editorPages[currentPageIndex].title}</strong>
              </span>
              <span>
                Updated: {new Date(editorPages[currentPageIndex].updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};
