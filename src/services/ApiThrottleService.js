/**
 * Service for throttling API requests to prevent rate limit errors
 * Implements request queuing, debouncing, and exponential backoff
 */
class ApiThrottleService {
    constructor() {
      // Pending requests queue
      this.requestQueue = new Map();
      
      // Backoff settings
      this.backoffDelay = 1000; // Initial backoff delay in ms
      this.maxBackoffDelay = 30000; // Maximum backoff delay
      this.backoffMultiplier = 2; // Exponential multiplier
      
      // Rate limit tracking
      this.endpointRateLimits = new Map();
      
      // Default request options
      this.defaultRequestOptions = {
        debounceMs: 300, // Default debounce time
        useQueue: true,  // Enable queuing by default
      };
    }
    
    /**
     * Adds rate limit info for an endpoint after a 429 response
     * @param {string} endpoint - API endpoint
     */
    trackRateLimit(endpoint) {
      const now = Date.now();
      let backoff = this.backoffDelay;
      
      if (this.endpointRateLimits.has(endpoint)) {
        const current = this.endpointRateLimits.get(endpoint);
        backoff = Math.min(current.backoff * this.backoffMultiplier, this.maxBackoffDelay);
      }
      
      this.endpointRateLimits.set(endpoint, {
        timestamp: now,
        backoff,
      });
      
      console.warn(`Rate limit hit for ${endpoint}. Backing off for ${backoff}ms`);
      
      // Clear the rate limit after the backoff period
      setTimeout(() => {
        if (this.endpointRateLimits.has(endpoint)) {
          this.endpointRateLimits.delete(endpoint);
        }
      }, backoff);
    }
    
    /**
     * Check if an endpoint is currently rate limited
     * @param {string} endpoint - API endpoint
     * @returns {boolean} True if rate limited
     */
    isRateLimited(endpoint) {
      if (!this.endpointRateLimits.has(endpoint)) {
        return false;
      }
      
      return true;
    }
    
    /**
     * Get backoff time for an endpoint
     * @param {string} endpoint - API endpoint
     * @returns {number} Backoff time in ms
     */
    getBackoffTime(endpoint) {
      if (!this.endpointRateLimits.has(endpoint)) {
        return 0;
      }
      
      return this.endpointRateLimits.get(endpoint).backoff;
    }
    
    /**
     * Execute a request with throttling
     * @param {string} key - Unique key for this request
     * @param {Function} requestFn - Async function that makes the request
     * @param {Object} options - Throttling options
     * @returns {Promise<any>} Promise that resolves with the request result
     */
    async throttleRequest(key, requestFn, options = {}) {
      const opts = { ...this.defaultRequestOptions, ...options };
      
      // Extract the endpoint from the key for rate limiting
      const endpoint = key.split('?')[0]; // Remove query params
      
      // Check if this endpoint is rate limited
      if (this.isRateLimited(endpoint)) {
        const backoffTime = this.getBackoffTime(endpoint);
        console.log(`Endpoint ${endpoint} is rate limited. Waiting ${backoffTime}ms.`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
      
      // If request is already in queue, return that promise
      if (opts.useQueue && this.requestQueue.has(key)) {
        console.log(`Request for ${key} already in progress, reusing promise.`);
        return this.requestQueue.get(key);
      }
      
      // Create a new request promise with debouncing
      const requestPromise = new Promise(async (resolve, reject) => {
        if (opts.debounceMs > 0) {
          await new Promise(r => setTimeout(r, opts.debounceMs));
        }
        
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          // If this is a rate limit error, track it
          if (error.response && error.response.status === 429) {
            this.trackRateLimit(endpoint);
          }
          reject(error);
        } finally {
          // Remove from queue when done
          if (opts.useQueue) {
            this.requestQueue.delete(key);
          }
        }
      });
      
      // Add to queue if queuing is enabled
      if (opts.useQueue) {
        this.requestQueue.set(key, requestPromise);
      }
      
      return requestPromise;
    }
  }
  
  // Create a singleton instance
  const apiThrottle = new ApiThrottleService();
  
  export default apiThrottle;