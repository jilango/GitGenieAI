import React, { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  available: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const navItems: NavItem[] = [
    { id: 'issue-groomer', label: 'Issue Groomer', icon: '🔧', available: true },
    { id: 'release-notes', label: 'Release Notes', icon: '📝', available: false },
    { id: 'dashboard', label: 'Dashboard', icon: '📊', available: false },
    { id: 'analytics', label: 'Analytics', icon: '📈', available: false },
    { id: 'settings', label: 'Settings', icon: '⚙️', available: false },
  ];

  return (
    <div
      className={`${
        isExpanded ? 'w-64' : 'w-16'
      } bg-github-dark-bg-secondary border-r border-github-dark-border transition-all duration-300 flex flex-col h-screen sticky top-0`}
    >
      {/* Header */}
      <div className="p-4 border-b border-github-dark-border flex items-center justify-between">
        {isExpanded && (
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🧞</span>
            <h1 className="text-xl font-bold text-github-dark-text">GitGenie AI</h1>
          </div>
        )}
        {!isExpanded && <span className="text-2xl mx-auto">🧞</span>}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-github-dark-text-secondary hover:text-github-dark-text transition-colors"
          title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isExpanded ? '◀' : '▶'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => item.available && onNavigate(item.id)}
                disabled={!item.available}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-github-dark-accent-emphasis text-white'
                    : item.available
                    ? 'text-github-dark-text hover:bg-github-dark-bg-tertiary'
                    : 'text-github-dark-text-secondary cursor-not-allowed opacity-50'
                }`}
                title={!item.available ? 'Coming soon' : item.label}
              >
                <span className="text-xl">{item.icon}</span>
                {isExpanded && (
                  <div className="flex-1 text-left">
                    <span className="font-medium">{item.label}</span>
                    {!item.available && (
                      <span className="ml-2 text-xs bg-github-dark-bg-tertiary px-1.5 py-0.5 rounded">
                        Soon
                      </span>
                    )}
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-github-dark-border">
        {isExpanded ? (
          <div className="text-xs text-github-dark-text-secondary">
            <p className="font-semibold text-github-dark-text mb-1">Phase 1: MVP</p>
            <p>Issue Groomer Active</p>
          </div>
        ) : (
          <div className="text-center text-xs text-github-dark-text-secondary">v1.0</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

