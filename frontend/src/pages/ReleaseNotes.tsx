import React from 'react';

const ReleaseNotes: React.FC = () => {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <span className="text-6xl mb-4 block">📝</span>
          <h1 className="text-3xl font-bold text-github-dark-text mb-4">
            Release Notes Generator
          </h1>
          <p className="text-lg text-github-dark-text-secondary mb-8">
            Coming soon in Phase 2
          </p>
          
          <div className="bg-github-dark-bg-secondary border border-github-dark-border rounded-lg p-8 text-left">
            <h2 className="text-xl font-semibold text-github-dark-text mb-4">
              Planned Features:
            </h2>
            <ul className="space-y-3 text-github-dark-text-secondary">
              <li className="flex items-start">
                <span className="mr-3">✅</span>
                <span>Automatic release notes generation from merged PRs and issues</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">✅</span>
                <span>Categorized output: Features, Bug Fixes, Improvements, Security</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">✅</span>
                <span>Inline editing and refinement of generated notes</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">✅</span>
                <span>Export to Markdown, HTML, or push directly to CHANGELOG.md</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">✅</span>
                <span>Date range and branch filtering</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReleaseNotes;

