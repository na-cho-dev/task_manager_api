import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import { config } from "./config";
import logger from "./utils/logger";
import { errorHandler } from "./middlewares/error.middleware";
import taskRouter from "./routes/task.routes";

export const app: Application = express();

// Basic middlewares - order matters!
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

// =================< ROUTES SECTION >=================

// Root route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Express API is running!",
    version: "1.0.0",
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Health Check
app.get("/health", (req: Request, res: Response) => {
  const healthData = {
    status: "OK",
    environment: config.NODE_ENV,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  };

  res.status(200).json(healthData);
});

// API Documentation Route
app.use("/api/tasks", taskRouter);

// ================< END ROUTES SECTION >=================

// 404 handler for unmatched routes - MUST be last before error handler
app.use((req: Request, res: Response) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: {
      root: "GET /",
      health: "GET /health",
    },
  });
});

// Global Error Handling Middleware - MUST be absolute last
app.use(errorHandler);

// Start the server
const startServer = async () => {
  try {
    // Start the server
    const server = app.listen(config.PORT, config.HOST, () => {
      logger.info("🚀 Server started successfully!", {
        env: `${config.NODE_ENV}`,
        host: `${config.HOST}`,
        port: `${config.PORT}`,
        started_at: `${new Date().toLocaleString()}`,
        api_root: `http://${config.HOST}:${config.PORT}`,
      });

      // Graceful shutdown
      process.on("SIGTERM", () => {
        logger.info("SIGTERM received, shutting down gracefully");
        server.close(() => {
          logger.info("Server closed");
          process.exit(0);
        });
      });
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection:", { reason, promise });
  process.exit(1);
});

startServer();
