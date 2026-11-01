# Liquid Glass appearance controls and first-paint fix

The optical runtime previously marked a surface `liquid-optical` before React committed its glass children, disabling the CSS blur while the optical layer was still empty. Newly visible menus/windows were discovered on a later animation frame, and resize rendering could also replace filters asynchronously.

Mount/resize now commit the optical layer synchronously from a batched mutation microtask, then disable the CSS fallback. Both paths use the same blur setting. User parameter updates reuse the existing filter instance. Active-surface limits and disposal remain intact.

A pre-style preference script restores transparency (0–100%), refraction (0–200%, relative strength), and backdrop blur (0–30 px). Defaults now follow the resolved theme: dark 36%, 71%, 5px; light 28%, 60%, 8px. Each theme saves its own values in the version 2 preference store. Legacy values migrate into the active theme; reset only changes the active theme. Settings > Appearance and guide step 2 share this controller. Controls affect glass surfaces only; text and project artwork opacity stay unchanged. Classic stores the settings without applying the material.

Verification: 29 focused lifecycle/material/application tests, TypeScript and syntax/resource checks passed. Regression tests cover committed optics before CSS fallback removal, newly opened surfaces before an animation frame, parameter changes without remounting, zero blur, storage reload and invalid/unavailable storage.

Earlier first-paint verification: opening Finder already had its optical layer while `.opening` was present; opening the top menu also had its optical layer immediately. Slider extremes produced 0 px / 30 px blur and zero / doubled SVG displacement in both windows and Dock. Refresh restored all three values. Classic removed all optical roots and retained its opaque material.

The guide now has six steps, with appearance separated from language and window preferences. The native guide dialog uses CSS backdrop blur to avoid top-layer SVG sampling artifacts; ordinary windows retain bounded optical refraction. Guide controls dispose event listeners when leaving the step. The visual pass preserves transparent content, adds restrained directional rims and inner shadows, unifies selected/focus/disabled states, and gives Settings a consistent set of colored icon tiles. No extra dependency or continuous animation was introduced.
