/**
 * Utility functions for OpenList proxy service
 */

/**
 * Create a standardized error response
 * @param {number} code - HTTP status code
 * @param {string} message - Error message
 * @param {string} origin - Request origin for CORS
 * @returns {Response} Error response with proper headers
 */
export function createErrorResponse(code, message, origin = "*") {
  return new Response(
    JSON.stringify({
      code,
      message,
      timestamp: new Date().toISOString()
    }),
    {
      status: code >= 200 && code < 300 ? 200 : code,
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": origin,
      },
    }
  );
}

/**
 * Log request information (for debugging)
 * @param {Request} request - The request to log
 * @param {string} stage - Stage of processing
 */
export function logRequest(request, stage = "processing") {
  const url = new URL(request.url);
  console.log(`[${stage.toUpperCase()}] ${request.method} ${url.pathname}${url.search}`);
}

/**
 * Validate environment variables
 * @param {object} env - Environment variables
 * @returns {string[]} Array of missing required variables
 */
export function validateEnvironment(env) {
  const required = ['ADDRESS', 'TOKEN'];
  const missing = [];
  
  for (const key of required) {
    if (!env[key] || env[key] === `YOUR_${key}`) {
      missing.push(key);
    }
  }
  
  return missing;
}

/**
 * Check if the request path is valid
 * @param {string} path - Request path
 * @returns {boolean} True if path is valid
 */
export function isValidPath(path) {
  // Basic path validation - no directory traversal attempts
  if (path.includes('..') || path.includes('//')) {
    return false;
  }
  
  // Must start with /
  if (!path.startsWith('/')) {
    return false;
  }
  
  return true;
}
