import React, { useState } from 'react';
import { Wrench } from 'lucide-react';
import { Issue } from '../types/issue';
import { improveIssue } from '../services/api';
import IssueInput from '../components/IssueGroomer/IssueInput';
import IssueComparison from '../components/IssueGroomer/IssueComparison';
import { OpenAIModel } from '../types/models';
import {
  exportIssueAsMarkdown,
  exportIssueAsHTML,
  exportIssueAsJSON,
  exportIssueAsCSV,
  formatIssueForClipboard,
} from '../utils/exportIssue';
import { downloadFile, copyToClipboard, formatFilename, MIME_TYPES } from '../utils/exportUtils';

interface IssueGroomingProps {
  apiKey: string;
  selectedModel: OpenAIModel;
}

const IssueGrooming: React.FC<IssueGroomingProps> = ({ apiKey, selectedModel }) => {
  const [originalIssue, setOriginalIssue] = useState<Issue | null>(null);
  const [improvedIssue, setImprovedIssue] = useState<Issue | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleImproveIssue = async (issue: Issue) => {
    if (!apiKey) {
      setError('Please configure your OpenAI API key first');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    setOriginalIssue(issue);

    try {
      const improved = await improveIssue(issue, apiKey, selectedModel);
      setImprovedIssue(improved);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to improve issue');
      setImprovedIssue(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (originalIssue) {
      await handleImproveIssue(originalIssue);
    }
  };

  const handleAccept = () => {
    setSuccessMessage('✓ Issue accepted! In a production environment, this would update the issue in GitHub/Jira.');
    setTimeout(() => {
      setSuccessMessage('');
      setOriginalIssue(null);
      setImprovedIssue(null);
    }, 3000);
  };

  const handleReject = () => {
    setOriginalIssue(null);
    setImprovedIssue(null);
    setSuccessMessage('');
    setError('');
  };

  const handleEdit = (editedIssue: Issue) => {
    setImprovedIssue(editedIssue);
  };

  const handleExport = (format: 'markdown' | 'html' | 'json' | 'csv', template?: string) => {
    if (!improvedIssue) return;

    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'markdown':
        content = exportIssueAsMarkdown(improvedIssue, template);
        filename = formatFilename('issue', 'md');
        mimeType = MIME_TYPES.markdown;
        break;
      case 'html':
        content = exportIssueAsHTML(improvedIssue, template);
        filename = formatFilename('issue', 'html');
        mimeType = MIME_TYPES.html;
        break;
      case 'json':
        content = exportIssueAsJSON(improvedIssue);
        filename = formatFilename('issue', 'json');
        mimeType = MIME_TYPES.json;
        break;
      case 'csv':
        content = exportIssueAsCSV(improvedIssue);
        filename = formatFilename('issue', 'csv');
        mimeType = MIME_TYPES.csv;
        break;
    }

    downloadFile(content, filename, mimeType);
    setSuccessMessage(`✓ Exported as ${format.toUpperCase()}`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCopy = async (template?: string) => {
    if (!improvedIssue) return;

    try {
      let text: string;
      if (template) {
        // Use template for clipboard
        const data = {
          ...improvedIssue,
          labels: improvedIssue.labels?.join(', ') || '',
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        };
        const { parseTemplate } = await import('../utils/templateEngine');
        text = parseTemplate(template, data);
      } else {
        text = formatIssueForClipboard(improvedIssue);
      }
      
      await copyToClipboard(text);
      setSuccessMessage('✓ Copied to clipboard');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to copy to clipboard');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="p-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-github-dark-text mb-2 flex items-center">
          <Wrench className="w-8 h-8 mr-3 text-github-dark-text-link" /> Issue Groomer
        </h1>
        <p className="text-github-dark-text-secondary">
          Improve your issues with AI-powered suggestions
        </p>
      </header>

        {error && (
          <div className="mb-6 p-4 bg-github-dark-danger bg-opacity-10 border border-github-dark-danger rounded-lg text-github-dark-danger">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-github-dark-success bg-opacity-10 border border-github-dark-success rounded-lg text-green-400">
            {successMessage}
          </div>
        )}

        {!originalIssue || !improvedIssue ? (
          <div className="max-w-3xl">
            <IssueInput onIssueSubmit={handleImproveIssue} />
            {isLoading && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-github-dark-text-link"></div>
                <p className="mt-4 text-github-dark-text-secondary">
                  Improving issue with AI... This may take a few moments.
                </p>
              </div>
            )}
          </div>
        ) : (
          <IssueComparison
            originalIssue={originalIssue}
            improvedIssue={improvedIssue}
            onAccept={handleAccept}
            onReject={handleReject}
            onRegenerate={handleRegenerate}
            onEdit={handleEdit}
            onExport={handleExport}
            onCopy={handleCopy}
            isLoading={isLoading}
          />
        )}
    </div>
  );
};

export default IssueGrooming;

