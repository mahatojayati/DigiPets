import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import uploadRouter from "./backend/routes/upload";
import generateRouter from "./backend/routes/generate";
import petRouter from "./backend/routes/pet";
import chatRouter from "./backend/routes/chat";
import { servePetImage } from "./backend/controllers/petController";
import { errorHandler } from "./backend/middleware/errorHandler";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Health API Connection
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "online", 
      message: "DigiPets backend is online and ready!",
      timestamp: new Date().toISOString()
    });
  });

  // 2. Step 2 Real Backend Routes
  app.use("/api/upload", uploadRouter);
  app.use("/api/generate", generateRouter);
  app.use("/api/pet", petRouter);
  app.use("/api/chat", chatRouter);
  
  // Serve dynamic uploaded/generated files
  app.get("/uploads/:filename", servePetImage);

  // 3. Vite Middleware Integration (Dev Mode) vs Static Files (Production)
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite development middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Setting up Production static file delivery...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 4. Centralized Error Handling Middleware
  app.use(errorHandler);

  // 5. Bind server to 0.0.0.0 and port 3000 for container accessibility
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (Express v4 + Vite)`);
  });
}

startServer();
