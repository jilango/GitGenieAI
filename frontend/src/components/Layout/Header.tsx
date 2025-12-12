import React, { useState, useRef, useEffect } from 'react';
import { Key, Lock, Cpu } from 'lucide-react';
import { OpenAIModel, AVAILABLE_MODELS } from '../../types/models';

interface HeaderProps {
  apiKey: string;
  onApiKeySet: (apiKey: string) => void;
  selectedModel: OpenAIModel;
  onModelChange: (model: OpenAIModel) => void;
}

const Header: React.FC<HeaderProps> = ({ apiKey, onApiKeySet, selectedModel, onModelChange }) => {
  const [isApiKeyDropdownOpen, setIsApiKeyDropdownOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [inputApiKey, setInputApiKey] = useState('');
  const apiKeyDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (apiKeyDropdownRef.current && !apiKeyDropdownRef.current.contains(event.target as Node)) {
        setIsApiKeyDropdownOpen(false);
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
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
      setIsApiKeyDropdownOpen(false);
    }
  };

  const handleModelSelect = (model: OpenAIModel) => {
    onModelChange(model);
    setIsModelDropdownOpen(false);
  };

  const getCostTierColor = (tier: 'high' | 'medium' | 'low') => {
    switch (tier) {
      case 'high':
        return 'bg-orange-500 bg-opacity-20 text-orange-400 border-orange-500';
      case 'medium':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-400 border-yellow-500';
      case 'low':
        return 'bg-green-500 bg-opacity-20 text-green-400 border-green-500';
    }
  };

  const selectedModelOption = AVAILABLE_MODELS.find(m => m.value === selectedModel);

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

        {/* Right side - Model selector and API Key dropdown */}
        <div className="flex items-center space-x-3">
          {/* Model Selector */}
          <div className="relative" ref={modelDropdownRef}>
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border bg-github-dark-bg-tertiary border-github-dark-border text-github-dark-text hover:border-github-dark-text-link transition-colors"
            >
              <Cpu className="w-4 h-4" />
              <span className="text-sm font-medium">
                {selectedModelOption?.label.split(' ')[0] || 'Model'}
              </span>
              <span className="text-xs">{isModelDropdownOpen ? '▲' : '▼'}</span>
            </button>

            {/* Model Dropdown Menu */}
            {isModelDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-github-dark-bg-secondary border border-github-dark-border rounded-lg shadow-xl p-3 z-50">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-github-dark-text flex items-center">
                    <Cpu className="w-5 h-5 mr-2" />
                    AI Model
                  </h3>
                  <p className="text-xs text-github-dark-text-secondary mt-1">
                    Choose the model for AI operations
                  </p>
                </div>

                <div className="space-y-2">
                  {AVAILABLE_MODELS.map((model) => (
                    <button
                      key={model.value}
                      onClick={() => handleModelSelect(model.value)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedModel === model.value
                          ? 'bg-github-dark-accent-emphasis bg-opacity-10 border-github-dark-accent-emphasis'
                          : 'bg-github-dark-bg-primary border-github-dark-border hover:border-github-dark-text-link'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-github-dark-text text-sm">
                              {model.label}
                            </span>
                            {selectedModel === model.value && (
                              <span className="text-xs text-github-dark-accent-emphasis">✓</span>
                            )}
                          </div>
                          <p className="text-xs text-github-dark-text-secondary">
                            {model.description}
                          </p>
                        </div>
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded border ${getCostTierColor(model.costTier)}`}>
                          {model.costTier}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* API Key Dropdown */}
          <div className="relative" ref={apiKeyDropdownRef}>
            <button
              onClick={() => setIsApiKeyDropdownOpen(!isApiKeyDropdownOpen)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                apiKey
                  ? 'bg-github-dark-success bg-opacity-10 border-github-dark-success text-github-dark-success'
                  : 'bg-github-dark-bg-tertiary border-github-dark-border text-github-dark-text hover:border-github-dark-text-link'
              }`}
            >
              <Key className="w-4 h-4" />
              <span className="text-sm font-medium">
                {apiKey ? 'API Key Set' : 'Configure API Key'}
              </span>
              <span className="text-xs">{isApiKeyDropdownOpen ? '▲' : '▼'}</span>
            </button>

            {/* API Key Dropdown Menu */}
            {isApiKeyDropdownOpen && (
            <div className="absolute right-0 mt-2 w-96 bg-github-dark-bg-secondary border border-github-dark-border rounded-lg shadow-xl p-4 z-50">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-github-dark-text flex items-center">
                  <Key className="w-5 h-5 mr-2" />
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
                  <Lock className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
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
      </div>
    </header>
  );
};

export default Header;

