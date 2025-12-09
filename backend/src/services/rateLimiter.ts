/**
 * Rate Limiter for API endpoints
 * Prevents abuse and controls costs by limiting requests per user/IP
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly MAX_REQUESTS_PER_MINUTE = 10;
  private readonly MAX_REQUESTS_PER_HOUR = 100;
  private readonly CLEANUP_INTERVAL = 3600000; // 1 hour in milliseconds

  constructor() {
    // Periodically cleanup old entries to prevent memory leaks
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
  }

  /**
   * Check if a user/IP has exceeded rate limits
   * @param identifier - User ID, IP address, or API key hash
   * @throws Error if rate limit exceeded
   */
  async checkLimit(identifier: string): Promise<void> {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Remove old requests (older than 1 hour)
    const recentRequests = userRequests.filter(time => now - time < 3600000);
    
    // Check hourly limit
    if (recentRequests.length >= this.MAX_REQUESTS_PER_HOUR) {
      const oldestRequest = Math.min(...recentRequests);
      const resetTime = new Date(oldestRequest + 3600000);
      throw new Error(
        `Rate limit exceeded: Maximum ${this.MAX_REQUESTS_PER_HOUR} requests per hour. ` +
        `Try again after ${resetTime.toLocaleTimeString()}`
      );
    }
    
    // Check per-minute limit
    const lastMinuteRequests = recentRequests.filter(time => now - time < 60000);
    if (lastMinuteRequests.length >= this.MAX_REQUESTS_PER_MINUTE) {
      const oldestRequest = Math.min(...lastMinuteRequests);
      const resetTime = new Date(oldestRequest + 60000);
      throw new Error(
        `Rate limit exceeded: Maximum ${this.MAX_REQUESTS_PER_MINUTE} requests per minute. ` +
        `Try again after ${resetTime.toLocaleTimeString()}`
      );
    }
    
    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
  }

  /**
   * Get remaining requests for a user/IP
   */
  getRemainingRequests(identifier: string): { perMinute: number; perHour: number } {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    const lastMinuteRequests = userRequests.filter(time => now - time < 60000);
    const lastHourRequests = userRequests.filter(time => now - time < 3600000);
    
    return {
      perMinute: Math.max(0, this.MAX_REQUESTS_PER_MINUTE - lastMinuteRequests.length),
      perHour: Math.max(0, this.MAX_REQUESTS_PER_HOUR - lastHourRequests.length),
    };
  }

  /**
   * Clean up old entries to prevent memory leaks
   */
  private cleanup(): void {
    const now = Date.now();
    const oneHourAgo = now - 3600000;
    
    for (const [identifier, requests] of this.requests.entries()) {
      const recentRequests = requests.filter(time => time > oneHourAgo);
      
      if (recentRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, recentRequests);
      }
    }
    
    console.log(`Rate limiter cleanup: ${this.requests.size} active identifiers`);
  }

  /**
   * Reset rate limits for a specific identifier (useful for testing)
   */
  reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  /**
   * Get statistics about current rate limiting
   */
  getStats(): { totalIdentifiers: number; totalRequests: number } {
    let totalRequests = 0;
    
    for (const requests of this.requests.values()) {
      totalRequests += requests.length;
    }
    
    return {
      totalIdentifiers: this.requests.size,
      totalRequests,
    };
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

