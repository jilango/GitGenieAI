import axios from 'axios';
import { Issue, ImproveIssueResponse } from '../types/issue';
import { ReleaseNotesInput, GenerateReleaseNotesResponse } from '../types/releaseNotes';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const improveIssue = async (issue: Issue, apiKey: string, model?: string): Promise<Issue> => {
  const headers: Record<string, string> = {
    'x-openai-api-key': apiKey,
  };
  
  if (model) {
    headers['x-openai-model'] = model;
  }
  
  const response = await api.post<ImproveIssueResponse>(
    '/issues/improve',
    { issue },
    { headers }
  );
  return response.data.improvedIssue;
};

export const generateReleaseNotes = async (
  input: ReleaseNotesInput,
  apiKey: string,
  model?: string
): Promise<GenerateReleaseNotesResponse> => {
  const headers: Record<string, string> = {
    'x-openai-api-key': apiKey,
  };
  
  if (model) {
    headers['x-openai-model'] = model;
  }
  
  const response = await api.post<GenerateReleaseNotesResponse>(
    '/release-notes/generate',
    { input },
    { headers }
  );
  return response.data;
};

export default api;

