import { CategorizedReleaseNotes, ReleaseNoteItem } from '../types/releaseNotes';
import { parseTemplate, formatDate } from './templateEngine';

interface CategoryInfo {
  key: keyof CategorizedReleaseNotes;
  label: string;
  emoji: string;
}

const categories: CategoryInfo[] = [
  { key: 'features', label: 'New Features', emoji: '🚀' },
  { key: 'bugFixes', label: 'Bug Fixes', emoji: '🐛' },
  { key: 'security', label: 'Security Updates', emoji: '🔒' },
  { key: 'performance', label: 'Performance Improvements', emoji: '⚡' },
  { key: 'maintenance', label: 'Maintenance', emoji: '🛠️' },
];

/**
 * Format a single release note item
 */
function formatItem(item: ReleaseNoteItem): { markdown: string; html: string } {
  const refs: string[] = [];
  if (item.prNumber) refs.push(`PR #${item.prNumber}`);
  if (item.issueNumbers && item.issueNumbers.length > 0) {
    refs.push(`Issue${item.issueNumbers.length > 1 ? 's' : ''}: #${item.issueNumbers.join(', #')}`);
  }
  const refText = refs.length > 0 ? ` (${refs.join(' | ')})` : '';
  
  const markdown = `### ${item.title}\n${item.description}${refText}\n`;
  const html = `<div class="release-note-item">
  <h3>${item.title}</h3>
  <p>${item.description}${refText}</p>
</div>`;

  return { markdown, html };
}

/**
 * Export release notes as Markdown
 */
export function exportAsMarkdown(releaseNotes: CategorizedReleaseNotes, version?: string, template?: string): string {
  if (template) {
    const data = {
      version: version || '',
      date: formatDate(),
      features: formatCategoryForTemplate(releaseNotes.features),
      bugFixes: formatCategoryForTemplate(releaseNotes.bugFixes),
      security: formatCategoryForTemplate(releaseNotes.security),
      performance: formatCategoryForTemplate(releaseNotes.performance),
      maintenance: formatCategoryForTemplate(releaseNotes.maintenance),
    };
    return parseTemplate(template, data);
  }

  const date = formatDate();
  
  let markdown = `# Release Notes${version ? ` - ${version}` : ''}\n\n`;
  markdown += `*Generated: ${date}*\n\n`;
  markdown += `---\n\n`;

  for (const category of categories) {
    const items = releaseNotes[category.key];
    if (items && items.length > 0) {
      markdown += `## ${category.emoji} ${category.label}\n\n`;
      
      for (const item of items) {
        const formatted = formatItem(item);
        markdown += formatted.markdown + '\n';
      }
      
      markdown += '\n';
    }
  }

  return markdown;
}

/**
 * Format category items for template use
 */
function formatCategoryForTemplate(items: ReleaseNoteItem[]): string {
  if (!items || items.length === 0) return '';
  
  return items.map(item => {
    const refs: string[] = [];
    if (item.prNumber) refs.push(`PR #${item.prNumber}`);
    if (item.issueNumbers && item.issueNumbers.length > 0) {
      refs.push(`Issue${item.issueNumbers.length > 1 ? 's' : ''}: #${item.issueNumbers.join(', #')}`);
    }
    const refText = refs.length > 0 ? ` (${refs.join(' | ')})` : '';
    return `- ${item.title}: ${item.description}${refText}`;
  }).join('\n');
}

/**
 * Export release notes as HTML
 */
