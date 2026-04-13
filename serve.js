const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3001;
const ROOT = __dirname;

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
};

// 동적 라우트 → 템플릿 HTML 매핑
const DYNAMIC_ROUTES = [
  { pattern: /^\/events\/[^/]+\/?$/, template: "events/_/index.html" },
  { pattern: /^\/exhibitions\/[^/]+\/?$/, template: "exhibitions/_/index.html" },
  { pattern: /^\/accommodations\/[^/]+\/?$/, template: "accommodations/_/index.html" },
  { pattern: /^\/booking\/[^/]+\/?$/, template: "booking/_/index.html" },
  { pattern: /^\/booking\/[^/]+\/complete\/?$/, template: "booking/_/complete/index.html" },
  { pattern: /^\/bookings\/[^/]+\/?$/, template: "bookings/_/index.html" },
];

function findDynamicTemplate(url) {
  for (const route of DYNAMIC_ROUTES) {
    if (route.pattern.test(url)) {
      return path.join(ROOT, route.template);
    }
  }
  return null;
}

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  let filePath = path.join(ROOT, url);

  // 디렉토리면 index.html 찾기
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  // 파일이 있으면 그대로 서빙
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // 동적 라우트 매칭 → 해당 템플릿 HTML 서빙
  const templatePath = findDynamicTemplate(url);
  if (templatePath && fs.existsSync(templatePath)) {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(templatePath).pipe(res);
    return;
  }

  // 나머지 → root index.html (SPA fallback)
  const indexPath = path.join(ROOT, "index.html");
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream(indexPath).pipe(res);
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`SPA server running at http://0.0.0.0:${PORT}`);
});
