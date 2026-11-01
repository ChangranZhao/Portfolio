# Thanas interaction fidelity

User approved direct implementation. Keep portfolio content and independent Full Project styles, both appearances, and existing performance constraints.

- Unify window and desktop traffic lights; individual hover symbols, focus and pressed states.
- Match restrained window opening; coordinate first React commit with reveal, bounded loading fallback.
- Match Dock material and responsive magnification; move base and separators with icons, no idle animation loop.
- Integrate React sidebar chrome; layered search fields, fine dividers, selected states and app accents.
- Add contextual, keyboard-operable application menus with working window actions.
- Verify behavior tests, types, production build, desktop/narrow appearance and interactions. One independent review after implementation.

Reference: locally inspected public Thanas-R/Thanas-OS source and user screenshots. Implement independently using existing native shell, without adding GSAP or replacing project documents.

## Completed

- Shared SVG traffic controls, individual 1.1× hover/focus and pressed feedback; desktop title uses the same controls.
- 0.95→1 / 300ms opening, first React commit reveals the shell; 180ms loading fallback, close cancellation and focus preservation.
- Responsive 1.5–1.8× Dock magnification constrained by real viewport room, bottom anchoring, interpolated base/dividers, layered inset/outset shadows and responsive corners.
- Integrated sidebar title controls, app-specific selection materials, search focus rings, subtle borders/shadows, retained light appearance and narrow layout.
- Contextual application/File/View/Window/Help menus; real open/close/minimize/restore/search/desktop commands, hover switching and keyboard navigation.

Initial ruling (superseded in the second pass): Dock blur was 40px. The user's subsequent exact-detail request led to matching the reference's 120px on the small Dock surface, while retaining a settled/no-idle-animation scheduler. Existing icon-size preference stays authoritative.
Ruling: retain framework and existing independent project documents — this task unifies shell behavior rather than replacing the content renderer.

Verification: 59 tests passed; TypeScript and JavaScript/resource checks passed. Production build passed; 2,289 publication images decoded, 704 responsive width descriptors verified. React remains 77.6 KiB gzip and deferred. Live browser checked both appearances, menu keyboard navigation, application launch, minimize/restore, Dock expansion (47.64px each side in sampled state), control focus glyph/1.1 scale and 640px layout. Browser error log empty.

Independent review findings fixed: narrow titlebar padding/toolbar specificity, focus after deferred reveal, menu dismissal on focus departure. Behavior regression tests added for focus and menu lifecycle.

Screenshots: C:/Users/20135/Documents/Codex/creativeos-thanas-light.png and creativeos-thanas-dark.png. Local preview rebuilt; no commit, push or deployment performed.

## Second comparison pass

User requested another comparison with the target, including operational details. Refetched current MenuBar.tsx and ControlCenter.tsx from the upstream repository. Live target IAB navigation timed out again; source parity is distinguished from live verification.

Additional differences corrected:
- Menus open on initial pointer entry, switch on hover, and dismiss when the pointer moves far below the bar. Shared popover event keeps brand/application menus and Control Center exclusive.
- Added Edit commands with shortcut hints and traditional Chinese labels. Browser-restricted paste reports that the keyboard shortcut is needed.
- Dock launches bounce on repeat clicks too, using bounded reference fallback displacement and duration.
- Green control uses the reference square glyph; inactive controls suppress glyphs; reduced-motion settings suppress control scaling.
- Yellow control restores maximized windows before minimizing them.
- Control Center is now a 360px / 24px-radius glass popover with 16px inner cards, theme/display/sound controls, music playback and a System Settings link. Pill sliders retain native keyboard range behavior. Portfolio shortcuts replace mock hardware controls.

Known intentional differences: portfolio content/apps remain specific to this site; no simulated Wi-Fi/Bluetooth hardware controls, payment/sponsor shortcuts, Launchpad, lock/sleep or restart screens added. Full live pixel/interaction equivalence cannot be claimed without successful target browser inspection.

Final second-pass verification: 63 tests passed, types and syntax/resource checks passed; production build and publication checks passed. Follow-up tests passed after final slider/Dock polish. Browser verified Photos launch from Control Center, green maximize/yellow restore, current-search-field Select All, Escape, theme toggle, sound keyboard adjustment/reset, 390px panel bounds and 32px narrow titlebar clearance. Final DOM confirmed 120px Dock blur, bottom 8px, 28px pill sliders, sound 20%, original dark appearance restored; no browser errors. Screenshot: C:/Users/20135/Documents/Codex/creativeos-thanas-control-center-dark.png.
