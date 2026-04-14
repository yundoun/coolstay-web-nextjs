const http = require("http");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");

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
  { pattern: /^\/accommodations\/[^/]+\/reviews\/?$/, template: "accommodations/_/reviews/index.html" },
  { pattern: /^\/booking\/[^/]+\/?$/, template: "booking/_/index.html" },
  { pattern: /^\/booking\/[^/]+\/complete\/?$/, template: "booking/_/complete/index.html" },
  { pattern: /^\/bookings\/[^/]+\/?$/, template: "bookings/_/index.html" },
  { pattern: /^\/payment\/complete\/?$/, template: "payment/complete/index.html" },
  { pattern: /^\/magazine\/package\/[^/]+\/?$/, template: "magazine/package/_/index.html" },
  { pattern: /^\/magazine\/board\/[^/]+\/?$/, template: "magazine/board/_/index.html" },
];

function findDynamicTemplate(url) {
  for (const route of DYNAMIC_ROUTES) {
    if (route.pattern.test(url)) {
      return path.join(ROOT, route.template);
    }
  }
  return null;
}

/** POST body 파싱 */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(querystring.parse(body)));
    req.on("error", reject);
  });
}

const BASE_PATH = process.env.BASE_PATH || "/web/coolstay";

const server = http.createServer(async (req, res) => {
  const rawUrl = decodeURIComponent(req.url.split("?")[0]);
  // Apache가 basePath를 포함한 채 프록시하므로 strip
  const url = rawUrl.startsWith(BASE_PATH) ? rawUrl.slice(BASE_PATH.length) || "/" : rawUrl;

  // ─── 이니시스 결제 콜백 (returnUrl) ───
  // 결제 인증 결과를 localStorage에 저장하고 완료 페이지로 이동 (UI 플로우만)
  if (url === "/pg/payment/return" && req.method === "POST") {
    const body = await parseBody(req);
    console.log("[Payment Return]", JSON.stringify(body, null, 2));

    const basePath = process.env.BASE_PATH || "/web/coolstay";
    const resultCode = body.resultCode || "";
    const resultMsg = body.resultMsg || "";
    const orderNumber = body.orderNumber || body.MOID || "";
    const isSuccess = resultCode === "0000";

    const result = JSON.stringify({
      resultCode: isSuccess ? "0000" : "FAIL",
      resultMsg: isSuccess ? "결제가 완료되었습니다." : (resultMsg || "결제가 취소되었습니다."),
      merchantUid: orderNumber,
    }).replace(/"/g, '\\"');

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>
      <p>결제 결과를 처리하고 있습니다...</p>
      <script>
        try { localStorage.setItem("inicisPaymentResult", "${result}"); } catch(e) {}
        location.href="${basePath}/payment/complete/";
      </script></body></html>`);
    return;
  }

  if (url === "/pg/payment/close") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<script>window.close()</script>");
    return;
  }

  // ─── 정적 파일 서빙 ───
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
