/**
 * Constants and configuration for the OpenList proxy service
 * Environment variables are injected by EdgeOne Pages runtime
 */

// Global constants that will be initialized from environment
let ADDRESS, TOKEN, PAGES_ADDRESS, DISABLE_SIGN;

/**
 * Initialize constants from EdgeOne Pages environment variables
 * @param {object} env - Environment variables from EdgeOne Pages context
 */
export function initConstants(env) {
  // OpenList 后端服务器地址 (不要包含尾随斜杠)
  // OpenList backend server address (do not include trailing slash)
  ADDRESS = env.ADDRESS || "YOUR_ADDRESS";
  
  // OpenList 服务器的 API 访问令牌 (密钥)
  // API access token (secret key) for OpenList server
  TOKEN = env.TOKEN || "YOUR_TOKEN";
  
  // EdgeOne Pages 的完整地址
  // Full address of your EdgeOne Pages site
  PAGES_ADDRESS = env.PAGES_ADDRESS || "YOUR_PAGES_ADDRESS";
  
  // 是否禁用签名验证 (推荐设置为 false)
  // Whether to disable signature verification (recommended to set as false)
  // 隐私警告：关闭签名会造成文件可被任何知晓路径的人获取
  // Privacy Warning: Disabling signature allows files to be accessed by anyone who knows the path
  DISABLE_SIGN = env.DISABLE_SIGN === "true" || env.DISABLE_SIGN === true || false;
}

/**
 * Get the current value of constants (for use in other modules)
 */
export function getConstants() {
  return {
    ADDRESS,
    TOKEN,
    PAGES_ADDRESS,
    DISABLE_SIGN
  };
}
