# Repository Guidelines

## Overview
This repository contains **Nihongo-App**, a React + Vite web app that also ships as a **Capacitor iOS/Android** app. The UI is mobile-first and must use the design-token system defined in `src/styles/Global.css`. Firebase (Auth + Firestore) is used for user data, XP, and ranking.

## Project Structure
- `src/`
  - `pages/` : routed screens (e.g. RankingPage)
  - `components/` : app components
  - `components/ui/` : reusable UI primitives
  - `styles/` : global + page/component CSS
  - `store/` : Zustand global state (`useAppStore.jsx`)
  - `firebase/` : Firebase initialization (`firebase-config.js`)
- `public/` : static assets
- `capacitor.config.*` : Capacitor configuration
- `dist/` : build output (ignored by git)

## Key Commands
- `npm run dev` : local dev server (Vite)
- `npm run build` : standard build
- `npm run preview` : preview built output
- `npm run lint` : ESLint check
- GitHub Pages:
  - `npm run build:gh` : build for GH Pages + create `404.html` and `.nojekyll`
  - `npm run deploy` : deploy `dist/` to `gh-pages` branch
- iOS (Capacitor):
  - `npm run ios` : build (app target) → `cap copy ios` → open Xcode
  - `npm run sync:ios` : `cap sync ios` only

## Build Targets / Base Path
- `vite.config.js` currently uses `base: "/"`.
- GH Pages usually needs a repo base path. If you adjust base behavior, ensure:
  - Web (Netlify/iOS) works with `/`
  - GH Pages build (`build:gh`) routes correctly (404 fallback is already created)
- Any change here should be tested with both `preview` and GH Pages deploy.

## Coding Style & Conventions
- React components use **.jsx**.
- Use `@` alias for `src` imports (configured in `vite.config.js`).
- Keep code ESLint-friendly (`npm run lint` must pass).
- Prefer small pure helpers and keep async operations cancel-safe where relevant.

## UI / CSS Rules (Important)
- **Do not hardcode colors or raw px** in UI styling when tokens exist.
- Use tokens in `src/styles/Global.css`:
  - spacing: `--space-*`
  - radius: `--radius-*`
  - border: `--line-1`
  - shadow: `--shadow-*`
  - motion: `--motion-*`
  - colors: `--color-*`
- Must support dark mode via `[data-theme="dark"]`.
- Mobile-first layout; ensure it doesn’t break at 320–414px widths.
- Accessibility:
  - keyboard focus must be visible (`:focus-visible` already defined globally)
  - use proper `aria-*` where needed

## Firebase Notes
- Firebase is initialized in `src/firebase/firebase-config.js`.
- Firestore stability on iOS/Capacitor:
  - long polling is enabled via `initializeFirestore` options.
  - For read-only, network-stability-priority screens, prefer `dbLite` (Firestore Lite / REST).
- Auth persistence:
  - `ensureAuthPersistence()` sets IndexedDB persistence when possible, otherwise falls back to localStorage.
- Zustand (`src/store/useAppStore.jsx`) stores:
  - `user` snapshot in localStorage (`auth.user`)
  - `authReady` flag for “Auth restoration completed”
  - XP totals keyed by uid

## Git / Branching
- Create a topic branch for fixes:
  - `git checkout -b fix/<topic>` (example: `fix/ranking-auth`)
- Commit messages:
  - concise, imperative, scoped (e.g. `Fix: ranking fetch on iOS` / `WIP: ...`)

## PR / Review Checklist
Before merging:
- `npm run lint` passes
- Ranking/Auth flows confirmed on:
  - web (Vite dev + preview)
  - iOS simulator/device if changed
- UI checked on light/dark themes and narrow width