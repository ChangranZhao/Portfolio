# Thanas-aligned shell implementation plan

Goal: user explicitly requested direct implementation closely matching Thanas structural UI and interaction. Use supplied dark Finder/menu screenshots as visual authority. Keep portfolio assets, content, existing desktop arrangement, reader retention and startup intact.

Architecture: existing vanilla JS window manager, one consolidated desktop shell stylesheet, shared cancellable WAAPI transitions. No copied application code or new dependencies. Existing dirty checkout explicitly named by user is the delivery location; preserve prior work, no commit/deploy.

- [x] Extend shell-motion with open and reversible bounds transitions; tests for interruption and reduced motion.
- [x] Integrate gallery toolbar into window header, synchronize window metadata and minimized thumbnail after sidebar changes. Tight dark sidebar and content framing; preserve mobile controls.
- [x] Consolidate desktop shell styles around dark translucent system materials, system typography, fine borders and integrated headers; menus closed initially, keyboard focus restored.
- [x] Run tests/build/resource checks, browser interaction and screenshot checks; fresh scoped review, fix material issues.

Verification: window open/close/maximize/restore/minimize/reverse; one gallery on sidebar navigation; keyboard menu; project-reader content unaffected; no ongoing animation loop introduced. Blur limited to small menu/Dock surfaces. Static screenshots verify structure; do not claim measured FPS improvements.

Result: 37 tests passed; source resource check and production build passed; all 2289 publication images readable. Browser verified gallery reuse, maximize/restore/minimize, menu keyboard focus, full project rendering, 322px gallery width and right-control non-overlap. Restored original left-control preference after testing. Final screenshot: C:/Users/20135/Documents/Codex/thanas-shell-preview.png. Fresh scoped review identified interrupted transform-origin loss and narrow/right-control overlap; all fixed, origin regression test passed. Dynamic metadata localization also repaired with source retention. No deployment or commit.
