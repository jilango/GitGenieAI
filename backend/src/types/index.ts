export interface Issue {
  title: string;
  body: string;
  labels?: string[];
  priority?: string;
  assignee?: string;
  status?: string;
}

export interface ImproveIssueRequest {
  issue: Issue;
}

export interface RateLimitInfo {
  perMinute: number;
  perHour: number;
}

export interface ImproveIssueResponse {
  improvedIssue: Issue;
  meta?: {
    processingTime: number;
    remaining: RateLimitInfo;
  };
}

export interface ErrorResponse {
  error: string;
  message: string;
  remaining?: RateLimitInfo;
}

