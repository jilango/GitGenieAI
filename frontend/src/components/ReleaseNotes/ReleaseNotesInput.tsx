import React, { useState } from 'react';
import { ReleaseNotesInput } from '../../types/releaseNotes';

interface ReleaseNotesInputProps {
  onGenerate: (input: ReleaseNotesInput) => void;
}

const EXAMPLE_INPUT: ReleaseNotesInput = {
  repository: "myorg/myapp",
  dateRange: {
    from: "2024-12-01",
    to: "2024-12-31"
  },
  branch: "main",
  pullRequests: [
    {
      number: 245,
      title: "Add user export to CSV",
      body: "Implemented CSV export functionality for user data",
      labels: ["feature", "enhancement"],
      mergedAt: "2024-12-15T14:30:00Z",
      author: "alice-dev",
      linkedIssues: [123]
    },
    {
      number: 248,
      title: "Fix memory leak in report generation",
      body: "Fixed memory leak in large reports. Reduced memory by 60%",
      labels: ["bug", "performance"],
      mergedAt: "2024-12-18T09:15:00Z",
      author: "bob-eng",
      linkedIssues: [130]
    }
  ]
};

const ReleaseNotesInputComponent: React.FC<ReleaseNotesInputProps> = ({ onGenerate }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const input = JSON.parse(jsonInput);
      
      if (!input.repository || !input.dateRange || !input.pullRequests) {
        setError('Input must include repository, dateRange, and pullRequests');
        return;
      }

      if (!Array.isArray(input.pullRequests) || input.pullRequests.length === 0) {
        setError('pullRequests must be a non-empty array');
        return;
      }

      onGenerate(input);
    } catch (err) {
      setError('Invalid JSON format. Please check your input.');
    }
  };

  const handleUseExample = () => {
    setJsonInput(JSON.stringify(EXAMPLE_INPUT, null, 2));
    setError('');
  };

  return (
    <div className="bg-github-dark-bg-secondary border border-github-dark-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-github-dark-text">Release Data Input</h2>
        <button
          onClick={handleUseExample}
          className="px-3 py-1 text-sm bg-github-dark-bg-tertiary border border-github-dark-border rounded text-github-dark-text hover:border-github-dark-text-link transition-colors"
        >
          Use Example
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="jsonInput" className="block text-sm text-github-dark-text-secondary mb-2">
            Paste Release Data JSON (PRs and Issues)
          </label>
          <textarea
            id="jsonInput"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={`{
  "repository": "myorg/myapp",
  "dateRange": { "from": "2024-12-01", "to": "2024-12-31" },
  "branch": "main",
  "pullRequests": [
    {
      "number": 123,
      "title": "Add new feature",
      "body": "Description",
      "labels": ["feature"],
      "mergedAt": "2024-12-15T14:30:00Z",
      "author": "dev-name"
    }
  ]
}`}
            className="w-full h-96 px-3 py-2 bg-github-dark-bg-tertiary border border-github-dark-border rounded text-github-dark-text font-mono text-sm focus:outline-none focus:border-github-dark-text-link"
            required
          />
          <p className="mt-2 text-xs text-github-dark-text-secondary">
            Required: <code className="bg-github-dark-bg-tertiary px-1 rounded">repository</code>,{' '}
            <code className="bg-github-dark-bg-tertiary px-1 rounded">dateRange</code>, and{' '}
            <code className="bg-github-dark-bg-tertiary px-1 rounded">pullRequests</code> array
          </p>
        </div>

        {error && (
          <div className="p-3 bg-github-dark-danger bg-opacity-10 border border-github-dark-danger rounded text-github-dark-danger text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-github-dark-accent-emphasis text-white rounded hover:bg-opacity-90 transition-colors font-medium"
        >
          Generate Release Notes with AI
        </button>
      </form>
    </div>
  );
};

export default ReleaseNotesInputComponent;

