import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Placeholder Backend API Connections
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "online", 
      message: "Digital Pets backend is ready for Step 2!",
      timestamp: new Date().toISOString()
    });
  });

  // Placeholder endpoint for AI generation (Step 2)
  app.post("/api/pets/generate", (req, res) => {
    const { prompt, name } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required for pet generation." });
    }
    
    // In later steps, this will call the Gemini API to generate transparent PNG assets.
    // For now, we return a beautifully styled, reliable procedural seed avatar.
    const seed = encodeURIComponent(prompt || 'corgi');
    const imageUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;

    res.json({
      success: true,
      id: Date.now().toString(),
      name: name || "Unnamed Companion",
      imageUrl,
      method: "generate",
      message: "AI companion preview fetched via Express backend!"
    });
  });

  // 2. Vite Middleware Integration (Dev Mode) vs Static Files (Production)
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

  // 3. Bind server to 0.0.0.0 and port 3000 for container accessibility
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (Express v4 + Vite)`);
  });
}

startServer();
