# Cosmic Drift Project Rules

## Project Goal
- Build a browser-based endless ambient space flight game.
- The project may be inspired by the endless, relaxing travel feeling of Slow Roads, but must not copy its code, assets, or design.
- The player should feel like they are drifting through infinite space.
- Stars, planets, nebulae, and asteroids are decorative background elements.
- Warp/wormhole events should occur at distance intervals.
- The goal is a meditative flight experience, not racing or combat.

## Tech Stack
- Vite + React + TypeScript
- Three.js
- @react-three/fiber
- @react-three/drei
- zustand
- @react-three/postprocessing
- Prefer procedural geometry/materials instead of external assets.

## Development Rules
- Implement one clear feature per task when possible.
- `npm run build` must pass after each task.
- Do not leave TypeScript errors.
- Place components in `src/components`, state in `src/stores`, systems logic in `src/systems`, utilities in `src/utils`, and shared types in `src/types`.
- Do not create unbounded new 3D objects during gameplay; prefer reuse/object pooling.
- Use `InstancedMesh` or `Points` for stars and small repeated objects when practical.
- Initial MVP targets desktop browsers; mobile support can come later.
- Avoid complex shaders at first; make simple implementations work before polishing.

## Completion Report Rules
At the end of a task, report:
- Changed files
- Feature summary
- Validation commands run
- Remaining TODOs
