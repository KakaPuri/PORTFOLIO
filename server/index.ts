import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from './storage';
import { exec } from "child_process";
import cors from "cors";
import path from "path";

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: false, limit: '20mb' }));
app.use(cors({
  origin: true, // allow all origins or set to frontend URL for production
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Tambahkan timeout lebih panjang untuk upload besar
app.use((req, res, next) => {
  req.setTimeout(5 * 60 * 1000); // 5 menit
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

(async () => {
  // Run database migration first
  try {
    console.log('🔄 Running database migration...');
    const { execSync } = await import('child_process');
    execSync('npx drizzle-kit push', { stdio: 'inherit' });
    console.log('✅ Database migration completed');
  } catch (error) {
    console.error('❌ Database migration failed:', error);
    console.log('⚠️  Continuing without migration...');
  }

  // Then seed database
  try {
    await seedDatabase();
    console.log('✅ Database seeding completed');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    console.log('⚠️  Continuing without seeding...');
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use environment variable for port, fallback to 8080
  const port = process.env.PORT || 8080;
  const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1";
  
  server.listen({
    port,
    host,
  }, () => {
    log(`serving on port ${port}`);
  });

  // Jalankan migrasi setiap server start (hanya di production)
  if (process.env.NODE_ENV === "production") {
    exec("npx drizzle-kit push", (err, stdout, stderr) => {
      if (err) {
        console.error("Migration error:", stderr);
      } else {
        console.log("Migration result:", stdout);
      }
    });
  }
})();
