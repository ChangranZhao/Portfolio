# Terminal Portfolio Runner Implementation Plan

> Implement inline in the existing checkout; preserve unrelated work.

**Goal:** Replace the default Terminal view with a lightweight ASCII platform game built from real portfolio project names, while retaining a command-line tab.

**Architecture:** Pure deterministic physics in `runner-model.mjs`; a bounded Canvas text renderer in `runner-draw.ts`; React controls and lifecycle in `Terminal.tsx`. The existing window manager owns focus, closing, and Dock identity (`terminal`). No game engine, images, remote fonts, audio, or network requests.

1. Add `tests/terminal-runner.test.mjs`, implement model, verify jump/landing, checkpoints, game over/win and frozen pause.
2. Add Canvas ASCII rendering and keyboard/touch input. Run a fixed-step simulation only while playing in the active visible window; cancel RAF on pause, blur, minimize, close, hidden tab, and unmount. Cap DPR at 1.5 and React HUD updates at 5 Hz. Preserve world state on resize.
3. Register Terminal in the React app registry and bridge; replace the legacy inline terminal handler, retaining window id and all existing Dock restore/close paths. Add scoped CSS compatible with both materials.
4. Implement command-line `help`, `ls`, `open <id>`, `about`, `clear`, `play`. Add gameplay start/retry/pause, automatic running, optional project navigation, and clear control hints.
5. Type-check, run model and affected app/window tests, build, then browser-test keyboard movement/jump, pause/restart, shell commands, project links and close cleanup. Save a visible proof screenshot. Source video could not be inspected, so do not claim an exact reproduction.
