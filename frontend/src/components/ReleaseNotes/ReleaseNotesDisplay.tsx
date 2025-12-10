import React, { useState } from 'react';
import { CategorizedReleaseNotes, ReleaseNoteItem } from '../../types/releaseNotes';
import { Sparkles, Bug, Shield, Zap, Wrench, Edit2, Trash2, Copy, Download } from 'lucide-react';

interface ReleaseNotesDisplayProps {
  releaseNotes: CategorizedReleaseNotes;
  onEdit: (category: string, index: number, item: ReleaseNoteItem) => void;
  onRemove: (category: string, index: number) => void;
  onExport: (format: 'markdown' | 'html' | 'json') => void;
  onCopyToClipboard: () => void;
}

interface CategoryConfig {
  key: keyof CategorizedReleaseNotes;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const ReleaseNotesDisplay: React.FC<ReleaseNotesDisplayProps> = ({
  releaseNotes,
  onEdit,
  onRemove,
  onExport,
  onCopyToClipboard,
}) => {
  const [editingItem, setEditingItem] = useState<{ category: string; index: number } | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  const categories: CategoryConfig[] = [
    { key: 'features', label: 'New Features', icon: Sparkles, color: 'text-blue-400' },
    { key: 'bugFixes', label: 'Bug Fixes', icon: Bug, color: 'text-red-400' },
    { key: 'security', label: 'Security Updates', icon: Shield, color: 'text-yellow-400' },
    { key: 'performance', label: 'Performance Improvements', icon: Zap, color: 'text-green-400' },
    { key: 'maintenance', label: 'Maintenance', icon: Wrench, color: 'text-gray-400' },
  ];

  const handleStartEdit = (category: string, index: number, item: ReleaseNoteItem) => {
    setEditingItem({ category, index });
    setEditedTitle(item.title);
    setEditedDescription(item.description);
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      const category = editingItem.category;
      const index = editingItem.index;
      const items = releaseNotes[category as keyof CategorizedReleaseNotes];
      const originalItem = items[index];
      
      onEdit(category, index, {
        ...originalItem,
        title: editedTitle,
        description: editedDescription,
      });
      
      setEditingItem(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const getCategoryItems = (category: CategoryConfig) => {
    return releaseNotes[category.key] || [];
  };

  const totalItems = Object.values(releaseNotes).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-github-dark-text">Generated Release Notes</h2>
          <p className="text-sm text-github-dark-text-secondary mt-1">
            {totalItems} change{totalItems !== 1 ? 's' : ''} categorized
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCopyToClipboard}
            className="flex items-center gap-2 px-4 py-2 bg-github-dark-bg-tertiary border border-github-dark-border rounded text-github-dark-text hover:border-github-dark-text-link transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
          <button
            onClick={() => onExport('markdown')}
            className="flex items-center gap-2 px-4 py-2 bg-github-dark-accent-emphasis text-white rounded hover:bg-opacity-90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Markdown
          </button>
        </div>
      </div>

      {/* Export Options */}
      <div className="flex gap-2 text-sm">
        <button
          onClick={() => onExport('html')}
          className="px-3 py-1 bg-github-dark-bg-tertiary border border-github-dark-border rounded text-github-dark-text hover:border-github-dark-text-link transition-colors"
        >
          Export HTML
        </button>
        <button
          onClick={() => onExport('json')}
          className="px-3 py-1 bg-github-dark-bg-tertiary border border-github-dark-border rounded text-github-dark-text hover:border-github-dark-text-link transition-colors"
        >
          Export JSON
        </button>
      </div>

      {/* Categories */}
      {categories.map((category) => {
        const items = getCategoryItems(category);
        
        if (items.length === 0) return null;

        return (
          <div key={category.key} className="bg-github-dark-bg-secondary border border-github-dark-border rounded-lg p-6">
            <div className="flex items-center mb-4">
              <category.icon className={`w-6 h-6 mr-3 ${category.color}`} />
              <h3 className="text-xl font-semibold text-github-dark-text">
                {category.label}
              </h3>
              <span className="ml-3 px-2 py-1 bg-github-dark-bg-tertiary rounded text-xs text-github-dark-text-secondary">
                {items.length}
              </span>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => {
                const isEditing = editingItem?.category === category.key && editingItem?.index === index;

                return (
                  <div
                    key={index}
                    className="bg-github-dark-bg-tertiary border border-github-dark-border rounded p-4"
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-github-dark-bg border border-github-dark-border rounded text-github-dark-text focus:outline-none focus:border-github-dark-text-link"
                          placeholder="Title"
                        />
                        <textarea
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 bg-github-dark-bg border border-github-dark-border rounded text-github-dark-text focus:outline-none focus:border-github-dark-text-link"
                          placeholder="Description"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="px-3 py-1 bg-github-dark-success text-white rounded text-sm hover:bg-opacity-90"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-github-dark-bg-tertiary border border-github-dark-border rounded text-github-dark-text text-sm hover:border-github-dark-text-link"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-github-dark-text mb-2">
                              {item.title}
                            </h4>
                            <p className="text-sm text-github-dark-text-secondary mb-3">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-github-dark-text-secondary">
                              {item.prNumber && (
                                <span className="bg-github-dark-bg px-2 py-1 rounded">
                                  PR #{item.prNumber}
                                </span>
                              )}
                              {item.issueNumbers && item.issueNumbers.length > 0 && (
                                <span className="bg-github-dark-bg px-2 py-1 rounded">
                                  Issues: #{item.issueNumbers.join(', #')}
                                </span>
                              )}
                              {item.impact && (
                                <span className={`px-2 py-1 rounded ${
                                  item.impact === 'critical' ? 'bg-red-900 text-red-200' :
                                  item.impact === 'high' ? 'bg-orange-900 text-orange-200' :
                                  item.impact === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                                  'bg-gray-800 text-gray-300'
                                }`}>
                                  {item.impact}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleStartEdit(category.key, index, item)}
                              className="p-2 text-github-dark-text-secondary hover:text-github-dark-text-link transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onRemove(category.key, index)}
                              className="p-2 text-github-dark-text-secondary hover:text-github-dark-danger transition-colors"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {totalItems === 0 && (
        <div className="text-center py-12 text-github-dark-text-secondary">
          No release notes generated yet
        </div>
      )}
    </div>
  );
};

export default ReleaseNotesDisplay;

