/**
 * Shared export utilities for downloading files and copying to clipboard
 */

export const MIME_TYPES = {
  markdown: 'text/markdown',
  html: 'text/html',
  json: 'application/json',
  csv: 'text/csv',
  plain: 'text/plain',
} as const;

/**
 * Download a file with the given content
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard with error handling
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    throw new Error('Failed to copy to clipboard. Please check browser permissions.');
  }
}

/**
 * Format a filename with date and extension
 */
export function formatFilename(baseName: string, extension: string, date?: Date): string {
  const dateStr = (date || new Date()).toISOString().split('T')[0];
  return `${baseName}-${dateStr}.${extension}`;
}

