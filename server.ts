import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { app } from "./backend/app";

async function startServer() {
  const PORT = 3000;

  // Vite Middleware Integration (Dev Mode) vs Static Files (Production)
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite development middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Setting up Production static file delivery...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind server to 0.0.0.0 and port 3000 for container accessibility
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (Express v4 + Vite)`);
  });
}

// Only start the server directly when not in a serverless environment
if (!process.env.VERCEL) {
  startServer();
}

export default app;

