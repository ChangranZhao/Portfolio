# Desktop polish implementation plan

Approved scope: first-round macOS shell polish from the preceding comparison. Existing vanilla JS/CSS, no dependencies. Preserve startup, project content, photo arrangement/drift, localization, reduced motion, mobile navigation and all loaded reader documents.

Design: shared restrained light materials and typography for shell only; continuously distance-based Dock magnification with no layout writes per frame, cached geometry, frame-time interpolation and idle stop; cancellable window minimize/restore toward corresponding Dock entry. Keep frame-batched dragging. Use existing checkout and preserve previous uncommitted work; no push/deploy.

- [x] Add tested bounded Dock geometry and cancellable motion helper.
- [x] Integrate Dock pointer/focus updates, running indicators and window targets.
- [x] Apply scoped shell visual rules, avoiding project interiors and mobile overrides.
- [x] Test full suite, build and browser screenshots; fresh final review under executing-plans.

Review focus: reverse minimize before completion; multiple minimized entries; overflow/touch/reduced-motion; window close while animating; dynamic resize and reader scroll retention.

Verification: 33 automated tests passed, including reversal, interrupted close and reduced motion. Source check passed (726 resource references). Production build and image validation passed (2289 readable published images, 704 responsive width descriptors). Browser verified minimize/restore retaining selected gallery image, sidebar switch retaining one window, and distance-based Dock transforms via keyboard focus. Final 1280x720 screenshot: C:/Users/20135/Documents/Codex/desktop-polish-preview.png. Fresh review found no important issue; its missing interrupted-close regression was added and passed. No comparative FPS claim or deployment made.
