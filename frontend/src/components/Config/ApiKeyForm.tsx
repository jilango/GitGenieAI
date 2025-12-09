import React, { useState } from 'react';

interface ApiKeyFormProps {
  onApiKeySet: (apiKey: string) => void;
  currentApiKey: string;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onApiKeySet, currentApiKey }) => {
  const [apiKey, setApiKey] = useState('');
  const [isExpanded, setIsExpanded] = useState(!currentApiKey);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
      setApiKey(''); // Clear input after setting
      setIsExpanded(false);
    }
  };

  const handleClear = () => {
    setApiKey('');
    onApiKeySet('');
    setIsExpanded(true);
  };

  return (
    <div className="bg-github-dark-bg-secondary border border-github-dark-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-github-dark-text">OpenAI Configuration</h3>
        {currentApiKey && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-github-dark-text-link hover:underline"
          >
            {isExpanded ? 'Hide' : 'Change Key'}
          </button>
        )}
      </div>

      {isExpanded ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="apiKey" className="block text-sm text-github-dark-text-secondary mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 bg-github-dark-bg-tertiary border border-github-dark-border rounded text-github-dark-text focus:outline-none focus:border-github-dark-text-link"
              required
            />
            <p className="mt-1 text-xs text-github-dark-text-secondary">
              🔒 Your API key is kept in memory only and never stored. You'll need to re-enter it each session.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-github-dark-success text-white rounded hover:bg-opacity-90 transition-colors"
            >
              Use API Key
            </button>
            {currentApiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 bg-github-dark-danger text-white rounded hover:bg-opacity-90 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      ) : (
        <p className="text-sm text-github-dark-text-secondary">
          ✓ API key configured (click Change Key to update)
        </p>
      )}
    </div>
  );
};

export default ApiKeyForm;

