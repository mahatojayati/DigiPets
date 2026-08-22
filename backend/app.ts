import express from "express";
import uploadRouter from "./routes/upload";
import generateRouter from "./routes/generate";
import petRouter from "./routes/pet";
import chatRouter from "./routes/chat";
import { servePetImage } from "./controllers/petController";
import { errorHandler } from "./middleware/errorHandler";

export function createExpressApp() {
  const app = express();

  // Permissive CORS for preview & serverless environments
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Basic middleware
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // 1. Health API Check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "online",
      message: "DigiPets backend is online and ready!",
      timestamp: new Date().toISOString(),
      platform: process.env.VERCEL ? "vercel-serverless" : "standalone-node",
    });
  });

  // 2. API Routes
  app.use("/api/upload", uploadRouter);
  app.use("/api/generate", generateRouter);
  app.use("/api/pet", petRouter);
  app.use("/api/chat", chatRouter);

  // 3. Dynamic Pet Image Serving
  app.get("/uploads/:filename", servePetImage);
  app.get("/api/uploads/:filename", servePetImage);

  // 4. Centralized Error Handler
  app.use(errorHandler);

  return app;
}

export const app = createExpressApp();
export default app;
