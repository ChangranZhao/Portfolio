# Figma portfolio workspace implementation plan

**Goal:** Match the supplied editor layout: project tabs, board list, zoomable multi-board canvas, selection inspector.
**Architecture:** Keep catalog and localization. Native transform canvas supports pointer pan, anchored zoom, fit all/selection and photo Quick Look. Static sandboxed boards and photos lazy load; no editor framework. Panels inherit Classic/Liquid and light/dark; canvas stays dark.
**Tech stack:** React, TypeScript, CSS, existing portfolio API.

- [x] Inspect catalog and window integration.
- [x] Implement tabs, modes, canvas and inspector in Figma.tsx.
- [x] Add scoped figma-workspace.css and translations.
- [x] Typecheck, resource checks and deployment build.
- [x] Browser verify switching, fit/zoom/pan, boards and photo Quick Look; save screenshot.

