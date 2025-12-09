import { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import IssueGrooming from './pages/IssueGrooming';
import ReleaseNotes from './pages/ReleaseNotes';
import Dashboard from './pages/Dashboard';
import ComingSoon from './pages/ComingSoon';

function App() {
  const [currentPage, setCurrentPage] = useState('issue-groomer');
  const [apiKey, setApiKey] = useState('');

  const renderPage = () => {
    switch (currentPage) {
      case 'issue-groomer':
        return <IssueGrooming apiKey={apiKey} />;
      case 'release-notes':
        return <ReleaseNotes />;
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <ComingSoon title="Analytics" icon="📈" description="Coming soon" />;
      case 'settings':
        return <ComingSoon title="Settings" icon="⚙️" description="Coming soon" />;
      default:
        return <IssueGrooming apiKey={apiKey} />;
    }
  };

  return (
    <div className="flex h-screen bg-github-dark-bg overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header apiKey={apiKey} onApiKeySet={setApiKey} />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;

