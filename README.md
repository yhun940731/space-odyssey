# Cosmic Drift

Cosmic Drift is an MVP browser game for endless ambient space flight. It is inspired by the relaxing idea of travelling forever through a changing world, but it is an independent project and does not copy Slow Roads code, assets, or design.


## 현재 완성도

현재 저장소는 브라우저에서 끝없이 우주를 비행하는 Cosmic Drift MVP 요구사항을 구현한 상태입니다. 포함된 범위는 프로젝트 규칙, Vite/React/TypeScript 스캐폴딩, 기본 3D 우주 씬, 재사용형 StarField, 비행 상태 store, 키보드/터치 조작, HUD, 시작/일시정지 흐름, 설정 패널, 절차적 Web Audio ambience, bloom/vignette 후처리, reduce motion, 3인칭 플레이어 우주선, 배경 행성/성운/소행성, sector theme, 웜홀 상태 머신과 기본 웜홀 시각화입니다.

현재 MVP 체크리스트 기준으로 남은 필수 항목은 없습니다. 이후 작업은 더 풍부한 비주얼, 실제 기기별 모바일 튜닝, 번들 code-splitting 같은 polish 성격입니다.

## Features

- Full-screen Vite + React + TypeScript app rendered with `@react-three/fiber`.
- Procedural space scene with reusable star points, distant planets, soft nebula planes, and decorative asteroids.
- Zustand flight store for speed, boost, distance, steering, warp state, and sector state.
- Game state store for ready, running, and paused states.
- Persisted settings store for quality, audio, volume, bloom, and reduce motion.
- Third-person procedural player ship with banking, climb/dive motion, and engine glow.
- Keyboard and touch flight controls for left/right yaw turns, climb/dive, roll, and boost, with course-rotated background motion.
- Procedural Web Audio ambience with an in-game toggle and volume control.
- Bloom/vignette postprocessing with quality-aware fallbacks.
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
- `@react-three/postprocessing`

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

- `WASD` / `Arrow Keys`: turn left/right and climb/dive
- `Q` / `E`: bank roll
- `Space` / `Shift`: boost
- `Enter`: start or resume
- `P` / `Escape`: pause or resume
- Touch controls appear on narrow or coarse-pointer screens.

## Implemented MVP Scope

- Base project scaffolding and project rules in `AGENTS.md`.
- Full-screen canvas scene.
- Infinite-feeling star field using one `THREE.Points` object and direct buffer attribute updates.
- Procedural planet, nebula, and asteroid background fields that recycle objects instead of endlessly spawning new ones.
- Flight store and input-driven third-person camera rig.
- Ready/running/paused game flow with a minimal overlay and pause button.
- Persisted settings panel for quality, audio, volume, bloom, and reduce motion.
- Procedural ambience using Web Audio oscillators and generated noise.
- Bloom/vignette postprocessing that disables for low quality or reduce motion.
- Procedural player ship built from Three.js geometry and materials.
- Course-rotated star, planet, nebula, and asteroid motion for a clearer turning and climbing feel.
- Sector themes and automatic wormhole event progression.
- Basic HUD and documentation.

## Future Polish

- Device-specific mobile performance testing.
- Optional richer sector visuals and shader polish.
- Optional code-splitting if bundle size becomes a deployment concern.

## Performance Design Notes

- **StarField reuse:** stars are stored in a single buffer geometry and moved by mutating the `position` buffer in `useFrame`; stars that pass behind the viewer are recycled to the far front.
- **Object pooling:** planets, nebulae, and asteroids keep stable React objects and recycle their positions after passing the camera.
- **Quality profiles:** low, medium, and high settings adjust DPR, antialiasing, and repeated object counts.
- **Reduce motion:** camera shake, warp star stretching, postprocessing, and wormhole spin are reduced or disabled.
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
