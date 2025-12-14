import { Issue } from '../types/issue';
import { parseTemplate, formatDate } from './templateEngine';

/**
 * Export issue as Markdown
 */
export function exportIssueAsMarkdown(issue: Issue, template?: string): string {
  if (template) {
    const data = {
      ...issue,
      labels: issue.labels?.join(', ') || '',
      date: formatDate(),
    };
    return parseTemplate(template, data);
  }

  // Default Markdown format
  const labels = issue.labels && issue.labels.length > 0 
    ? issue.labels.map(l => `\`${l}\``).join(' ') 
    : 'None';
  
  let markdown = `# ${issue.title}\n\n`;
  
  if (issue.priority || issue.assignee || issue.status) {
    markdown += '**Metadata:**\n';
    if (issue.status) markdown += `- Status: ${issue.status}\n`;
    if (issue.priority) markdown += `- Priority: ${issue.priority}\n`;
    if (issue.assignee) markdown += `- Assignee: ${issue.assignee}\n`;
    markdown += '\n';
  }
  
  markdown += `${issue.body}\n\n`;
  markdown += `**Labels:** ${labels}\n`;
  markdown += `\n*Generated: ${formatDate()}*\n`;
  
  return markdown;
}

/**
 * Export issue as HTML
 */
export function exportIssueAsHTML(issue: Issue, template?: string): string {
  if (template) {
    const data = {
      ...issue,
      labels: issue.labels?.join(', ') || '',
      date: formatDate(),
    };
    const content = parseTemplate(template, data);
    // Wrap in basic HTML structure if template doesn't include it
    if (!content.includes('<!DOCTYPE') && !content.includes('<html')) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${issue.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #0d1117;
      color: #c9d1d9;
    }
    h1 { color: #58a6ff; margin-bottom: 10px; }
    p { color: #8b949e; line-height: 1.6; }
    .meta { color: #8b949e; font-size: 0.9em; }
  </style>
</head>
<body>
${content}
</body>
</html>`;
    }
    return content;
  }

  // Default HTML format
  const labels = issue.labels && issue.labels.length > 0 
    ? issue.labels.map(l => `<span style="background: #161b22; padding: 2px 8px; border-radius: 3px; margin-right: 4px;">${l}</span>`).join('')
    : 'None';
  
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${issue.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #0d1117;
      color: #c9d1d9;
    }
    h1 { color: #58a6ff; margin-bottom: 10px; }
    p { color: #8b949e; line-height: 1.6; }
    .meta { color: #8b949e; font-size: 0.9em; }
    .metadata { margin: 20px 0; }
    .metadata-item { margin: 5px 0; }
  </style>
</head>
<body>
  <h1>${issue.title}</h1>
  
  <div class="metadata">
    ${issue.status ? `<div class="metadata-item"><strong>Status:</strong> ${issue.status}</div>` : ''}
    ${issue.priority ? `<div class="metadata-item"><strong>Priority:</strong> ${issue.priority}</div>` : ''}
    ${issue.assignee ? `<div class="metadata-item"><strong>Assignee:</strong> ${issue.assignee}</div>` : ''}
  </div>
  
  <p>${issue.body.replace(/\n/g, '<br>')}</p>
  
  <div class="meta">
    <strong>Labels:</strong> ${labels}<br>
    <em>Generated: ${formatDate()}</em>
  </div>
</body>
</html>`;
  
  return html;
}

/**
 * Export issue as JSON
 */
export function exportIssueAsJSON(issue: Issue): string {
  return JSON.stringify(issue, null, 2);
}

/**
 * Export issue as CSV (single row)
 */
export function exportIssueAsCSV(issue: Issue): string {
  const escapeCSV = (value: string | undefined | null): string => {
    if (!value) return '';
    const str = String(value);
    // Escape quotes and wrap in quotes if contains comma, quote, or newline
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headers = ['Title', 'Body', 'Labels', 'Priority', 'Assignee', 'Status'];
  const labels = issue.labels?.join(', ') || '';
  
  const row = [
    escapeCSV(issue.title),
    escapeCSV(issue.body),
    escapeCSV(labels),
    escapeCSV(issue.priority),
    escapeCSV(issue.assignee),
    escapeCSV(issue.status),
  ];

  return [headers.join(','), row.join(',')].join('\n');
}

/**
 * Format issue for clipboard (plain text)
 */
export function formatIssueForClipboard(issue: Issue): string {
  const labels = issue.labels && issue.labels.length > 0 
    ? issue.labels.join(', ')
    : 'None';
  
  let text = `${issue.title}\n\n`;
  
  if (issue.status || issue.priority || issue.assignee) {
    text += 'Metadata:\n';
    if (issue.status) text += `  Status: ${issue.status}\n`;
    if (issue.priority) text += `  Priority: ${issue.priority}\n`;
    if (issue.assignee) text += `  Assignee: ${issue.assignee}\n`;
    text += '\n';
  }
  
  text += `${issue.body}\n\n`;
  text += `Labels: ${labels}\n`;
  text += `Generated: ${formatDate()}\n`;
  
  return text;
}

