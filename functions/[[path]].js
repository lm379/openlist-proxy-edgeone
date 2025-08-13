/**
 * EdgeOne Pages Functions entry point
 * This file handles all incoming requests using the [[path]] catch-all route
 */

import { initConstants } from '../lib/constants.js';
import { handleRequest } from '../lib/handlers.js';
import { validateEnvironment, createErrorResponse, logRequest, isValidPath } from '../lib/utils.js';

/**
 * EdgeOne Pages Functions handler for all HTTP methods
 * @param {object} context - EdgeOne Pages context
 * @param {Request} context.request - The incoming request
 * @param {object} context.params - Dynamic route parameters
 * @param {object} context.env - Environment variables
 * @param {Function} context.waitUntil - Function to extend event lifetime
 * @returns {Promise<Response>} Response from the handler
 */
export async function onRequest(context) {
  const { request, params, env, waitUntil } = context;
  
  try {
    // Initialize constants from environment variables
    initConstants(env);
    
    // Validate required environment variables
    const missingVars = validateEnvironment(env);
    if (missingVars.length > 0) {
      return createErrorResponse(
        500, 
        `Missing required environment variables: ${missingVars.join(', ')}`,
        request.headers.get("origin") ?? "*"
      );
    }
    
    // Log the request for debugging
    logRequest(request);
    
    // Get the path from URL
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Handle root path - return service info
    if (path === '/' || path === '') {
      return new Response(JSON.stringify({
        service: "OpenList Proxy",
        status: "running",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
      }), {
        headers: {
          "content-type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    
    // Validate the path
    if (!isValidPath(path)) {
      return createErrorResponse(
        400,
        "Invalid path",
        request.headers.get("origin") ?? "*"
      );
    }
    
    // Handle the download request
    return await handleRequest(request);
    
  } catch (error) {
    console.error('Error handling request:', error);
    return createErrorResponse(
      500,
      "Internal server error",
      request.headers.get("origin") ?? "*"
    );
  }
}
