/**
 * EdgeOne Pages Functions handler for root path
 * This handles requests to the root "/" path
 */

/**
 * Handle GET requests to root path
 * @param {object} context - EdgeOne Pages context
 * @returns {Promise<Response>} HTML response with service info
 */
export async function onRequestGet(context) {
  const { request } = context;
  
  // Return the main HTML page
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenList Proxy - EdgeOne Pages</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 2rem;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
        }
        h1 {
            text-align: center;
            margin-bottom: 2rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .status {
            text-align: center;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            margin: 1rem 0;
        }
        .feature {
            margin: 1rem 0;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            border-left: 4px solid #4CAF50;
        }
        .warning {
            background: rgba(255, 193, 7, 0.2);
            border-left-color: #FFC107;
            color: #FFF3CD;
        }
        .edgeone {
            background: rgba(74, 144, 226, 0.2);
            border-left-color: #4A90E2;
        }
        code {
            background: rgba(0, 0, 0, 0.3);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
        }
        .logo {
            text-align: center;
            font-size: 3rem;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🚀</div>
        <h1>OpenList Proxy</h1>
        <div class="status">✅ 服务正在运行在 EdgeOne Pages</div>
        
        <div class="status">
            <h2>服务状态</h2>
            <p>OpenList 代理服务已成功部署到 EdgeOne Pages</p>
            <p>时间: ${new Date().toLocaleString('zh-CN')}</p>
        </div>

        <div class="feature edgeone">
            <h3>🌍 EdgeOne Pages 优势</h3>
            <ul>
                <li>全球 3200+ 边缘节点分布式部署</li>
                <li>超低延迟访问体验</li>
                <li>弹性扩容，自动负载均衡</li>
                <li>Serverless 架构，免运维</li>
            </ul>
        </div>

        <div class="feature">
            <h3>🔒 安全特性</h3>
            <ul>
                <li>HMAC-SHA256 签名验证</li>
                <li>请求过期时间检查</li>
                <li>CORS 跨域支持</li>
                <li>路径安全验证</li>
            </ul>
        </div>

        <div class="feature">
            <h3>⚡ 性能优势</h3>
            <ul>
                <li>EdgeOne 全球 CDN 加速</li>
                <li>边缘计算处理</li>
                <li>智能缓存优化</li>
                <li>自动 HTTPS 加密</li>
            </ul>
        </div>
    </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

/**
 * Handle other HTTP methods for API responses
 * @param {object} context - EdgeOne Pages context
 * @returns {Promise<Response>} JSON response with service info
 */
export async function onRequest(context) {
  const { request } = context;
  
  // For non-GET requests, return JSON
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({
      service: "OpenList Proxy",
      status: "running",
      platform: "EdgeOne Pages",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
      api_endpoint: "/api/download/{file-path}?sign={signature}"
    }), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
  
  // For GET requests, call the HTML handler
  return onRequestGet(context);
}
