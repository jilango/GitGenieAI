import axios from 'axios';
import { Issue, ImproveIssueResponse } from '../types/issue';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const improveIssue = async (issue: Issue, apiKey: string): Promise<Issue> => {
  const response = await api.post<ImproveIssueResponse>(
    '/issues/improve',
    { issue },
    {
      headers: {
        'x-openai-api-key': apiKey,
      },
    }
  );
  return response.data.improvedIssue;
};

export default api;

