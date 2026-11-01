# Liquid Glass appearance

User requested another full-system version using rdev/liquid-glass-react. Preserve the Classic appearance and independent Full Project art direction.

Implementation: orthogonal material preference (Classic / Liquid Glass), light/dark/system unchanged; persistent pre-paint attribute. Shared tokens cover native shell, React applications, dialogs, fields, tabs, cards and toolbars. Use the actual MIT library for a bounded number of visible top-level optical surfaces; other controls use matching glass materials without multiplying SVG filters. Text and images stay outside distortion layers. No ongoing mouse listeners in each optical layer; existing window/Dock interaction remains authoritative. Unmount optical roots when switching back, hidden or removed. Keep React outside startup dependency graph. Expose appearance in Settings and Control Center, default this new version to Liquid Glass when no material preference has been saved.

Validation: preference persistence, lens lifecycle/cleanup, bounded surfaces, existing behavior tests, production build and desktop/mobile light/dark visual inspection. Safari/Firefox retain glass styling but upstream does not guarantee SVG displacement there.

Verified in the local production preview: light/dark Photos, Control Center, Figma boards, Cursor source readability and overlapping About windows. Narrow viewport Control Center stays within the viewport. Classic removes all optical roots; restoring Liquid Glass recreates them without errors. Actual library SVG filters were confirmed in the browser, separately from the mocked lifecycle test. 65 automated tests passed; syntax/resource and TypeScript checks passed. Production validation read all 2,289 publication images and checked 704 responsive width descriptors. The deferred React bundle is 304.4 KiB, outside startup's dependency graph. No deployment or low-end-device frame-rate benchmark was performed.

Material refinement: removed the library's two independent border spans and replaced shell outer outlines with a single masked directional gradient rim. Reduced stacked background alpha (dark base .64→.32, light .70→.34). Optical hosts no longer apply an extra backdrop blur ahead of their SVG filter; the popover grouping uses :where so #toast cannot unexpectedly raise specificity. Increased edge displacement for Dock (40→100), menus (24→88) and enabled the same background-only effect on the single active window (82). Large reading surfaces retain dense backgrounds. Inactive windows release their optical root; lifecycle test now verifies focus transfer. Dimensions use layout client size to avoid baking the opening scale into the displacement map.

## Apple HIG alignment (supersedes the earlier whole-window experiment)

Sources checked 2026-10-31:
- https://developer.apple.com/design/human-interface-guidelines/materials
- https://developer.apple.com/videos/play/wwdc2025/219/

Apple separates navigation glass from standard content materials, recommends regular material for text-heavy sidebars/popovers, avoids nested glass, and coordinates curvature, optical edges and interaction feedback. This web implementation approximates these principles; it does not implement Apple's native per-pixel luminosity adaptation or fluid shape morphing.

Changes: remove full-window optical hosts; mount on active navigation sidebars and native titlebars instead. Keep Dock/menubar/popover roots bounded at seven and preserve zero idle animation callbacks. Use neutral dark/light tokens, opaque photo/text canvases, plain content cards and restrained accent color. Apply luminosity tint above the optical pass (not beneath the backdrop sampler) for readable controls. Reduce chromatic aberration and sharp displacement; regular glass blurs more than Dock. Retain a single directional rim, simplify nested card outlines, coordinate pill controls, add subtle press illumination, and honor reduced-transparency/increased-contrast preferences. Preserve Classic, per-project artwork, TouchDesigner's square icon and current Dock dimensions.

Validation: lifecycle regression fails with whole-window glass and passes with navigation-only targets; 66 tests, TypeScript and resource checks pass. Production build succeeds (111.6 KiB gzip deferred React). Browser verification and final captures recorded after visual review. No deployment or device-wide performance claim.

Final browser review: light/dark Photos and About Me, Control Center, keyboard menu opening, overlapping window focus, and Classic/Liquid switching verified. DOM checks show zero lenses in content canvases and four bounded optical roots with About + Control Center open. Classic releases all roots. No browser console errors were recorded. Captures: creativeos-apple-material-about-light.png / creativeos-apple-material-about-dark.png in Documents/Codex. Local production preview rebuilt; cloud deployment not changed.

## User-directed restoration

The user preferred the previous global Liquid Glass appearance and explicitly requested restoration. Reverted the Apple-HIG visual experiment: original dark/light alpha, tint, rims, control corners, card treatments and transparent content backgrounds are restored. Optical mounting returns to the active whole-window background, with the previous Dock/menu/window refraction settings. No nested sidebar filters; content stays above the optical background. Classic and independent Full Project art direction remain unchanged. Updated lifecycle assertions for global glass and verified all five material/theme tests plus TypeScript before rebuilding the production preview.

Dock rim correction: the shared Liquid Glass rim used z-index:10 and was drawn across magnified Dock icons (reproduced with Cursor focused). Horizontal expansion was correct, with about 7 px left padding. Override only the Dock rim to z-index:-1, beside its background and below all icons; window/menu rims remain unchanged. Retain the existing icon scaling and synchronized backdrop width.

## Dock proportions and source comparison

Reviewed current upstream Dock.tsx at https://github.com/Thanas-R/Thanas-OS/blob/main/src/components/macos/Dock.tsx (2026-10-31). Reference: 720px short side gives 47.88px icon size; rim radius .4 * base; padding max(8, .12 * base); icon radius max(12, .225 * scaled size); effectWidth is a full width, not a radius. Our fittedDockTargets mistakenly used the full effect width as radius, magnifying twice the intended range.

User wants a smaller Dock while retaining global Liquid Glass. Default maximum icon size reduced 54→48px; saved scale preference remains honored. Dock padding/radius and icon corners now coordinated with reference proportions. Icons use square layout boxes with running dots below, avoiding the old 6px content padding. Radius is compensated during transforms so the visual curvature follows scaled size. TouchDesigner remains square; Trash remains transparent. Dock rim stays behind icons. Restore two ambient shadows and top/bottom inset light, plus clearer single rim and small icon edge highlights. Increase only Dock optical blur to .4 to unify the surface without changing other global glass.

Regression test first failed at 1.244 scale outside the intended influence and now passes at 1.0. All 11 motion/geometry tests plus optical lifecycle test passed. Asset art is unchanged: reference's platform icon illustrations include their own shading; a generic shell cannot reproduce different icon artwork through CSS alone.

Production browser review at 1280×720: measured 48px base icon, 66px Dock height, 19.2px outer radius, 8px padding; TouchDesigner radius remains 0. Verified narrowed focus magnification, running indicators, both light/dark appearances, rim below icons, and no console errors. Dock tooltips now use denser theme-aware backgrounds for readability. Production build and resource checks succeeded; no cloud deployment performed.
