import React from 'react';
import { LayoutDashboard, TrendingUp, DollarSign, Zap, Target } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <div className="py-16">
          <LayoutDashboard className="w-16 h-16 mb-4 text-github-dark-text" />
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
                <TrendingUp className="w-5 h-5 mr-3 flex-shrink-0 text-github-dark-text-link" />
                <span>Issue improvement statistics and trends</span>
              </li>
              <li className="flex items-start">
                <DollarSign className="w-5 h-5 mr-3 flex-shrink-0 text-github-dark-text-link" />
                <span>API usage and cost tracking</span>
              </li>
              <li className="flex items-start">
                <Zap className="w-5 h-5 mr-3 flex-shrink-0 text-github-dark-text-link" />
                <span>Performance metrics and response times</span>
              </li>
              <li className="flex items-start">
                <Target className="w-5 h-5 mr-3 flex-shrink-0 text-github-dark-text-link" />
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

