# Glass appearance and onboarding

**Goal:** Preserve globally translucent content while making controls, edges and reading hierarchy consistent; add a dedicated appearance step to the guide.

**Design:** Dark defaults match the user's reference: transparency 36%, refraction 71%, blur 5px. Light starts at 28%, 60%, 8px with dark text and a denser neutral white tint. Store independent preferences for resolved light/dark themes. Migrate legacy settings into the active theme without discarding custom values. Reset affects only the current theme. Classic remains available.

**Architecture:** Keep the pre-paint glass controller as the source of truth; settings and guide use it. A six-step guide separates appearance from language/window preferences. Live sliders preserve focus; theme/material changes update the same preview. No additional nested optical filters, libraries or continuous animation.

**Implementation plan:**
- [x] Test and implement theme defaults, persistence, migration and reset in glass-settings.js; sync on theme changes before paint.
- [x] Add a dedicated appearance step, responsive preview and live material controls in the guide; preserve all existing guide steps and localization.
- [x] Unify subtle rims, inset lines, radii, focus/disabled states and settings sidebar icon tiles; retain translucent content and editorial project styles.
- [x] Run relevant tests, typecheck and build; verify dark/light, Classic/Glass, slider persistence and guide navigation in the browser.

**Verification risks:** unavailable storage, malformed/legacy preferences, system theme changes, small viewport/keyboard focus, repeated guide openings without retained listeners.

**Results:** 11 focused tests passed; typecheck, resource/syntax checks and production build passed. Browser checked all six guide steps, dark/light defaults, Classic/Glass switching, slider keyboard focus, reload persistence and no horizontal overflow at the desktop viewport. Native guide dialogs retain CSS blur because SVG backdrop sampling made the modal too dark. No Cloudflare deployment performed.
