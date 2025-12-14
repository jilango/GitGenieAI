/**
 * Simple template engine for variable substitution
 * Supports {{variable}} syntax with nested properties
 */

export type ExportType = 'issue' | 'release-notes';

/**
 * Get available variables for a given export type
 */
export function getAvailableVariables(type: ExportType): string[] {
  if (type === 'issue') {
    return ['title', 'body', 'labels', 'priority', 'assignee', 'status', 'date'];
  } else {
    return ['version', 'date', 'features', 'bugFixes', 'security', 'performance', 'maintenance'];
  }
}

/**
 * Parse template and replace variables with data
 * Supports {{variable}} syntax
 */
export function parseTemplate(template: string, data: Record<string, any>): string {
  // Find all {{variable}} patterns
  const variablePattern = /\{\{(\w+(?:\.\w+)*)\}\}/g;
  
  return template.replace(variablePattern, (match, variablePath) => {
    // Handle nested properties (e.g., issue.title)
    const parts = variablePath.split('.');
    let value: any = data;
    
    for (const part of parts) {
      if (value === null || value === undefined) {
        return ''; // Return empty string if path doesn't exist
      }
      value = value[part];
    }
    
    // Convert value to string, handle arrays and objects
    if (value === null || value === undefined) {
      return ''; // Missing variable returns empty string
    }
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return String(value);
  });
}

/**
 * Format date for templates
 */
export function formatDate(date?: Date): string {
  const d = date || new Date();
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

