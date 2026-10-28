# Cultural digitalization implementation plan

Goal: Deliver the approved Changzhi Full Project and a portable Chinese cultural digitalization presentation in 导出/1013分享.

Architecture: Reuse the existing vanilla JavaScript project reader and shared self-contained Changzhi content. The separate presentation reuses the existing Qi culture runtime and project modules. Import the 16 supplied Figma nodes as local assets and editable HTML reference boards; compose responsive narrative sections from those assets.

Approved design: Black, ivory and warm gold; concept first, then physical heritage in Changzhi, text-led interpretation in Zibo, ending in a comparison. Interactive capture pipeline, exhibit atlas filtering, layered images and restrained reveal motion. No invented outcomes or simulated 3D viewer presented as original reconstruction data.

- [x] Import and verify all supplied Figma assets and reference boards.
- [x] Implement responsive Changzhi content, keyboard-operable interactions and cleanup; connect p6 reader.
- [x] Implement independent concept/case/comparison website and reuse Qi culture interaction and full project content.
- [x] Export dependency-complete local folder with launch instructions and startup script.
- [x] Verify desktop/mobile, image loading, controls, reduced motion, main-site regression and production build.

Execution: Continue directly following user's confirmation to modify; keep work local to their existing project and requested export. Existing source is dist, site is generated. No deployment requested for the export.

Inline Zibo correction: Replace the outer fixed-height project iframe with the shared original p1 renderer mounted directly in the cultural page. All eight sections scroll with the main document; preserve the interactive cultural field, photo dialogs and exhibit readers. Scope construction timeline classes away from the cultural page namespace. Exported desktop/mobile and portfolio p6 regression checks pass; nine existing tests pass. Refreshed the user's current browser and verified eight directly mounted chapters with visible overflow.

Zibo follow-up: User requested the original full project directly embedded, with several introductory text pages. Reuse the same p1 rendering and Chinese localization through an optional standalone mount, preceded by three text sections about cultural resources, interpretation into experience, and implementation. Retain original research, spatial design, construction, exhibit details and reflection. Export includes zibo.html standalone reader. Verify embedded desktop/mobile, navigation, photo viewing, exhibit dialogs and motion settings.

User correction: Promote all 16 authored Figma boards into the main narrative. Preserve page 2 as the primary atlas with seven themes, 23 exhibits and five methods; highlight its 68 original SVG paths, add filters, image enlargement and case links. Implemented in both portfolio p6 and independent share site. Desktop/mobile export tests pass, including responsive zoom and reduced motion; all 122 assets verified. Review caught stale filter-button state after exhibit selection, now fixed with regression coverage. Production build contains 2551 referenced files.

Verification: 9 existing tests pass; JS/resource checks pass; production build succeeds with 2548 referenced files. Browser checks pass against the exported Windows server at desktop/mobile sizes: filters, process switches, image dialogs, culture runtime, reduced motion, collapse, main portfolio p6. All 16 boards and 122 source assets decode with nonzero geometry. Read-only review found a manual reduced-motion scrolling issue, now fixed and covered. Windows start/stop scripts verified; identity response MIME fixed after direct probe.
