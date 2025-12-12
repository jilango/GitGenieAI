import { useState, useEffect } from 'react';
import { TrendingUp, Settings } from 'lucide-react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import IssueGrooming from './pages/IssueGrooming';
import ReleaseNotes from './pages/ReleaseNotes';
import Dashboard from './pages/Dashboard';
import ComingSoon from './pages/ComingSoon';
import { OpenAIModel, DEFAULT_MODEL, AVAILABLE_MODELS } from './types/models';

function App() {
  const [currentPage, setCurrentPage] = useState('issue-groomer');
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState<OpenAIModel>(DEFAULT_MODEL);

  // Load model from localStorage on mount
  useEffect(() => {
    const savedModel = localStorage.getItem('gitgenie-model');
    if (savedModel && AVAILABLE_MODELS.find(m => m.value === savedModel)) {
      setSelectedModel(savedModel as OpenAIModel);
    }
  }, []);

  // Save model to localStorage when it changes
  const handleModelChange = (model: OpenAIModel) => {
    setSelectedModel(model);
    localStorage.setItem('gitgenie-model', model);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'issue-groomer':
        return <IssueGrooming apiKey={apiKey} selectedModel={selectedModel} />;
      case 'release-notes':
        return <ReleaseNotes apiKey={apiKey} selectedModel={selectedModel} />;
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <ComingSoon title="Analytics" icon={TrendingUp} description="Coming soon" />;
      case 'settings':
        return <ComingSoon title="Settings" icon={Settings} description="Coming soon" />;
      default:
        return <IssueGrooming apiKey={apiKey} selectedModel={selectedModel} />;
    }
  };

  return (
    <div className="flex h-screen bg-github-dark-bg overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          apiKey={apiKey} 
          onApiKeySet={setApiKey}
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
        />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;

