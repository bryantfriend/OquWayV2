import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const rootDir = process.cwd();
const port = Number(process.env.OQUWAY_E2E_PORT || 4173);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8"
};

const server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url || "/");
  var requestPath = decodeURIComponent(parsedUrl.pathname || "/");
  var filePath = path.resolve(rootDir, "." + requestPath);

  if (filePath.indexOf(rootDir) !== 0) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  fs.readFile(filePath, function (error, data) {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream"
    });
    response.end(data);
  });
});

server.listen(port, "127.0.0.1", function () {
  console.log("OquWay e2e fixture server listening on http://127.0.0.1:" + port);
});
