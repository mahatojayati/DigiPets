# Digital Pets — Step 1: Project Foundation & Landing Page

Digital Pets is an AI-powered desktop companion application where users can bring transparent animals or characters to life to keep them company while they browse.

This repository implements **Step 1: Project Foundation & Landing Page**. It contains a beautiful, modular, fully responsive frontend, a solid Express.js full-stack server integration, and persistent local storage companion state managers.

---

## 🎨 Design Theme & Style Guidelines

Blends clean, high-contrast layouts inspired by modern utilities (such as **Notion**, **Linear**, **Raycast**, and **Discord**) with soft, playful, child-friendly **Nintendo aesthetics**.

- **Playful details**: Soft shadows, generous padding, curved corners (`rounded-2xl` / `rounded-xl`).
- **Interactive motion**: Staggered slide-ins, spring-based hover feedback, bouncy loader indicators.
- **Accents**: Soft pastel color themes (coral pink, mint green, warm yellow, sky blue, magic purple).

---

## 🏗️ Folder Structure

The project has been organized according to strict modular architecture principles:

```
digital-pets/
├── server.ts                    # Full-stack Express server with Vite middleware support
├── package.json                 # Project dependencies, scripts, and build tasks
├── metadata.json                # Project branding metadata
├── src/
│   ├── main.tsx                 # Client app mounter
│   ├── App.tsx                  # Main app flow, landing wizard, and companion dashboard
│   ├── index.css                # Global styles, Tailwind CSS entry
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx       # Standard brand top navigation bar
│   │   │   ├── Footer.tsx       # Licensing & credential indicators
│   │   │   └── PageContainer.tsx # Common margin/alignment wrapper
│   │   │
│   │   ├── hero/
│   │   │   └── Hero.tsx         # Display title and animated subtitle header
│   │   │
│   │   ├── cards/
│   │   │   ├── Card.tsx         # Base card container
│   │   │   ├── UploadCard.tsx   # Custom image loader card with drag-and-drop
│   │   │   └── GenerateCard.tsx # Prompt-based AI builder configuration card
│   │   │
│   │   ├── buttons/
│   │   │   ├── PrimaryButton.tsx # Primary action button with multi-theme support
│   │   │   └── SecondaryButton.tsx # Standard secondary outline trigger
│   │   │
│   │   ├── ui/
│   │   │   ├── Modal.tsx        # Framer Motion animated modal container
│   │   │   ├── Tooltip.tsx      # Hover tooltip guide
│   │   │   ├── LoadingSpinner.tsx # Playful bouncy loading indicator
│   │   │   └── SectionTitle.tsx # Page subtitles helper
│   │   │
│   │   └── illustrations/
│   │       ├── FloatingBackground.tsx # Soft slow-drift background decorations
│   │       └── Logo.tsx         # Animated brand logo
│   │
│   ├── context/
│   │   └── PetContext.tsx       # Companion state manager (localStorage sync)
│   ├── hooks/
│   │   └── usePet.ts            # Custom context consumer hook
│   ├── styles/
│   │   └── colors.ts            # Theme palette coordinates
│   └── lib/
│       ├── constants.ts         # Preset prompts and threshold limits
│       └── helpers.ts           # Validation and formatting functions
└── README.md
```

---

## 🛠️ Tech Stack & Development

### Frameworks & Libraries
- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express v4, Vite development server
- **Bundler & Compiler**: Vite, `esbuild` (bundling TypeScript server)

### Scripts
Run the following development commands in the workspace root:

- **`npm run dev`**: Starts the full-stack server on port `3000` via `tsx` (TypeScript Execute).
- **`npm run build`**: Compiles static client-side pages (`dist/`) and bundles the TypeScript backend server into a single production-ready `dist/server.cjs` file using `esbuild`.
- **`npm run start`**: Runs the production-built bundle via `node dist/server.cjs`.
- **`npm run lint`**: Validates Type declarations.
