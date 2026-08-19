# DigiPets — AI Desktop Companion 🐾✨

[![CI Build & Lint](https://github.com/your-username/digipets/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/digipets/actions)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fdigipets&env=GEMINI_API_KEY&envDescription=Google%20AI%20Studio%20Gemini%20API%20Key&project-name=digipets&repo-name=digipets)

DigiPets is an interactive, AI-powered desktop companion web application. Users can create, customize, feed, chat with, and float transparent animated companion pets directly on their screen.

---

## 🚀 Quick Deployment Guide

### Deploying via GitHub & Vercel (Recommended)

#### Step 1: Initialize Git and Push to GitHub
```bash
# 1. Initialize git repository (if not already initialized)
git init
git add .
git commit -m "feat: complete DigiPets full-stack application"

# 2. Create a new repository on GitHub (e.g. github.com/username/digipets)
# Then link your local repo:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/digipets.git
git branch -M main
git push -u origin main
```

#### Step 2: Connect Repository to Vercel
1. Go to [Vercel New Project](https://vercel.com/new).
2. Choose **Continue with GitHub** and select your `digipets` repository.
3. Keep default build settings (`Framework Preset: Vite` or `Other`). Vercel reads `vercel.json` and `package.json` automatically.
4. Add your **Environment Variables**:
   - `GEMINI_API_KEY`: Your API key from [Google AI Studio](https://aistudio.google.com/).
   - `NODE_ENV`: `production`
5. Click **Deploy**.

---

## 🔐 Environment Variables

| Variable | Scope | Required | Description |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Server-side (`process.env`) | **Recommended** | Powers AI companion roleplay chat and image generation via `@google/genai`. |
| `NODE_ENV` | Server-side (`process.env`) | **Required** | Set to `production` in production deployment. |
| `PORT` | Server-side (`process.env`) | Optional | Server listening port (default `3000`). |
| `VITE_SUPABASE_URL` | Client-side (`import.meta.env`) | Optional | Supabase project URL for cloud persistence. |
| `VITE_SUPABASE_ANON_KEY` | Client-side (`import.meta.env`) | Optional | Supabase public anonymous API key. |

---

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm or bun

### Setup & Run
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Add your GEMINI_API_KEY in .env

# 3. Start development server (Port 3000)
npm run dev

# 4. Run type check and linter
npm run lint

# 5. Build for production
npm run build

# 6. Test production bundle
npm run start
```

---

## 🏗️ Architecture Overview

```
digipets/
├── .github/workflows/ci.yml # GitHub Actions CI automation
├── backend/                 # Express backend API routes & controllers
│   ├── controllers/         # Chat, Generation, Pet state, Upload handlers
│   ├── middleware/          # Multer upload & error handling
│   └── routes/              # /api/chat, /api/generate, /api/pet, /api/upload
├── src/                     # React 19 Frontend application
│   ├── ai/                  # Prompts & system instructions
│   ├── components/          # Companion canvas, floating engine, modal UI
│   ├── context/             # React contexts
│   ├── engine/              # 60fps Physics & float animation loop
│   ├── hooks/               # Custom state hooks
│   ├── services/            # Client API proxies
│   ├── store/               # Zustand persistent store (petStore.ts)
│   └── styles/              # Tailwind CSS v4 styling
├── public/                  # Static assets & favicon.svg
├── vercel.json              # Vercel serverless routing config
├── server.ts                # Express API gateway & Vite dev/prod server
├── tsconfig.json            # Strict TypeScript configuration
└── vite.config.ts           # Bundler & Tailwind v4 plugin setup
```

---

## 📄 License
MIT License. Feel free to use and customize for your own companion projects!
