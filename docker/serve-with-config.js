#!/usr/bin/env node
/**
 * 轻量静态服务：在响应时注入部署配置，不修改镜像内任何打包文件。
 * - GET /config.js → 根据环境变量返回 window.__APP_CONFIG__
 * - GET / 或 /index.html → 返回 index.html 并在 </head> 前注入 <script src="/config.js">
 * - 其余请求 → 静态文件
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.FRONTEND_PORT) || 3000;
const ROOT = process.env.FRONTEND_DIR || "/app/frontend";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json",
  ".css": "text/css; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json",
};

function getConfigScript() {
  const config = {
    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || "http://localhost:9090/",
    VITE_API_WS_BASE_URL: process.env.VITE_API_WS_BASE_URL || "ws://localhost:9091/",
    VITE_BASE_OSS_PATH: process.env.VITE_BASE_OSS_PATH || "",
  };
  return "window.__APP_CONFIG__ = " + JSON.stringify(config) + ";";
}

function injectConfigIntoIndex(html) {
  const script = '<script src="/config.js"></script>';
  if (html.includes(script)) return html;
  return html.replace("</head>", script + "</head>");
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url || "/", "http://localhost");
  const pathname = decodeURIComponent(u.pathname) || "/";

  // 1. 动态 /config.js：完全由环境变量决定，不写盘
  if (pathname === "/config.js") {
    res.writeHead(200, {
      "Content-Type": MIME[".js"],
      "Cache-Control": "no-cache, no-store, must-revalidate",
    });
    res.end(getConfigScript());
    return;
  }

  // 2. index.html：在内存中注入 script，不修改磁盘文件
  if (pathname === "/" || pathname === "/index.html") {
    const indexFile = path.join(ROOT, "index.html");
    fs.readFile(indexFile, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not Found");
        return;
      }
      const html = injectConfigIntoIndex(data.toString());
      res.writeHead(200, { "Content-Type": MIME[".html"] });
      res.end(html);
    });
    return;
  }

  // 3. 静态文件（限制在 ROOT 内，防止路径穿越）
  const resolved = path.resolve(ROOT, pathname.replace(/^\/+/, ""));
  if (!resolved.startsWith(path.resolve(ROOT))) {
    res.writeHead(404);
    res.end("Not Found");
    return;
  }
  fs.readFile(resolved, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }
    const ext = path.extname(resolved);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("Frontend serving at http://0.0.0.0:" + PORT + " (config from env)");
});
