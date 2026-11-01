# Unreal Engine virtual museum implementation plan

**Goal:** Build a real 3D portfolio gallery with framed wall images, project display tables/devices, guided selection, manual walking, project inspector, fullscreen and an accessible no-WebGL fallback.
**Architecture:** Load a separately bundled Three.js renderer only when Unreal Engine opens. Reuse the small React app lifecycle wrapper and bridge; keep the shared React bundle under 400 KiB. No realtime shadows, reflection passes, engine exports or large external models. Bound pixel ratio and render only on input/transition/texture updates. Dispose all resources and stop inactive windows.
**Tech stack:** Three.js WebGLRenderer, vanilla JS DOM UI, existing React lifecycle, portfolio assets, Cloudflare static build.

- [x] Test exhibit poses, gallery bounds, table collision and guided routes.
- [x] Build static geometry, materials, captions, wall art and device screens.
- [x] Add project navigation, inspect/preview actions, intro, fullscreen and lifecycle cleanup.
- [x] Integrate independent bundle and license; run tests, typecheck, checks and build.
- [x] Browser verify rendered gallery, selection/navigation, fullscreen and paused/idle behavior; save preview.


## Revision: multi-room white-cube architecture
- Enlarged the museum and added staggered doorways, full-height white partitions, side bays, rear wings, white lintels/piers, ceiling panels and neutral gray flooring.
- Distributed all 14 works across external walls and internal partitions; varied furniture with white display bases, a desk, bench and lectern.
- Navigation and rendered architecture share partition/furniture definitions. Tests cover door passage, solid walls and reachable poses for every work.
- Verified white-room appearance, automatic travel into the rear gallery, fullscreen, type checking and production build in browser. Shared React payload remains under its existing budget; no realtime shadows or reflections were introduced.
