# Cosmic Drift

Cosmic Drift is an MVP browser game for endless ambient space flight. It is inspired by the relaxing idea of travelling forever through a changing world, but it is an independent project and does not copy Slow Roads code, assets, or design.

## Features

- Full-screen Vite + React + TypeScript app rendered with `@react-three/fiber`.
- Procedural space scene with reusable star points, distant planets, soft nebula planes, and decorative asteroids.
- Zustand flight store for speed, boost, distance, steering, warp state, and sector state.
- Keyboard flight controls for steering, roll, and boost.
- Sector themes that alter background, stars, nebulae, and planet palettes.
- Automatic wormhole state machine: `idle -> approaching -> entering -> tunnel -> exiting -> idle`.
- Geometry-based wormhole portal that grows and fades according to event state.
- HUD showing speed, distance, sector, boost, warp status, and controls.

## Tech Stack

- Vite
- React
- TypeScript
- Three.js
- `@react-three/fiber`
- `@react-three/drei`
- zustand
- `@react-three/postprocessing` is installed for future bloom/vignette polish.

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

Open the printed local URL in a desktop browser.

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Controls

- `WASD` / `Arrow Keys`: steer
- `Q` / `E`: roll
- `Space` / `Shift`: boost

## Implemented MVP Scope

- Base project scaffolding and project rules in `AGENTS.md`.
- Full-screen canvas scene.
- Infinite-feeling star field using one `THREE.Points` object and direct buffer attribute updates.
- Procedural planet, nebula, and asteroid background fields that recycle objects instead of endlessly spawning new ones.
- Flight store and input-driven camera rig.
- Sector themes and automatic wormhole event progression.
- Basic HUD and documentation.

## Not Yet Implemented

- Start/pause flow.
- Audio toggle and procedural Web Audio ambience.
- Settings panel with persisted quality/reduce-motion preferences.
- Bloom/vignette postprocessing tuning.
- Optional player ship silhouette.
- Mobile controls and mobile performance tuning.

## Performance Design Notes

- **StarField reuse:** stars are stored in a single buffer geometry and moved by mutating the `position` buffer in `useFrame`; stars that pass behind the viewer are recycled to the far front.
- **Object pooling:** planets, nebulae, and asteroids keep stable React objects and recycle their positions after passing the camera.
- **Procedural assets:** the MVP uses built-in geometries, materials, seeded random placement, and generated canvas textures instead of external image/model/audio assets.
- **Transparent objects:** nebula count is intentionally small to avoid overdraw-heavy scenes in the MVP.

## Deployment

For Vercel, import the repository and keep the default Vite settings:

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

No custom Vite `base` is required for a default Vercel deployment.

## License / Attribution Note

This project may be conceptually inspired by the calm endless-travel feeling of Slow Roads, but it is an independent implementation. It does not copy Slow Roads source code, assets, art direction, or proprietary design.
