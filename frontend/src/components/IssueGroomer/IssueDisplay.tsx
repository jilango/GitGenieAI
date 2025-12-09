import React from 'react';
import { Issue } from '../../types/issue';

interface IssueDisplayProps {
  issue: Issue;
  title: string;
  editable?: boolean;
  onEdit?: (issue: Issue) => void;
}

const IssueDisplay: React.FC<IssueDisplayProps> = ({ issue, title, editable = false, onEdit }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedIssue, setEditedIssue] = React.useState(issue);

  React.useEffect(() => {
    setEditedIssue(issue);
  }, [issue]);

  const handleSave = () => {
    if (onEdit) {
      onEdit(editedIssue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedIssue(issue);
    setIsEditing(false);
  };

  return (
    <div className="bg-github-dark-bg-tertiary border border-github-dark-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-github-dark-text">{title}</h3>
        {editable && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-github-dark-text-link hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-github-dark-text-secondary mb-1">Title</label>
            <input
              type="text"
              value={editedIssue.title}
              onChange={(e) => setEditedIssue({ ...editedIssue, title: e.target.value })}
              className="w-full px-3 py-2 bg-github-dark-bg border border-github-dark-border rounded text-github-dark-text focus:outline-none focus:border-github-dark-text-link"
            />
          </div>
          <div>
            <label className="block text-sm text-github-dark-text-secondary mb-1">Body</label>
            <textarea
              value={editedIssue.body}
              onChange={(e) => setEditedIssue({ ...editedIssue, body: e.target.value })}
              rows={10}
              className="w-full px-3 py-2 bg-github-dark-bg border border-github-dark-border rounded text-github-dark-text font-mono text-sm focus:outline-none focus:border-github-dark-text-link"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-github-dark-text-secondary mb-1">Priority</label>
              <input
                type="text"
                value={editedIssue.priority || ''}
                onChange={(e) => setEditedIssue({ ...editedIssue, priority: e.target.value })}
                className="w-full px-3 py-2 bg-github-dark-bg border border-github-dark-border rounded text-github-dark-text focus:outline-none focus:border-github-dark-text-link"
              />
            </div>
            <div>
              <label className="block text-sm text-github-dark-text-secondary mb-1">Status</label>
              <input
                type="text"
                value={editedIssue.status || ''}
                onChange={(e) => setEditedIssue({ ...editedIssue, status: e.target.value })}
                className="w-full px-3 py-2 bg-github-dark-bg border border-github-dark-border rounded text-github-dark-text focus:outline-none focus:border-github-dark-text-link"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-github-dark-text-secondary mb-1">
              Labels (comma-separated)
            </label>
            <input
              type="text"
              value={editedIssue.labels?.join(', ') || ''}
              onChange={(e) =>
                setEditedIssue({
                  ...editedIssue,
                  labels: e.target.value.split(',').map((l) => l.trim()).filter(Boolean),
                })
              }
              className="w-full px-3 py-2 bg-github-dark-bg border border-github-dark-border rounded text-github-dark-text focus:outline-none focus:border-github-dark-text-link"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-github-dark-success text-white rounded hover:bg-opacity-90 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-github-dark-bg-tertiary border border-github-dark-border rounded text-github-dark-text hover:border-github-dark-text-link transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-medium text-github-dark-text mb-2">{issue.title}</h4>
          </div>
          <div>
            <p className="text-sm text-github-dark-text-secondary mb-1">Description:</p>
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-github-dark-text bg-github-dark-bg p-3 rounded border border-github-dark-border">
                {issue.body}
              </pre>
            </div>
          </div>
          {issue.labels && issue.labels.length > 0 && (
            <div>
              <p className="text-sm text-github-dark-text-secondary mb-2">Labels:</p>
              <div className="flex flex-wrap gap-2">
                {issue.labels.map((label, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-github-dark-accent-muted text-github-dark-text-link rounded text-xs"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {issue.priority && (
              <div>
                <span className="text-github-dark-text-secondary">Priority: </span>
                <span className="text-github-dark-text">{issue.priority}</span>
              </div>
            )}
            {issue.status && (
              <div>
                <span className="text-github-dark-text-secondary">Status: </span>
                <span className="text-github-dark-text">{issue.status}</span>
              </div>
            )}
            {issue.assignee && (
              <div>
                <span className="text-github-dark-text-secondary">Assignee: </span>
                <span className="text-github-dark-text">{issue.assignee}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueDisplay;

