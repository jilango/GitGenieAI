import { Router, Request, Response } from 'express';
import { OpenAIService } from '../services/openAIService';
import { rateLimiter } from '../services/rateLimiter';
import { ImproveIssueRequest, ImproveIssueResponse, ErrorResponse } from '../types';
import crypto from 'crypto';

const router = Router();

/**
 * Helper function to get identifier for rate limiting
 * Uses API key hash or IP address
 */
function getRateLimitIdentifier(req: Request): string {
  const apiKey = req.headers['x-openai-api-key'] as string;
  
  if (apiKey) {
    // Hash the API key for privacy
    return crypto.createHash('sha256').update(apiKey).digest('hex').substring(0, 16);
  }
  
  // Fallback to IP address
  return req.ip || req.socket.remoteAddress || 'unknown';
}

/**
 * POST /api/issues/improve
 * Improve an issue using AI with full validation and security
 */
router.post('/improve', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const identifier = getRateLimitIdentifier(req);
  
  try {
    // Step 1: Rate limiting check
    try {
      await rateLimiter.checkLimit(identifier);
    } catch (rateLimitError) {
      const remaining = rateLimiter.getRemainingRequests(identifier);
      console.warn(`Rate limit exceeded for ${identifier}`);
      
      return res.status(429).json({
        error: 'Rate Limit Exceeded',
        message: rateLimitError instanceof Error ? rateLimitError.message : 'Too many requests',
        remaining: remaining,
      } as ErrorResponse);
    }

    // Step 2: Validate API key
    const apiKey = req.headers['x-openai-api-key'] as string;
    
    if (!apiKey) {
      return res.status(400).json({
        error: 'Missing API Key',
        message: 'OpenAI API key is required in x-openai-api-key header',
      } as ErrorResponse);
    }

    if (!apiKey.startsWith('sk-')) {
      return res.status(400).json({
        error: 'Invalid API Key',
        message: 'OpenAI API key must start with "sk-"',
      } as ErrorResponse);
    }

    // Step 3: Validate request body
    const { issue } = req.body as ImproveIssueRequest;

    if (!issue || typeof issue !== 'object') {
      return res.status(400).json({
        error: 'Invalid Request',
        message: 'Request body must contain an "issue" object',
      } as ErrorResponse);
    }

    if (!issue.title || !issue.body) {
      return res.status(400).json({
        error: 'Invalid Issue',
        message: 'Issue must have both "title" and "body" fields',
      } as ErrorResponse);
    }

    // Step 4: Create OpenAI service and improve issue
    console.log(`→ Processing issue improvement request from ${identifier}`);
    const openAIService = new OpenAIService(apiKey);
    
    const improvedIssue = await openAIService.improveIssue(issue);

    // Step 5: Return success response
    const duration = Date.now() - startTime;
    const remaining = rateLimiter.getRemainingRequests(identifier);
    
    console.log(`✅ Issue improved successfully in ${duration}ms`);

    return res.json({
      improvedIssue,
      meta: {
        processingTime: duration,
        remaining: remaining,
      },
    } as ImproveIssueResponse);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Error in /improve endpoint (${duration}ms):`, error);

    // Handle specific error types
    if (error instanceof Error) {
      // Validation errors (400)
      if (error.message.includes('too long') || 
          error.message.includes('empty') ||
          error.message.includes('malicious')) {
        return res.status(400).json({
          error: 'Validation Error',
          message: error.message,
        } as ErrorResponse);
      }

      // Content moderation errors (403)
      if (error.message.includes('flagged') || error.message.includes('moderation')) {
        return res.status(403).json({
          error: 'Content Moderation',
          message: 'Content was flagged by our moderation system',
        } as ErrorResponse);
      }

      // OpenAI API errors (502)
      if (error.message.includes('OpenAI') || error.message.includes('API')) {
        return res.status(502).json({
          error: 'AI Service Error',
          message: 'Unable to process request with AI service. Please try again.',
        } as ErrorResponse);
      }
    }

    // Generic error (500)
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred. Please try again.',
    } as ErrorResponse);
  }
});

/**
 * GET /api/issues/rate-limit
 * Get current rate limit status for the caller
 */
router.get('/rate-limit', (req: Request, res: Response) => {
  const identifier = getRateLimitIdentifier(req);
  const remaining = rateLimiter.getRemainingRequests(identifier);
  
  return res.json({
    identifier: identifier.substring(0, 8) + '...',
    remaining: remaining,
    limits: {
      perMinute: 10,
      perHour: 100,
    },
  });
});

export default router;

