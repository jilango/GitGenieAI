export interface Issue {
  title: string;
  body: string;
  labels?: string[];
  priority?: string;
  assignee?: string;
  status?: string;
}

export interface ImproveIssueResponse {
  improvedIssue: Issue;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

