import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Search, Grid, List } from 'lucide-react';
import { iconLibrary, type IconDefinition, type IconCategory } from '../../services/visual/iconLibrary';

interface IconPickerProps {
  onIconSelect: (icon: IconDefinition) => void;
  selectedIcon?: IconDefinition;
  suggestedKeywords?: string[];
  className?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  onIconSelect,
  selectedIcon,
  suggestedKeywords = [],
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = iconLibrary.getCategories();

  const filteredIcons = useMemo(() => {
    let icons: IconDefinition[] = [];

    if (selectedCategory === 'all') {
      icons = categories.flatMap(cat => cat.icons);
    } else {
      icons = iconLibrary.getIconsByCategory(selectedCategory);
    }

    if (searchQuery.trim()) {
      icons = iconLibrary.searchIcons(searchQuery);
    }

    return icons;
  }, [searchQuery, selectedCategory, categories]);

  const suggestedIcons = useMemo(() => {
    if (suggestedKeywords.length === 0) return [];
    return iconLibrary.suggestIcons(suggestedKeywords);
  }, [suggestedKeywords]);

  const renderIcon = (icon: IconDefinition) => (
    <div
      key={icon.id}
      className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
        selectedIcon?.id === icon.id
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onIconSelect(icon)}
    >
      <div className="flex flex-col items-center space-y-2">
        <div 
          className="w-8 h-8 flex items-center justify-center"
          dangerouslySetInnerHTML={{ 
            __html: iconLibrary.renderIcon(icon.id, 24, selectedIcon?.id === icon.id ? '#3b82f6' : '#6b7280') 
          }}
        />
        {viewMode === 'list' && (
          <div className="text-center">
            <p className="text-xs font-medium text-gray-900">{icon.name}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {icon.keywords.slice(0, 2).map(keyword => (
                <Badge key={keyword} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card className={className}>
      <Card.Header>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Choose an Icon</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card.Header>

      <Card.Content className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Suggested Icons */}
        {suggestedIcons.length > 0 && !searchQuery && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Suggested for your content</h4>
            <div className={`grid gap-2 ${viewMode === 'grid' ? 'grid-cols-6' : 'grid-cols-4'}`}>
              {suggestedIcons.slice(0, 6).map(renderIcon)}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All Categories
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Icons Grid */}
        <div className="max-h-96 overflow-y-auto">
          {filteredIcons.length > 0 ? (
            <div className={`grid gap-2 ${
              viewMode === 'grid' 
                ? 'grid-cols-8' 
                : 'grid-cols-4'
            }`}>
              {filteredIcons.map(renderIcon)}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No icons found matching your search.</p>
              <p className="text-sm">Try different keywords or browse categories.</p>
            </div>
          )}
        </div>

        {/* Selected Icon Info */}
        {selectedIcon && (
          <div className="border-t pt-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 flex items-center justify-center"
                dangerouslySetInnerHTML={{ 
                  __html: iconLibrary.renderIcon(selectedIcon.id, 24, '#3b82f6') 
                }}
              />
              <div>
                <p className="font-medium text-gray-900">{selectedIcon.name}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedIcon.keywords.slice(0, 4).map(keyword => (
                    <Badge key={keyword} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};
