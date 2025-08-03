import React from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePresentationStore } from '../../store/presentationStore';

export const PageNavigation: React.FC = () => {
  const { 
    pages, 
    currentPageIndex, 
    setCurrentPage, 
    addPage, 
    deletePage 
  } = usePresentationStore();

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPage(currentPageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPage(currentPageIndex + 1);
    }
  };

  const handleAddPage = () => {
    addPage({
      title: `Slide ${pages.length + 1}`,
      content: '',
      visualType: 'text'
    });
  };

  const handleDeletePage = (index: number) => {
    if (pages.length > 1) {
      deletePage(index);
    }
  };

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Pages ({pages.length})
        </h3>
        <button
          onClick={handleAddPage}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Page</span>
        </button>
      </div>

      {/* Page Thumbnails */}
      <div className="flex items-center space-x-4 overflow-x-auto pb-2">
        {pages.map((page, index) => (
          <div
            key={page.id}
            className={`relative flex-shrink-0 w-32 h-20 border-2 rounded-lg cursor-pointer transition-all ${
              index === currentPageIndex
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => setCurrentPage(index)}
          >
            <div className="p-2 h-full overflow-hidden">
              <div className="text-xs font-medium text-gray-900 mb-1 truncate">
                {page.title || `Slide ${index + 1}`}
              </div>
              <div className="text-xs text-gray-600 line-clamp-2">
                {page.content || 'Empty slide'}
              </div>
            </div>

            {/* Page Number */}
            <div className="absolute top-1 right-1 bg-gray-900 text-white text-xs px-1.5 py-0.5 rounded">
              {index + 1}
            </div>

            {/* Delete Button */}
            {pages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePage(index);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPageIndex === 0}
          className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-sm text-gray-600">
          Page {currentPageIndex + 1} of {pages.length}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPageIndex === pages.length - 1}
          className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
