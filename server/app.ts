import { type Server } from "node:http";

import express, {
  type Express,
  type Request,
  Response,
  NextFunction,
} from "express";

import { registerRoutes } from "./routes";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

export default async function runApp(
  setup: (app: Express, server: Server) => Promise<void>,
) {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly run the final setup after setting up all the other routes so
  // the catch-all route doesn't interfere with the other routes
  await setup(app, server);

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Default to 5000 if not specified.
  const port = parseInt(process.env.PORT || '5000', 10);

  // Prefer a HOST env var; on Windows default to localhost (127.0.0.1)
  const requestedHost = process.env.HOST || '127.0.0.1';

  // Allow opt-in reusePort if explicitly set to "true"
  const reusePort = String(process.env.REUSE_PORT || "false").toLowerCase() === "true";

  const listenOpts = {
    port,
    host: requestedHost,
    reusePort,
  } as any;

  // Attach an error handler BEFORE calling listen so we can attempt a fallback.
  server.on('error', (err: any) => {
    log(`Server error event: ${err?.code || err}`, 'server');

    // If binding to the requested host isn't supported, try localhost as a fallback
    if ((err && (err.code === 'ENOTSUP' || err.code === 'EADDRNOTAVAIL')) && requestedHost !== '127.0.0.1') {
      log(`Binding to ${requestedHost}:${port} failed (${err.code}). Attempting fallback to 127.0.0.1:${port}`, 'server');

      // Wait a tick then try again on localhost. If the server is already closed this will start it fresh.
      setTimeout(() => {
        try {
          server.listen({ port, host: '127.0.0.1', reusePort: false }, () => {
            log(`Fallback: server running at http://127.0.0.1:${port}`, 'server');
          });
        } catch (innerErr) {
          log(`Fallback listen failed: ${innerErr}`, 'server');
          // If fallback also fails, exit with a useful message.
          process.exitCode = 1;
        }
      }, 50);

      return;
    }

    // For other errors, rethrow so they aren't swallowed.
    log(`Unhandled server error: ${err?.stack || err}`, 'server');
    process.exitCode = 1;
  });

  // Try to listen with the requested options
  try {
    server.listen(listenOpts, () => {
      log(`serving on port ${port} (host=${listenOpts.host}, reusePort=${listenOpts.reusePort})`, 'server');
    });
  } catch (err: any) {
    // Some platforms / Node versions can throw synchronously — handle that as well.
    log(`Listen threw synchronously: ${err?.message || err}`, 'server');

    // Attempt immediate fallback to 127.0.0.1
    try {
      server.listen({ port, host: '127.0.0.1', reusePort: false }, () => {
        log(`Fallback (sync): server running at http://127.0.0.1:${port}`, 'server');
      });
    } catch (innerErr) {
      log(`Fallback (sync) failed: ${innerErr}`, 'server');
      process.exitCode = 1;
    }
  }
}
