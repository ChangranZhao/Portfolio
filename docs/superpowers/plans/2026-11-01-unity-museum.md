# Unity pixel museum implementation plan

**Goal:** Build a top-down pixel museum inside Unity with keyboard/click navigation, project exhibits, inspector, visited progress and minimap.
**Architecture:** Small React lifecycle wrapper loads a standalone Canvas engine on demand through the bridge. Procedural pixel scenery and thumbnail artworks avoid game-engine downloads. The scene repaints only while moving or after an event; hidden/inactive windows pause and disposal releases listeners and assets. Keep other applications and Full Project styles unchanged.
**Tech stack:** Canvas 2D, JavaScript model, React wrapper, existing project API and shell materials.

- [x] Test map connectivity, collision, routing, proximity and bounded movement.
- [x] Implement low-resolution pixel scenery, avatar, rooms, exhibits and minimap.
- [x] Integrate inspector, hierarchy shortcuts, bilingual UI, touch controls and lifecycle pause.
- [x] Typecheck, model tests, deployment build and browser gameplay verification.


## Revision: irregular map, proximity triggers and Unity editor panels
- Replaced the symmetric map with differently sized connected room footprints, garden, pond, bridge and winding paths.
- Each exhibit owns a solid rectangular collider and a separate larger proximity trigger; nearby project content updates automatically without clearing the route.
- Added Scene/Game tabs (collider overlays in Scene), Project asset strip, factual interaction Console, and Inspector component information.
- Verified six model tests, actual 14-project routes, type checking, resource checks, production build and browser TriggerEnter behavior with no console errors.

## Revision: readable walls, fullscreen exploration and entrance guide
- Strong light coping, dark masonry faces, foot shadows and terrain-edge strokes make blocked boundaries legible, without modifying navigation geometry.
- Added a short, reduced-motion-aware entrance reveal with keyboard/mouse/proximity/map instructions, start and fullscreen actions, and a reopenable guide.
- Fullscreen hides editor panels while keeping game and inspector; supports native fullscreen and a viewport fallback, with exit/cleanup restoration.
- Verified six collision/navigation tests, resource checks, production build, guide start/reopen, fullscreen enter/exit and editor restoration in browser; no console errors observed.
