import React from 'react';

interface ComingSoonProps {
  title: string;
  icon: string;
  description: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, icon, description }) => {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <span className="text-6xl mb-4 block">{icon}</span>
          <h1 className="text-3xl font-bold text-github-dark-text mb-4">
            {title}
          </h1>
          <p className="text-lg text-github-dark-text-secondary mb-8">
            {description}
          </p>
          
          <div className="bg-github-dark-bg-secondary border border-github-dark-border rounded-lg p-8">
            <p className="text-github-dark-text-secondary">
              This feature is planned for a future release. Stay tuned!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;

