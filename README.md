# 🛡️ RefAI Live — Rule-Grounded Sports Companion

RefAI is an ultra-low-latency, real-time AI Sports Companion and Multimodal Referee Expert. It is designed to ingest live broadcast streams, transcribe commentator vocals, track rules-critical match events, and offer instant, high-fidelity referee decisions grounded in the official **FIFA Laws of the Game**.

Built as a modern full-stack application (React SPA + Express API), RefAI provides football analysts, coaches, and passionate fans with a responsive, professional rules-verification sandbox.

---

## 🚀 Core Features & Capabilities

### 1. Grounded AI Referee Chat Workspace
* **FIFA Laws Grounding**: Unlike generic LLMs, RefAI's chatbot injects precise, context-aware rulebook excerpts from official FIFA Law books into the model prompt when analyzing queries.
* **Contextual Suggestions**: Dynamically displays situational questions based on the active event to prompt deeper analysis.
* **Confidence & Verdict Badging**: Standardizes replies with automated verdict classification (e.g. *Red Card Upheld*, *Offside Confirmed*) and confidence indexes.

### 2. Multi-Channel Commentary & Voice Monitor
* **Interactive Caption Feed**: Displays a running log of broadcaster commentary with highlights for regulatory terminology (e.g., *VAR, Offside, Penalty, Yellow Card*).
* **Live YouTube Caption Ingestion**: Pulls open caption tracks from YouTube stream links in real-time.
* **Resilient AI Commentary Generation**: If stream captions are closed or unavailable, RefAI automatically engages the Gemini model to synthesize realistic play-by-play commentaries aligned with the match's core events.
* **Web Speech Recognition Mic**: Features a direct on-field audio recorder inside the browser to dictate live vocal commentaries.

### 3. Live Broadcast Translation
* **Vocal Translations**: Instantly translate announcer commentaries into **Spanish**, **French**, **German**, **Japanese**, or **English (US)**.
* **Bulk Translation Caching**: Efficiently batches and caches translated commentary tracks to ensure zero-lag switching.

### 4. Interactive Match Clock & Event Logs
* **Simulation Timeline**: Includes a live clock ticker that unfolds key incidents, goals, fouls, and VAR checkups chronologically as the game progresses.
* **VLM Ingestion Visual Data**: Each event is accompanied by schematic structural coordinates representing tactical positional matrices.

### 5. Custom Match Generator (Ingestion Room)
* **AI Match Ingestion**: Create a custom tournament or match (e.g. *Germany vs. Italy*), paste a replay link, and watch RefAI use Gemini to dynamically synthesize 5 rules-critical timeline events and a matched play-by-play narrative.

---

## 🛠️ Technical Architecture

RefAI is built with a highly cohesive, high-performance tech stack:

### Frontend
* **React 19 & Vite**: Ultra-fast single-page application framework.
* **Tailwind CSS (v4)**: Modern, custom utility styling using a graphite/emerald dark-theme layout.
* **Motion**: Premium animations for page elements and status overlays.
* **Lucide React**: Clean vector icon symbols for a professional visual language.

### Backend
* **Express.js**: Clean, high-throughput Node.js web server.
* **Google GenAI SDK (`@google/genai`)**: Interacts directly with the state-of-the-art **Gemini 2.5 Flash** model for context generation, rules validation, and translations.
* **Youtube Transcript**: Pulls live caption streams directly from YouTube feeds.
* **Real-Time Latency Tracking**: Tracks actual round-trip HTTP request durations (in milliseconds) and displays the network's operational telemetry in the sidebar instead of using dummy/simulated latency numbers.

---

## 📁 Project Directory Structure

```text
├── api/                   # Serverless routing folder for Vercel
│   └── index.ts           # Imports and exposes the Express app as a Serverless function
├── src/
│   ├── components/        # Highly modular React sub-components
│   │   ├── Sidebar.tsx           # Active matches, audio outputs, translation, telemetry stats
│   │   ├── ChatWorkspace.tsx     # Conversation timeline, rule badges, auto-suggest inputs
│   │   ├── InsightsPanel.tsx     # Ingested stream video screen, running vocal monitor feeds
│   │   └── LawsDatabase.tsx      # Comprehensive searchable rulebook database & custom law builder
│   ├── data.ts            # Pre-seeded official tournament data (e.g., FIFA WC 2022 Final)
│   ├── types.ts           # Strictly-typed interfaces and TypeScript definitions
│   ├── index.css          # Tailwinds imports, font variables, scrollbar scroll tracks
│   ├── main.tsx           # SPA mount script
│   └── App.tsx            # Global state coordinator, timers, translation loops, layout blocks
├── server.ts              # Core Express API handlers and static file server config
├── vercel.json            # Vercel Serverless and routing configuration file
├── netlify.toml           # Netlify build hooks and SPA router redirection file
├── package.json           # Declares packages, scripts, and production bundles
└── tsconfig.json          # Standard typescript compiler settings
```

---

## ⚙️ Local Development Setup

To run RefAI locally on your system, follow these steps:

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed on your machine.

### 2. Configure Environment Variables
Create a `.env` file in the root directory (refer to `.env.example` as a template) and add your Google Gemini API key:

```env
GEMINI_API_KEY=your_actual_google_gemini_api_key_here
```

### 3. Install Dependencies
Install all package dependencies declared inside `package.json`:

```bash
npm install
```

### 4. Run the Development Server
Start the development server using:

```bash
npm run dev
```

The Express API server and Vite dev server will spin up concurrently on **port 3000** (visible at `http://localhost:3000`).

### 5. Build for Production
To bundle the frontend and compile the backend into a high-performance production distribution:

```bash
npm run build
```

This generates compiled client files inside `/dist/` and compiles your backend into a single CommonJS file (`/dist/server.cjs`).

### 6. Run the Production Build
To spin up the compiled production build:

```bash
npm run start
```

---

## ☁️ Deployment Guide

RefAI has been fully pre-configured for seamless deployment to **Vercel** or **Netlify**!

### Option A: Hosting on Vercel (Recommended)
RefAI features a native `/api/` routing structure and a `/vercel.json` redirect map.

1. **Push your code** to GitHub, GitLab, or Bitbucket.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your repository.
4. Under **Environment Variables**, add:
   * `GEMINI_API_KEY`: Your Google Gemini API Key
5. Click **Deploy**. Vercel will automatically build the React SPA, host it on their global CDN, and map the `/api/*` requests to the serverless Express function inside `/api/index.ts`.

### Option B: Hosting on Netlify
Netlify will build the frontend assets and host the static SPA, while routing deep-links correctly.

1. Create a new site on [Netlify](https://netlify.com) from your Git repository.
2. Netlify will read the `/netlify.toml` file automatically and configure:
   * **Build Command**: `npm run build`
   * **Publish Directory**: `dist`
3. In Netlify's settings, define your `GEMINI_API_KEY` environment variable.
4. Click **Deploy** to publish your live sports referee analyst.

---

## 📜 Source Attributions
* **Football Laws**: Official regulatory references sourced from the *IFAB / FIFA Laws of the Game*.
* **Commentary Feeds**: Extracted from public broadcast channels utilizing YouTube CC transcripts.
