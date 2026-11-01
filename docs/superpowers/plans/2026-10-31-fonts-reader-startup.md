# Fonts, reader and CreativeOS startup implementation plan

Goal: reduce font transfer, repeated reader layout/localization and loading bursts. User approved an 8-second maximum startup, with early completion and richer technology-inspired animation. Preserve every visited board and reading position; no performance mode.

Design: convert existing fonts losslessly to WOFF2, preserving their original glyphs and metrics; use swap. Keep native scrolling, immediate chapter navigation, and batch layout reads before writes. Limit nearby board initialization and pause animation work during scrolling. Startup uses lightweight CSS orbit/grid/scan effects, real resource-completion progress, an always-available skip button and an independent 8-second escape. Warm desktop assets, shared fonts and a small selection of project cover/first-board images with three concurrent requests, canceled at exit; never preload whole projects.

- [x] Fonts: generate reproducible WOFF2 copies; update references and validate glyph/metric equivalence and size.
- [x] Reader: regression-test queue concurrency and retention, cache Changzhi translation per document/language, avoid repeated sizing reads, reuse existing project windows, remove prolonged chapter smooth scrolling.
- [x] Startup: regression-test bounded queue cancellation and 8-second fail-safe; add selected project assets and restrained animated startup.
- [x] Verify full test suite, source references, production build, output asset audit and local browser. Record measured savings and limits. No push/deploy.

Implementation follows writing-plans and executing-plans, in the current authorized checkout.

Verification: 29 tests passed, source syntax/resource check passed, production build passed. 7 converted fonts 1,330,540 -> 504,408 bytes with identical glyph maps and advances. Production audit: 2,289 readable images, 704 matching srcset widths. Browser verified startup, late Spectral chapter navigation, restored scroll position 10586 with one existing window, and Changzhi Longmen board.

Fresh review found a missing font descriptor separator in Space Chronicles; regression reproduced and fixed. Also corrected Changzhi warmup to the actual first board. Startup now defers guide and desktop drift until exit. No deployment or commit performed. Low-end hardware frame timing was not measured. Browser helper logged unsourced MutationObserver errors; local observer targets were inspected and visible project behavior passed, but those messages cannot be attributed from the available log.
