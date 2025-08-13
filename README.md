# OpenList Proxy for EdgeOne Pages

> 基于 EdgeOne Pages Functions 的高性能 OpenList 代理服务，支持全球分布式部署、签名验证、CORS 处理与文件下载代理。

## 项目简介

本项目旨在为 OpenList 提供一个高可用、低延迟的代理服务，适用于需要通过边缘节点加速文件分发、API 代理等场景。依托 EdgeOne Pages Functions，无需自建服务器即可实现弹性扩展和全球加速。

本项目参考了 [OpenList-Proxy](https://github.com/OpenListTeam/OpenList-Proxy) 的设计与实现，结合 EdgeOne Pages 的特性进行了优化。


## 目录结构

```
├── functions/               # EdgeOne Pages Functions
│   ├── index.js            # 根路径处理器
│   └── [[path]].js         # 通配符路由处理所有其他请求
├── public/                 # 静态文件目录（可选）
│   └── index.html          # 静态主页面（备用）
├── lib/                    # 共享库文件
│   ├── constants.js        # 常量和配置
│   ├── verify.js           # 签名验证
│   ├── handlers.js         # 请求处理器
│   └── utils.js            # 工具函数
├── edgeone.toml            # EdgeOne Pages 配置
└── package.json            # 项目配置
```

## 环境变量说明

在 EdgeOne Pages 控制台设置以下环境变量：

- `ADDRESS` (必需): OpenList 后端服务器地址
- `TOKEN` (必需): OpenList API 访问令牌
- `WORKER_ADDRESS` (可选): EdgeOne Pages 完整地址 (建议使用自定义域名)
- `DISABLE_SIGN` (可选): 是否禁用签名验证，建议为 `false`

## 快速开始

1. 安装 EdgeOne CLI：
   ```bash
   npm install -g edgeone
   ```
2. 安装依赖：
   ```bash
   npm install
   ```
3. 启动本地开发：
   ```bash
   npm run dev
   ```
4. 关联并部署到 EdgeOne Pages：
   ```bash
   npm run link
   npm run deploy
   ```

## 使用

### Openlist中的使用

1. 确保`环境变量`中的OpenList地址和令牌已正确配置。
2. 在 OpenList 的存储配置中配置Web代理打开，WebDAV策略为 `使用代理URL`。
3. 在 `下载代理URL` 中填写 EdgeOne Pages 的地址。
4. 保存配置。

### 文件下载
```
GET /{file-path}?sign={signature}
```

- **返回**：文件内容或 401/404 错误

## 常见问题与建议

- **签名验证**：强烈建议生产环境开启签名验证（`DISABLE_SIGN=false`），否则任何人可访问资源。
- **环境变量**：所有必需变量需在 EdgeOne Pages 控制台正确配置。
- **自定义域名**：可在控制台绑定自定义域名。



## 技术支持

- [官方文档](https://edgeone.ai/zh/document/162227908259442688)
- 技术支持请前往 EdgeOne Pages 控制台
