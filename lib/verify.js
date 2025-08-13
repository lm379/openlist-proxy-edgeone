/**
 * Signature verification utilities for OpenList proxy
 */

import { getConstants } from './constants.js';

/**
 * Verifies a signed string with expiration check
 * @param {string} data - Original data to verify
 * @param {string} _sign - Signed string to validate
 * @returns {Promise<string>} Error message if invalid, empty string if valid
 */
export async function verify(data, _sign) {
  const { DISABLE_SIGN, TOKEN } = getConstants();
  
  // If signature verification is disabled, return pass directly
  if (DISABLE_SIGN) {
    return "";
  }

  const signSlice = _sign.split(":");
  if (!signSlice[signSlice.length - 1]) {
    return "expire missing";
  }
  
  const expire = parseInt(signSlice[signSlice.length - 1]);
  if (isNaN(expire)) {
    return "expire invalid";
  }
  
  if (expire < Date.now() / 1000 && expire > 0) {
    return "expire expired";
  }
  
  const right = await hmacSha256Sign(data, expire, TOKEN);
  if (_sign !== right) {
    return "sign mismatch";
  }
  
  return "";
}

/**
 * Generates an HMAC-SHA256 signature with expiration
 * @param {string} data - The data to sign
 * @param {number} expire - Expiry timestamp (in seconds)
 * @param {string} token - The signing token
 * @returns {Promise<string>} The signed string
 */
export async function hmacSha256Sign(data, expire, token) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(token),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  
  const buf = await crypto.subtle.sign(
    { name: "HMAC", hash: "SHA-256" },
    key,
    new TextEncoder().encode(`${data}:${expire}`)
  );
  
  return (
    btoa(String.fromCharCode(...new Uint8Array(buf)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_") +
    ":" +
    expire
  );
}
