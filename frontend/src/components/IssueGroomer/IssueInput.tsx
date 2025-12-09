import React, { useState } from 'react';
import { Issue } from '../../types/issue';

interface IssueInputProps {
  onIssueSubmit: (issue: Issue) => void;
}

const EXAMPLE_ISSUE = {
  title: "Bug: saving doesn't work lol",
  body: "sometimes saving breaks when editing big report",
  labels: ["bug"],
  priority: "high",
  assignee: "john-doe",
  status: "open"
};

const IssueInput: React.FC<IssueInputProps> = ({ onIssueSubmit }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const issue = JSON.parse(jsonInput);
      
      if (!issue.title || !issue.body) {
        setError('Issue must have at least a title and body');
        return;
      }

      onIssueSubmit(issue);
    } catch (err) {
      setError('Invalid JSON format. Please check your input.');
    }
  };

  const handleUseExample = () => {
    setJsonInput(JSON.stringify(EXAMPLE_ISSUE, null, 2));
    setError('');
  };

  return (
    <div className="bg-github-dark-bg-secondary border border-github-dark-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-github-dark-text">Issue Input</h2>
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
            Paste Issue JSON
          </label>
          <textarea
            id="jsonInput"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={`{
  "title": "Issue title here",
  "body": "Issue description here",
  "labels": ["bug", "priority"],
  "priority": "high",
  "assignee": "username",
  "status": "open"
}`}
            className="w-full h-64 px-3 py-2 bg-github-dark-bg-tertiary border border-github-dark-border rounded text-github-dark-text font-mono text-sm focus:outline-none focus:border-github-dark-text-link"
            required
          />
          <p className="mt-2 text-xs text-github-dark-text-secondary">
            Required fields: <code className="bg-github-dark-bg-tertiary px-1 rounded">title</code> and{' '}
            <code className="bg-github-dark-bg-tertiary px-1 rounded">body</code>
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
          Improve Issue with AI
        </button>
      </form>
    </div>
  );
};

export default IssueInput;