export function exportAsHTML(releaseNotes: CategorizedReleaseNotes, version?: string, template?: string): string {
  if (template) {
    const data = {
      version: version || '',
      date: formatDate(),
      features: formatCategoryForTemplate(releaseNotes.features),
      bugFixes: formatCategoryForTemplate(releaseNotes.bugFixes),
      security: formatCategoryForTemplate(releaseNotes.security),
      performance: formatCategoryForTemplate(releaseNotes.performance),
      maintenance: formatCategoryForTemplate(releaseNotes.maintenance),
    };
    const content = parseTemplate(template, data);
    // Wrap in basic HTML structure if template doesn't include it
    if (!content.includes('<!DOCTYPE') && !content.includes('<html')) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Release Notes${version ? ` - ${version}` : ''}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #0d1117;
      color: #c9d1d9;
    }
  </style>
</head>
<body>
${content}
</body>
</html>`;
    }
    return content;
  }

  const date = formatDate();
  
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Release Notes${version ? ` - ${version}` : ''}</title>
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
    h2 { color: #c9d1d9; margin-top: 40px; border-bottom: 1px solid #30363d; padding-bottom: 10px; }
    h3 { color: #c9d1d9; margin-top: 20px; font-size: 1.1em; }
    p { color: #8b949e; line-height: 1.6; }
    .release-note-item { margin-bottom: 30px; padding: 15px; background: #161b22; border: 1px solid #30363d; border-radius: 6px; }
    .meta { color: #8b949e; font-size: 0.9em; font-style: italic; }
  </style>
</head>
<body>
  <h1>Release Notes${version ? ` - ${version}` : ''}</h1>
  <p class="meta">Generated: ${date}</p>
  <hr style="border-color: #30363d; margin: 30px 0;">
`;

  for (const category of categories) {
    const items = releaseNotes[category.key];
    if (items && items.length > 0) {
      html += `  <h2>${category.emoji} ${category.label}</h2>\n`;
      
      for (const item of items) {
        const formatted = formatItem(item);
        html += `  ${formatted.html}\n`;
      }
    }
  }

  html += `</body>
</html>`;

  return html;
}

/**
 * Export release notes as JSON
 */
export function exportAsJSON(releaseNotes: CategorizedReleaseNotes): string {
  return JSON.stringify(releaseNotes, null, 2);
}

/**
 * Copy release notes to clipboard (plain text format)
 */
export function formatForClipboard(releaseNotes: CategorizedReleaseNotes): string {
  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  let text = `RELEASE NOTES - ${date}\n\n`;

  for (const category of categories) {
    const items = releaseNotes[category.key];
    if (items && items.length > 0) {
      text += `${category.emoji} ${category.label.toUpperCase()}\n`;
      
      for (const item of items) {
        const refs: string[] = [];
        if (item.prNumber) refs.push(`PR #${item.prNumber}`);
        if (item.issueNumbers && item.issueNumbers.length > 0) {
          refs.push(`#${item.issueNumbers.join(', #')}`);
        }
        const refText = refs.length > 0 ? ` [${refs.join(' | ')}]` : '';
        
        text += `  • ${item.title}\n`;
        text += `    ${item.description}${refText}\n`;
      }
      
      text += '\n';
    }
  }

  return text;
}

/**
 * Export release notes as CSV
 */
export function exportAsCSV(releaseNotes: CategorizedReleaseNotes): string {
  const escapeCSV = (value: string | undefined | null): string => {
    if (!value) return '';
    const str = String(value);
    // Escape quotes and wrap in quotes if contains comma, quote, or newline
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headers = ['Category', 'Title', 'Description', 'PR Number', 'Issue Numbers', 'Impact'];
  const rows: string[] = [headers.join(',')];

  for (const category of categories) {
    const items = releaseNotes[category.key];
    if (items && items.length > 0) {
      for (const item of items) {
        const issueNumbers = item.issueNumbers && item.issueNumbers.length > 0
          ? item.issueNumbers.join(', ')
          : '';
        
        const row = [
          escapeCSV(category.label),
          escapeCSV(item.title),
          escapeCSV(item.description),
          escapeCSV(item.prNumber?.toString()),
          escapeCSV(issueNumbers),
          escapeCSV(item.impact),
        ];
        rows.push(row.join(','));
      }
    }
  }

  return rows.join('\n');
}

