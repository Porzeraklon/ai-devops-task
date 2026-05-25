const http = require("http");

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || "0.0.0.0";

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Hello from Node in Docker\n");
});

server.listen(port, host, () => {
  console.log(`Listening on http://${host}:${port}`);
});
