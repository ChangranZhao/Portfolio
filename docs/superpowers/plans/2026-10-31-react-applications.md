# Creative OS React applications implementation plan

**Goal:** Deliver a playful macOS-style portfolio with React applications while preserving the independently designed Full Projects.
**Architecture:** Incremental React roots hosted by the existing window manager. A typed app registry, common sidebar/toolbar, own localization boundary, and lazy application bundle. Existing project readers and image lightbox are connected through an adapter. Production remains static Cloudflare Pages output in site/.
**Tech Stack:** React, TypeScript, esbuild, existing image optimization pipeline.
**Spec:** User approved React migration and requested portfolio/About/Figma/Cursor/Photos; retain light/dark and all Full Project styling and reading state.

## Constraints / rulings
- Edit the explicit user checkout; preserve unrelated pending changes. No deployment or git commit in this task.
- No long-page unloading, performance mode, invented project claims or generated portraits.
- React mounts use data-no-localize; language updates rerender through the preference event, avoiding external text mutation.
- Use real public source files in a curated read-only code viewer. No backend/editor execution or simulated AI responses.
- React runtime loaded only when an application opens. Source snapshots are fetched only inside code viewer. Retain Cloudflare 25 MiB guard and image pipeline.

## Tasks
- [x] Typed React host, registry, shared visual primitives, localization; regression tests for reopening/unmount and model behaviors.
- [x] Finder portfolio, settings-like About, Photos albums/favorites/zoom, Figma board browser, Cursor code reader, differentiated remaining tool workspaces.
- [x] Route desktop/menu/Dock entries to the React applications. Preserve legacy Full Project/browser and settings.
- [x] Production compile, typecheck, unit/integration suite, resource verification and actual browser checks in both themes.
- [x] Fresh whole-change review, fix material findings, screenshots and delivery.

## Execution ledger
- Initial audit: existing window engine already handles animation and focus; application content can migrate without duplicating that engine. Profile facts will be extracted from existing profile module into shared data.

- Implemented React + TypeScript roots for Projects, About, Photos, Figma, Cursor/VSCode and the remaining media/notebook applications. Existing window manager, Dock identities and independent Full Project readers remain integrated through the adapter.
- Added shared application materials for both themes, window-width responsive layouts, language boundaries, real board localization, persistent photo favorites and local notes. Existing project facts and public source snapshots are reused.
- Independent review found three material state issues (repeated About routing, repeated search focus and asynchronous Figma catalog selection). Fixed each with regression coverage; reviewer rechecked and found no remaining material issue.
- Browser QA: light/dark, English/Chinese, album switching, favorite filtering, full-size image viewer, project search/inspector, Cursor source search, minimize/restore without duplicate windows, notebook close/reopen persistence, media workspace project switching, real Figma board pagination and existing Full Project navigation. Browser error/warning log empty on final inspection. Test favorite and note changes restored.
- Small follow-up corrections from visual QA: clamp inspector summaries to keep actions visible, adapt layout to application width, label the Gaia cover, clarify About counts, start source search at the first result and report failed note persistence accurately.
- Final validation: production build succeeds; TypeScript succeeds; all 53 tests pass; syntax/resource check verifies 14 projects, 176 gallery images and 726 local references. Production verification reads all 2,289 images and validates 704 responsive widths.
- Deployment output remains site/. React applications are outside the startup dependency graph (77.6 KiB gzip measured locally); source snapshots load only in the code viewer. Fingerprinted assets receive a single immutable policy, HTML revalidates. Image optimization and the Pages file-size guard remain active.
- Screenshots saved under C:/Users/20135/Documents/Codex/: creativeos-react-about.png, creativeos-react-photos.png, creativeos-react-cursor.png, creativeos-react-figma.png.
- Delivery scope: first React application layer, not a full replacement of the desktop/window engine. Figma is a static board browser, code is read-only, and notes remain in this browser. No commit, push or deployment performed.
