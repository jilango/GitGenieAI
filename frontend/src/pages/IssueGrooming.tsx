import React, { useState } from 'react';
import { Wrench } from 'lucide-react';
import { Issue } from '../types/issue';
import { improveIssue } from '../services/api';
import IssueInput from '../components/IssueGroomer/IssueInput';
import IssueComparison from '../components/IssueGroomer/IssueComparison';
import { OpenAIModel } from '../types/models';

interface IssueGroomingProps {
  apiKey: string;
  selectedModel: OpenAIModel;
}

const IssueGrooming: React.FC<IssueGroomingProps> = ({ apiKey, selectedModel }) => {
  const [originalIssue, setOriginalIssue] = useState<Issue | null>(null);
  const [improvedIssue, setImprovedIssue] = useState<Issue | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleImproveIssue = async (issue: Issue) => {
    if (!apiKey) {
      setError('Please configure your OpenAI API key first');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    setOriginalIssue(issue);

    try {
      const improved = await improveIssue(issue, apiKey, selectedModel);
      setImprovedIssue(improved);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to improve issue');
      setImprovedIssue(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (originalIssue) {
      await handleImproveIssue(originalIssue);
    }
  };

  const handleAccept = () => {
    setSuccessMessage('✓ Issue accepted! In a production environment, this would update the issue in GitHub/Jira.');
    setTimeout(() => {
      setSuccessMessage('');
      setOriginalIssue(null);
      setImprovedIssue(null);
    }, 3000);
  };

  const handleReject = () => {
    setOriginalIssue(null);
    setImprovedIssue(null);
    setSuccessMessage('');
    setError('');
  };

  const handleEdit = (editedIssue: Issue) => {
    setImprovedIssue(editedIssue);
  };

  return (
    <div className="p-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-github-dark-text mb-2 flex items-center">
          <Wrench className="w-8 h-8 mr-3 text-github-dark-text-link" /> Issue Groomer
        </h1>
        <p className="text-github-dark-text-secondary">
          Improve your issues with AI-powered suggestions
        </p>
      </header>

        {error && (
          <div className="mb-6 p-4 bg-github-dark-danger bg-opacity-10 border border-github-dark-danger rounded-lg text-github-dark-danger">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-github-dark-success bg-opacity-10 border border-github-dark-success rounded-lg text-green-400">
            {successMessage}
          </div>
        )}

        {!originalIssue || !improvedIssue ? (
          <div className="max-w-3xl">
            <IssueInput onIssueSubmit={handleImproveIssue} />
            {isLoading && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-github-dark-text-link"></div>
                <p className="mt-4 text-github-dark-text-secondary">
                  Improving issue with AI... This may take a few moments.
                </p>
              </div>
            )}
          </div>
        ) : (
          <IssueComparison
            originalIssue={originalIssue}
            improvedIssue={improvedIssue}
            onAccept={handleAccept}
            onReject={handleReject}
            onRegenerate={handleRegenerate}
            onEdit={handleEdit}
            isLoading={isLoading}
          />
        )}
    </div>
  );
};

export default IssueGrooming;

