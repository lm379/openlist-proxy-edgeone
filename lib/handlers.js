/**
 * Request handlers for OpenList proxy service
 */

import { getConstants } from './constants.js';
import { verify } from './verify.js';

/**
 * Handles download requests with signature verification and CORS
 * @param {Request} request - The incoming fetch request
 * @returns {Promise<Response>} A proper file or error response
 */
export async function handleDownload(request) {
  const { ADDRESS, TOKEN, PAGES_ADDRESS, DISABLE_SIGN } = getConstants();
  const origin = request.headers.get("origin") ?? "*";
  const url = new URL(request.url);
  const path = decodeURIComponent(url.pathname);

  // If signature verification is not disabled, perform signature verification
  if (!DISABLE_SIGN) {
    const sign = url.searchParams.get("sign") ?? "";
    const verifyResult = await verify(path, sign);
    
    if (verifyResult !== "") {
      return new Response(
        JSON.stringify({
          code: 401,
          message: verifyResult,
        }),
        {
          headers: {
            "content-type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": origin,
          },
        }
      );
    }
  }

  // Request download link from OpenList backend
  let resp = await fetch(`${ADDRESS}/api/fs/link`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: TOKEN,
    },
    body: JSON.stringify({
      path,
    }),
  });
  
  let res = await resp.json();
  if (res.code !== 200) {
    return new Response(JSON.stringify(res), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": origin,
      },
    });
  }

  // Create new request with the download URL (strip referer/origin/host and forwarded headers)
  const forwardHeaders = new Headers(request.headers);
  [
    "referer",
    "referrer",
    "origin",
    "host",
    "hosts",
    "x-forwarded-host",
    "x-forwarded-for",
    "x-forwarded-proto",
    "x-forwarded-port",
    "x-real-ip",
    "forwarded",
    "via"
  ].forEach((h) => forwardHeaders.delete(h));
  request = new Request(res.data.url, { method: "GET", headers: forwardHeaders });
  
  // Apply any custom headers from the backend response (no filtering)
  if (res.data.header) {
    for (const k in res.data.header) {
      for (const v of res.data.header[k]) {
        request.headers.set(k, v);
      }
    }
  }

  // Fetch the actual file
  let response = await fetch(request);
  
  // Handle redirects, but avoid infinite loops with our own domain
  while (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("Location");
    if (location) {
      if (location.startsWith(`${PAGES_ADDRESS}/`)) {
        // If redirect points to our own domain, handle it as a new request
        const redirectedHeaders = new Headers(request.headers);
        [
          "referer",
          "referrer",
          "origin",
          "host",
          "hosts",
          "x-forwarded-host",
          "x-forwarded-for",
          "x-forwarded-proto",
          "x-forwarded-port",
          "x-real-ip",
          "forwarded",
          "via"
        ].forEach((h) => redirectedHeaders.delete(h));
        request = new Request(location, { method: request.method, headers: redirectedHeaders });
        return await handleRequest(request);
      } else {
        // Follow external redirects
        const redirectedHeaders = new Headers(request.headers);
        [
          "referer",
          "referrer",
          "origin",
          "host",
          "hosts",
          "x-forwarded-host",
          "x-forwarded-for",
          "x-forwarded-proto",
          "x-forwarded-port",
          "x-real-ip",
          "forwarded",
          "via"
        ].forEach((h) => redirectedHeaders.delete(h));
        request = new Request(location, { method: request.method, headers: redirectedHeaders });
        response = await fetch(request);
      }
    } else {
      break;
    }
  }

  // Create response with CORS headers and a strict header whitelist
  const allowedHeaderNames = [
    "content-type",
    "content-disposition",
    "content-range",
    "accept-ranges",
    "etag",
    "last-modified",
    "cache-control",
    "expires",
    "content-encoding"
  ];
  const allowedSet = new Set(allowedHeaderNames);
  const filteredHeaders = new Headers();
  for (const [k, v] of response.headers) {
    if (allowedSet.has(k.toLowerCase())) {
      filteredHeaders.set(k, v);
    }
  }
  filteredHeaders.set("Access-Control-Allow-Origin", origin);
  filteredHeaders.append("Vary", "Origin");

  return new Response(response.body, {
    status: response.status,
    headers: filteredHeaders,
  });
}

/**
 * Handles preflight CORS (OPTIONS) requests
 * @param {Request} request - The incoming OPTIONS request
 * @returns {Response} Response with CORS headers
 */
export function handleOptions(request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };
  
  let headers = request.headers;
  if (
    headers.get("Origin") !== null &&
    headers.get("Access-Control-Request-Method") !== null
  ) {
    let respHeaders = {
      ...corsHeaders,
      "Access-Control-Allow-Headers":
        request.headers.get("Access-Control-Request-Headers") || "",
    };
    return new Response(null, {
      headers: respHeaders,
    });
  } else {
    return new Response(null, {
      headers: {
        Allow: "GET, HEAD, OPTIONS",
      },
    });
  }
}

/**
 * Main request handler that routes based on HTTP method
 * @param {Request} request - The incoming HTTP request
 * @returns {Promise<Response>} A valid response
 */
export async function handleRequest(request) {
  if (request.method === "OPTIONS") {
    return handleOptions(request);
  }
  return await handleDownload(request);
}
