import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Issue } from '../../types/issue';
import IssueDisplay from './IssueDisplay';
import ExportDialog from '../Export/ExportDialog';

interface IssueComparisonProps {
  originalIssue: Issue;
  improvedIssue: Issue;
  onAccept: () => void;
  onReject: () => void;
  onRegenerate: () => void;
  onEdit: (issue: Issue) => void;
  onExport: (format: 'markdown' | 'html' | 'json' | 'csv', template?: string) => void;
  onCopy: (template?: string) => void;
  isLoading: boolean;
}

const IssueComparison: React.FC<IssueComparisonProps> = ({
  originalIssue,
  improvedIssue,
  onAccept,
  onReject,
  onRegenerate,
  onEdit,
  onExport,
  onCopy,
  isLoading,
}) => {
  const [showExportDialog, setShowExportDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-github-dark-text">Issue Comparison</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowExportDialog(true)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-github-dark-bg-tertiary border border-github-dark-border rounded text-github-dark-text hover:border-github-dark-text-link transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="px-4 py-2 bg-github-dark-bg-tertiary border border-github-dark-border rounded text-github-dark-text hover:border-github-dark-text-link transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔄 Regenerate
          </button>
          <button
            onClick={onReject}
            disabled={isLoading}
            className="px-4 py-2 bg-github-dark-danger text-white rounded hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✗ Reject
          </button>
          <button
            onClick={onAccept}
            disabled={isLoading}
            className="px-4 py-2 bg-github-dark-success text-white rounded hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✓ Accept
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IssueDisplay issue={originalIssue} title="Original Issue" />
        <IssueDisplay
          issue={improvedIssue}
          title="Improved Issue"
          editable={true}
          onEdit={onEdit}
        />
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-github-dark-text-link"></div>
          <p className="mt-2 text-github-dark-text-secondary">Regenerating with AI...</p>
        </div>
      )}

      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={onExport}
        onCopy={onCopy}
        exportType="issue"
      />
    </div>
  );
};

export default IssueComparison;

