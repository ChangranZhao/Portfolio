# Echo Space Album Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement the following tasks.

**Goal:** Deliver an independent, dense black 16:9 photographic HTML album in the requested Project04 export directory.
**Architecture:** Static native HTML spreads, local CSS and images, minimal optional navigation and fit-to-width script. Source photos remain untouched.
**Tech Stack:** HTML/CSS/JavaScript, Python Pillow asset preparation, Playwright verification.
**Spec:** User's four Figma frames and three attached album references in this conversation.

## Constraints
- New subfolder under 导出/HTML/Project04; no modifications to the main website.
- Fixed 1600×900 artboards, black backgrounds, dense editorial layouts, local offline assets.
- Retain How we do · 05 / Making; distinguish proposal diagrams from real performance records.
- Use supplied photos from all six performance folders. No invented dates, roles, audience statistics or outcomes.

## Tasks
- [x] Inspect photo contact sheets and download original Figma assets; retain source mapping.
- [x] Compose narrative spreads: cover, project index, rationale, response, spatial concept, visual library, making, six live records, reflection.
- [x] Export self-contained index.html, style.css, local assets and concise opening instructions.
- [x] Verify decoded images, artboard ratio, overflow, navigation, offline opening and all-page screenshots.

## Review focus
- Text at 16:9 viewing size remains readable; no clipping or overlapping captions.
- Original diagrams and performance photos are identified correctly.
- Every local image and font loads without a network connection.
- Long titles and varied photo orientations fit designed frames.
- Browser resizing preserves every complete artboard.
