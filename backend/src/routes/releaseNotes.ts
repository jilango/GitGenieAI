import { Router, Request, Response } from 'express';
import { OpenAIService } from '../services/openAIService';
import { rateLimiter } from '../services/rateLimiter';
import { GenerateReleaseNotesRequest, GenerateReleaseNotesResponse, ErrorResponse } from '../types';
import crypto from 'crypto';

const router = Router();

/**
 * Helper function to get identifier for rate limiting
 */
function getRateLimitIdentifier(req: Request): string {
  const apiKey = req.headers['x-openai-api-key'] as string;
  
  if (apiKey) {
    return crypto.createHash('sha256').update(apiKey).digest('hex').substring(0, 16);
  }
  
  return req.ip || req.socket.remoteAddress || 'unknown';
}

/**
 * POST /api/release-notes/generate
 * Generate release notes from PRs and issues using AI
 */
router.post('/generate', async (req: Request, res: Response) => {
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
    const { input } = req.body as GenerateReleaseNotesRequest;

    if (!input || typeof input !== 'object') {
      return res.status(400).json({
        error: 'Invalid Request',
        message: 'Request body must contain an "input" object',
      } as ErrorResponse);
    }

    if (!input.pullRequests || !Array.isArray(input.pullRequests)) {
      return res.status(400).json({
        error: 'Invalid Input',
        message: 'Input must contain a "pullRequests" array',
      } as ErrorResponse);
    }

    if (input.pullRequests.length === 0) {
      return res.status(400).json({
        error: 'Invalid Input',
        message: 'At least one pull request is required',
      } as ErrorResponse);
    }

    // Step 4: Create OpenAI service and generate release notes
    console.log(`→ Processing release notes request from ${identifier}`);
    const openAIService = new OpenAIService(apiKey);
    
    const releaseNotes = await openAIService.generateReleaseNotes(input);

    // Calculate summary
    const summary = {
      totalChanges: releaseNotes.features.length + releaseNotes.bugFixes.length + 
                    releaseNotes.security.length + releaseNotes.performance.length + 
                    releaseNotes.maintenance.length,
      newFeatures: releaseNotes.features.length,
      bugFixes: releaseNotes.bugFixes.length,
      securityUpdates: releaseNotes.security.length,
      performanceImprovements: releaseNotes.performance.length,
      maintenanceUpdates: releaseNotes.maintenance.length,
    };

    // Step 5: Return success response
    const duration = Date.now() - startTime;
    const remaining = rateLimiter.getRemainingRequests(identifier);
    
    console.log(`✅ Release notes generated successfully in ${duration}ms (${summary.totalChanges} items)`);

    return res.json({
      releaseNotes,
      summary,
      meta: {
        processingTime: duration,
        remaining: remaining,
      },
    } as GenerateReleaseNotesResponse);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Error in /generate endpoint (${duration}ms):`, error);

    // Handle specific error types
    if (error instanceof Error) {
      // Validation errors (400)
      if (error.message.includes('required') || 
          error.message.includes('too many') ||
          error.message.includes('invalid')) {
        return res.status(400).json({
          error: 'Validation Error',
          message: error.message,
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

export default router;

