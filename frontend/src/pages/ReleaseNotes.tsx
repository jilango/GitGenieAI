import React, { useState } from 'react';
import { FileText, Loader2, AlertCircle } from 'lucide-react';
import { ReleaseNotesInput as ReleaseNotesInputType, CategorizedReleaseNotes, ReleaseNoteItem } from '../types/releaseNotes';
import { generateReleaseNotes } from '../services/api';
import ReleaseNotesInput from '../components/ReleaseNotes/ReleaseNotesInput';
import ReleaseNotesDisplay from '../components/ReleaseNotes/ReleaseNotesDisplay';
import { 
  exportAsMarkdown, 
  exportAsHTML, 
  exportAsJSON, 
  formatForClipboard,
  downloadFile 
} from '../utils/exportReleaseNotes';
import { OpenAIModel } from '../types/models';

interface ReleaseNotesProps {
  apiKey: string;
  selectedModel: OpenAIModel;
}

const ReleaseNotes: React.FC<ReleaseNotesProps> = ({ apiKey, selectedModel }) => {
  const [releaseNotes, setReleaseNotes] = useState<CategorizedReleaseNotes | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleGenerate = async (input: ReleaseNotesInputType) => {
    if (!apiKey) {
      setError('Please set your OpenAI API key first');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await generateReleaseNotes(input, apiKey, selectedModel);
      setReleaseNotes(response.releaseNotes);
      setSuccessMessage(`✓ Generated ${response.summary.totalChanges} release notes items`);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate release notes');
      setReleaseNotes(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: string, index: number, item: ReleaseNoteItem) => {
    if (!releaseNotes) return;
    
    const updated = { ...releaseNotes };
    updated[category as keyof CategorizedReleaseNotes][index] = item;
    setReleaseNotes(updated);
  };

  const handleRemove = (category: string, index: number) => {
    if (!releaseNotes) return;
    
    const updated = { ...releaseNotes };
    updated[category as keyof CategorizedReleaseNotes].splice(index, 1);
    setReleaseNotes(updated);
  };

  const handleExport = (format: 'markdown' | 'html' | 'json') => {
    if (!releaseNotes) return;

    const date = new Date().toISOString().split('T')[0];
    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'markdown':
        content = exportAsMarkdown(releaseNotes);
        filename = `release-notes-${date}.md`;
        mimeType = 'text/markdown';
        break;
      case 'html':
        content = exportAsHTML(releaseNotes);
        filename = `release-notes-${date}.html`;
        mimeType = 'text/html';
        break;
      case 'json':
        content = exportAsJSON(releaseNotes);
        filename = `release-notes-${date}.json`;
        mimeType = 'application/json';
        break;
    }

    downloadFile(content, filename, mimeType);
    setSuccessMessage(`✓ Exported as ${format.toUpperCase()}`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCopyToClipboard = async () => {
    if (!releaseNotes) return;

    try {
      const text = formatForClipboard(releaseNotes);
      await navigator.clipboard.writeText(text);
      setSuccessMessage('✓ Copied to clipboard');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to copy to clipboard');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleReset = () => {
    setReleaseNotes(null);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto text-github-dark-text">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-github-dark-text mb-2 flex items-center">
          <FileText className="w-8 h-8 mr-3 text-github-dark-text-link" /> Release Notes Generator
        </h1>
        <p className="text-github-dark-text-secondary">
          Generate professional release notes from your merged PRs and issues with AI
        </p>
      </header>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-github-dark-danger bg-opacity-10 border border-github-dark-danger rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-github-dark-danger mr-3 flex-shrink-0 mt-0.5" />
          <span className="text-github-dark-danger">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-github-dark-success bg-opacity-10 border border-github-dark-success rounded-lg text-green-400">
          {successMessage}
        </div>
      )}

      {/* Main Content */}
      {!releaseNotes ? (
        <div className="max-w-3xl mx-auto">
          <ReleaseNotesInput onGenerate={handleGenerate} />
          
          {isLoading && (
            <div className="mt-8 text-center">
              <Loader2 className="inline-block animate-spin h-12 w-12 text-github-dark-text-link" />
              <p className="mt-4 text-github-dark-text-secondary">
                Generating release notes with AI... This may take a moment.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-github-dark-bg-tertiary border border-github-dark-border rounded text-github-dark-text hover:border-github-dark-text-link transition-colors"
            >
              ← Generate New Release Notes
            </button>
          </div>
          
          <ReleaseNotesDisplay
            releaseNotes={releaseNotes}
            onEdit={handleEdit}
            onRemove={handleRemove}
            onExport={handleExport}
            onCopyToClipboard={handleCopyToClipboard}
          />
        </div>
      )}
    </div>
  );
};

export default ReleaseNotes;
