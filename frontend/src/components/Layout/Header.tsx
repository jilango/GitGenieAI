import React, { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  apiKey: string;
  onApiKeySet: (apiKey: string) => void;
}

const Header: React.FC<HeaderProps> = ({ apiKey, onApiKeySet }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inputApiKey, setInputApiKey] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputApiKey.trim()) {
      onApiKeySet(inputApiKey.trim());
      setInputApiKey('');
      setIsDropdownOpen(false);
    }
  };

  const handleClear = () => {
    onApiKeySet('');
    setInputApiKey('');
  };

  return (
    <header className="bg-github-dark-bg-secondary border-b border-github-dark-border sticky top-0 z-10">
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Left side - Page title will be injected by child components */}
        <div className="flex-1">
          {/* Placeholder for breadcrumbs or page title */}
        </div>

        {/* Right side - API Key dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              apiKey
                ? 'bg-github-dark-success bg-opacity-10 border-github-dark-success text-github-dark-success'
                : 'bg-github-dark-bg-tertiary border-github-dark-border text-github-dark-text hover:border-github-dark-text-link'
            }`}
          >
            <span className="text-lg">🔑</span>
            <span className="text-sm font-medium">
              {apiKey ? 'API Key Set' : 'Configure API Key'}
            </span>
            <span className="text-xs">{isDropdownOpen ? '▲' : '▼'}</span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-96 bg-github-dark-bg-secondary border border-github-dark-border rounded-lg shadow-xl p-4 z-50">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-github-dark-text flex items-center">
                  <span className="mr-2">🔑</span>
                  OpenAI API Key
                </h3>
                <p className="text-xs text-github-dark-text-secondary mt-1">
                  Your key is stored in memory only and never persisted
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <input
                    type="password"
                    value={inputApiKey}
                    onChange={(e) => setInputApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-3 py-2 bg-github-dark-bg-tertiary border border-github-dark-border rounded text-github-dark-text text-sm focus:outline-none focus:border-github-dark-text-link"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-github-dark-success text-white rounded text-sm font-medium hover:bg-opacity-90 transition-colors"
                  >
                    {apiKey ? 'Update Key' : 'Set Key'}
                  </button>
                  {apiKey && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="px-4 py-2 bg-github-dark-danger text-white rounded text-sm font-medium hover:bg-opacity-90 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-3 pt-3 border-t border-github-dark-border">
                <p className="text-xs text-github-dark-text-secondary flex items-start">
                  <span className="mr-1">🔒</span>
                  <span>
                    Security: API keys are kept in memory only and cleared on page reload.
                    Get your key from{' '}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-github-dark-text-link hover:underline"
                    >
                      OpenAI
                    </a>
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

