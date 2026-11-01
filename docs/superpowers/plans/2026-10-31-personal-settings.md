# Unified personal settings window

User-directed design: one shared window for About Me and Settings. Sidebar: identity card / portfolio sections / system preferences. Identity opens Overview; each entry switches the right pane. Preserve real profile content, working controls, search and external section links. Colored 24px icon tiles and rounded selected rows work in Classic and Liquid, light and dark.

Implementation: extract controlled content views from About and Settings, compose one persistent Sidebar/Toolbar, normalize both application entry points to the settings window ID and preserve requested section when a deferred load completes. Reuse existing data/controllers. Verify model identity, React in-place navigation, external requests, browser appearance, build and types. No Full Project content changes or new dependencies.
