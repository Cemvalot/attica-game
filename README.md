# Attica Expo – Sustainability Games

Tablet-first interactive sustainability kiosk for primary school children (Greek UI). Three mini-games (~3–5 minutes), no backend, Vercel-ready.

## Run locally

```bash
npm install
npm run dev          # LAN: http://<your-ip>:5173
npm run dev:local    # localhost only
```

## Build & deploy

```bash
npm run build
npm run preview -- --host
```

Deploy on Vercel: preset **Vite**, output `dist`.

## Games

1. **Σύνδεσε τον SDG με τη δράση** — tap SDG, tap action, SVG connection lines, check answers  
2. **Ποιος SDG ταιριάζει;** — match illustrated scenes to exact SDG sets  
3. **Eco Speed Challenge** — 30s rapid good/bad decisions with flat SVG cards  

## Scoring

- Each game contributes **33.3%** of the total  
- Final score rounded to nearest **10** (e.g. 67% → 70%)  
- Badges: **Eco Explorer** (0–30), **Planet Protector** (40–70), **Eco Hero** (80–100)  

## Structure

```
src/
  App.jsx
  data/games.js, sdgs.js
  assets/illustrations/   # flat SVG React illustrations
  components/
    HomeScreen, GameMenu, FinalScreen, …
    games/GameConnectSDG, GameMatchSDG, GameEcoSpeed
  hooks/useInactivity.js, useGameExit.js, useConnectionLines.js
```

## Customize

- Replace SVG components in `assets/illustrations/Illustrations.jsx` with WEBP/SVG files in `public/`  
- Add official UN SDG icons under `public/sdg/`  
- Edit copy and game data in `src/data/games.js`  

Kiosk: games 1–2 stay on screen until the player exits; game 3 ends when its timer runs out.
