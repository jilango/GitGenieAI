import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <span className="text-6xl mb-4 block">📊</span>
          <h1 className="text-3xl font-bold text-github-dark-text mb-4">
            Dashboard
          </h1>
          <p className="text-lg text-github-dark-text-secondary mb-8">
            Coming soon - Your AI-powered insights
          </p>
          
          <div className="bg-github-dark-bg-secondary border border-github-dark-border rounded-lg p-8 text-left">
            <h2 className="text-xl font-semibold text-github-dark-text mb-4">
              Future Dashboard Features:
            </h2>
            <ul className="space-y-3 text-github-dark-text-secondary">
              <li className="flex items-start">
                <span className="mr-3">📈</span>
                <span>Issue improvement statistics and trends</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">💰</span>
                <span>API usage and cost tracking</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">⚡</span>
                <span>Performance metrics and response times</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">🎯</span>
                <span>Quality scores and improvement rates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

