import { Request, Response, NextFunction } from "express";

/**
 * Global centralized error handler for the Digital Pets backend.
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Backend Error occurred:", err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "An unexpected error occurred on the server.";

  res.status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });
};
