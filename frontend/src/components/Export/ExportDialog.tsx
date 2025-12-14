import React, { useState } from 'react';
import { Download, Copy, X } from 'lucide-react';
import { getAvailableVariables, ExportType } from '../../utils/templateEngine';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'markdown' | 'html' | 'json' | 'csv', template?: string) => void;
  onCopy: (template?: string) => void;
  exportType: ExportType;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  onExport,
  onCopy,
  exportType,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'markdown' | 'html' | 'json' | 'csv'>('markdown');
  const [useTemplate, setUseTemplate] = useState(false);
  const [template, setTemplate] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [preview, setPreview] = useState('');

  const availableVariables = getAvailableVariables(exportType);

  if (!isOpen) return null;

  const handleExport = () => {
    onExport(selectedFormat, useTemplate && template ? template : undefined);
    onClose();
  };

  const handleCopy = () => {
    onCopy(useTemplate && template ? template : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-github-dark-bg-secondary border border-github-dark-border rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-github-dark-text">Export Options</h2>
          <button
            onClick={onClose}
            className="text-github-dark-text-secondary hover:text-github-dark-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-github-dark-text mb-2">
            Export Format
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['markdown', 'html', 'json', 'csv'] as const).map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format)}
                className={`px-3 py-2 rounded text-sm transition-colors ${
                  selectedFormat === format
                    ? 'bg-github-dark-accent-emphasis text-white'
                    : 'bg-github-dark-bg-tertiary border border-github-dark-border text-github-dark-text hover:border-github-dark-text-link'
                }`}
              >
                {format.charAt(0).toUpperCase() + format.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Template Option */}
        <div className="mb-4">
          <label className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={useTemplate}
              onChange={(e) => setUseTemplate(e.target.checked)}
              className="rounded border-github-dark-border bg-github-dark-bg text-github-dark-accent-emphasis focus:ring-github-dark-accent-emphasis"
            />
            <span className="text-sm font-medium text-github-dark-text">Use Custom Template</span>
          </label>

          {useTemplate && (
            <div className="mt-2">
              <textarea
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                placeholder={`Enter template with variables like {{title}}, {{body}}, etc.\n\nAvailable variables: ${availableVariables.join(', ')}`}
                rows={8}
                className="w-full px-3 py-2 bg-github-dark-bg border border-github-dark-border rounded text-github-dark-text focus:outline-none focus:border-github-dark-text-link font-mono text-sm"
              />
              <p className="text-xs text-github-dark-text-secondary mt-1">
                Available variables: {availableVariables.map(v => `{{${v}}}`).join(', ')}
              </p>
            </div>
          )}
        </div>


        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-github-dark-bg-tertiary border border-github-dark-border rounded text-github-dark-text hover:border-github-dark-text-link transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-github-dark-bg-tertiary border border-github-dark-border rounded text-github-dark-text hover:border-github-dark-text-link transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-github-dark-accent-emphasis text-white rounded hover:bg-opacity-90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export {selectedFormat.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;

