# Runtime performance implementation plan

Goal: improve interactions on busy laptops while retaining the current visual design.
Spec: user-approved directions in this conversation (2026-10-30). No fluent/performance mode; never unload visited chapters, their images, or scroll positions. Preserve music/video coordination and source images. No publish or commit in this task.

Architecture: coalesce pointer updates, pause animation clocks in inactive views, defer YouTube initialization until an explicit click, chunk translation work, and resize only published photographs. Keep the existing vanilla JavaScript and build pipeline.

- [x] Window input: test latest-pointer coalescing and release flush; cache dimensions at gesture start and move via translate; resize at most once per frame.
- [x] Activity: test paused logical time, timer/RAF cancellation and resume; apply window activity to retained board animations; use activity clocks for scripted reveals.
- [x] Video: test that no iframe/API is loaded before click and only one player is created; integrate covers for main projects and three standalone film boards; maintain same-origin music events.
- [x] Translation/images: process mutation translations in bounded batches; skip unchanged typewriter updates; cap ordinary photos at 1600px but keep tall diagrams at the existing readable limits; verify aspect ratio and alpha.
- [x] Validation: run regression suite, source checks, production build and asset audit; inspect browser when available. Record pre-existing failures and limitations. Review final changes separately.

Review focus: release before next animation frame; minimized page restoring at same location; video ended/error/closed music recovery; text diagrams retaining clarity; deferred modules and CSS in generated publication.


Validation evidence (2026-10-30):
- npm test: 24/24 passing. Updated the previously stale 44-board expectations to include the three existing film chapters; film checks now cover their deferred player and local poster.
- npm run check: 14 projects, 176 images, 726 local references; syntax/resource checks passed.
- Production build: 2,950 referenced files, 23 stylesheets bundled into one. 1,359 converted images total 127.2 MiB; all 2,289 published raster entries total 139.34 MiB (previous build 154.80 MiB).
- check-production: all published raster files readable; 704 srcset width descriptors verified against actual pixels; 41 NEURO previews present.
- Built reference audit: 5,093 checked, zero missing.
- Separate review caught and resolved NEURO poster scope, film poster/lightbox interception, and initial about:blank activity-state issues.
- Local IAB: NEURO full project completes, two facades and zero YouTube iframes before click; ten film photos decoded at 1280x720 after scrolling; drag commits position with no retained translate; minimize/restore keeps content and reading position. Spectral poster click initializes its player without opening the lightbox; no console errors during check.
- Limits: no representative low-end hardware CPU/FPS trace or measured speedup; background music event behavior covered by regression tests, not an audio-output recording. Changes are local; no commit, push or deployment.
