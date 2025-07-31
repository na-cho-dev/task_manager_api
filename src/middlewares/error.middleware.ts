import { Request, Response, NextFunction } from "express";
import { config } from "../config";
import { AppError } from "../errors/AppError";
import logger from "../utils/logger";

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`Error on ${req.method} ${req.url}:`, {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Handle known operational errors
  if (err instanceof AppError || err.isOperational) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
      code: err.name || "OPERATIONAL_ERROR",
      timestamp: new Date().toISOString(),
      path: req.url,
      method: req.method,
    });
    return;
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    res.status(400).json({
      success: false,
      message: err.message,
      code: "VALIDATION_ERROR",
      timestamp: new Date().toISOString(),
      path: req.url,
      method: req.method,
    });
    return;
  }

  // Handle unknown errors
  const isDevelopment = config.NODE_ENV === "development";

  res.status(err.status || err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    code: "INTERNAL_ERROR",
    ...(isDevelopment && {
      stack: err.stack,
      details: err,
    }),
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method,
  });
};
