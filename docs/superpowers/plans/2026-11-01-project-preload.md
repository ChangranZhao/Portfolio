# Full Project readiness implementation plan

Goal: show a localized progress gate before reading a Full Project. Prepare all retained boards, their images, fonts and animation scripts without doing initialization during scrolling. Keep project layouts, Classic/Glass, and all long-page content.

- [x] Add regression tests for bounded preload scheduling, cancellation, failed-image retry and preparing offscreen boards without unloading them.
- [x] Extend `dist/board-performance.js` with an explicit prepare-all event, declared board URLs, and paused animation state during preparation. Keep normal two-frame concurrency and scroll pauses.
- [x] Add `dist/project-preload.js`: bounded asset preparation, same-origin HTML frames, image decode, font readiness, real progress, abort and failure reporting. Exclude streamed videos, PDFs and external embeds.
- [x] Add `dist/project-loading.js` and CSS: accessible localized overlay, retry/explicit continue, close cancellation, no forced artificial delay, readiness event.
- [x] Integrate with `dist/project-details.js`, and gate culture/Changzhi activity while preparing. Existing project HTML and images remain mounted.
- [x] Run targeted regression tests, resource checks and production build. Browser-check a long iframe project plus a native project, progress, ready state, close and repeat opening. Inspect published assets and console.

Readiness means initial local project content is ready, not a guarantee of hardware frame rate or third-party streaming readiness. Subsequent opens reuse normal HTTP cache; live scroll work remains bounded.

Ruling: SVG paint-server fragments are local definitions, not image requests; ignore plain and percent-encoded hash references. A browser regression revealed the distinction.

Ruling: Native-page CSS animations also pause offscreen, while scrolling and in background windows. All reading elements stay mounted. Covered in project-activity.test.mjs.

Validation: check:release passed (140 tests, typecheck, JavaScript/resource checks and Cloudflare build). Browser checked all 14 project variants; Space 12 boards, Spectral 21, Echo 14, Changzhi 16, Mimesis 7 and Gaia 7 all prepared before entry. Wind from the East had 168 native images loaded, including after jumping to Exhibit Details. Confirmed close during Spectral preparation removes the gate and reopening succeeds. Verified light Classic and restored the original dark Glass preference.
