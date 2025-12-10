export interface PullRequest {
  number: number;
  title: string;
  body: string;
  labels?: string[];
  mergedAt: string;
  author: string;
  linkedIssues?: number[];
}

export interface LinkedIssue {
  number: number;
  title: string;
  labels?: string[];
}

export interface ReleaseNotesInput {
  repository: string;
  dateRange: {
    from: string;
    to: string;
  };
  branch?: string;
  pullRequests: PullRequest[];
  linkedIssues?: LinkedIssue[];
}

export interface ReleaseNoteItem {
  title: string;
  description: string;
  prNumber?: number;
  issueNumbers?: number[];
  impact?: 'critical' | 'high' | 'medium' | 'low';
  internal?: boolean;
}

export interface CategorizedReleaseNotes {
  features: ReleaseNoteItem[];
  bugFixes: ReleaseNoteItem[];
  security: ReleaseNoteItem[];
  performance: ReleaseNoteItem[];
  maintenance: ReleaseNoteItem[];
}

export interface GenerateReleaseNotesResponse {
  releaseNotes: CategorizedReleaseNotes;
  summary: {
    totalChanges: number;
    newFeatures: number;
    bugFixes: number;
    securityUpdates: number;
    performanceImprovements: number;
    maintenanceUpdates: number;
  };
  meta?: {
    processingTime: number;
    remaining: {
      perMinute: number;
      perHour: number;
    };
  };
}

