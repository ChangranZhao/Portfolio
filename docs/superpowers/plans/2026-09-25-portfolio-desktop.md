# macOS Portfolio Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Recreate the supplied desktop as an interactive portfolio using the supplied project assets.
**Architecture:** A static application with a generated asset manifest, independent desktop/window/gallery modules and CSS. Source media remains untouched; optimized copies are generated for browser use.
**Tech Stack:** HTML, CSS, browser JavaScript modules, Python/Pillow for asset preparation, Node for local serving and state tests.
**Spec:** ../specs/2026-09-25-portfolio-desktop-design.md

## Global Constraints
- Use supplied assets and supplied facts; do not invent project histories or contact information.
- Preserve the reference composition, responsive access and reduced-motion support.
- Keep the website in 建站 and source materials untouched.
- User reaffirmed implementation after the written design; execute inline in this task.

## Review Focus
- Reopening minimized windows must restore them without duplicating them.
- Window dragging and viewport changes must keep controls reachable.
- Deep gallery navigation must preserve the correct project and image.
- Mobile layout must expose every project without horizontal overflow.
- Every asset URL must resolve; full-size work must remain readable.

## Task 1: Asset catalog
- [x] Scan project directories, inspect contact sheets and introductions.
- [x] Create scripts/prepare_assets.py to generate dist/assets and dist/data.js.
- [x] Include all project images, text and the supplied PDF; order covers and numbered pages naturally.
- [x] Verify every manifest path exists and thumbnail dimensions are bounded.

## Task 2: Desktop and window interactions
- [x] Create dist/index.html, dist/styles.css, dist/app.js, dist/windows.js, dist/state.mjs.
- [x] Write tests/state.test.mjs first for reopen, minimize/restore, close and coordinate clamping; run with node --test.
- [x] Implement the state module; rerun the tests.
- [x] Build the desktop/menu/Dock, draggable multiwindow UI, galleries, project list, About, tool panels and keyboard navigation.
- [x] Use a static Node server, confirm HTTP response and show the first complete desktop preview.

## Task 3: Verification and delivery
- [x] Exercise actual UI at desktop and mobile sizes; check imagery, keyboard controls, window actions, gallery and menus.
- [x] Run JavaScript syntax checks, state tests and complete asset reference validation.
- [x] Perform independent code review while completing local browser verification.
- [x] Document preview and asset refresh; deliver the working preview with honest limitations.

## Execution ledger
Ruling: use a standalone static site in the existing empty 建站 folder; no repository or worktree exists to isolate. Preserve source assets. The user's repeated request to build is authorization to proceed with the agreed design without another permission round.

Task 1: complete — 10 projects / 155 images / 12 Dock icons; 324 resource references verified.
Task 2: complete — window-state tests 4/4 passing; desktop and mobile browser flows passing, no page errors.
Task 3: local verification complete — independent review reported four functional issues, all fixed. Reopen Gallery, keyboard restoration and Dock overflow reproduced as failures then passed. Maximize/resize restoration also verified. Screenshots checked at 1600×900 and 390×844. Private deployment in progress.
Ruling: ignored Apple archive metadata files (._ files / __MACOSX), which are not images. Kept original assets untouched.
