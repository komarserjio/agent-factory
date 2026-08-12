import { createServer } from "node:http";

const defaultPort = 3000;
const configuredPort = Number(process.env.PORT);
const port = Number.isInteger(configuredPort) && configuredPort > 0
  ? configuredPort
  : defaultPort;

const server = createServer((request, response) => {
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  const isWelcomeRequest = request.method === "GET" && pathname === "/";
  const statusCode = isWelcomeRequest ? 200 : 404;
  const body = JSON.stringify(
    isWelcomeRequest
      ? { message: "Hello, world!", nodeEnv: process.env.NODE_ENV ?? "undefined" }
      : { message: "Not found" },
  );

  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(body);
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

server.on("error", (error) => {
  console.error("Unable to start server:", error);
  process.exitCode = 1;
});
