# Spectral Fluid layered pages implementation plan

**Goal:** Rebuild the approved cover and sixteen layout concepts as native layered pages within the current portfolio.

**Architecture:** A dedicated spectral-fluid.js module supplies the section navigation and semantic page content. spectral-fluid.css controls desktop 16:9 editorial layouts and mobile reflow. Original artwork and isolated image regions remain image layers; headings, body copy, diagrams, UI concepts, and navigation are DOM elements.

**Tech stack:** Existing JavaScript modules, HTML, CSS; lossless local PNG assets; Playwright verification.

- [x] Prepare separate original product imagery, illustrative scene crops, and real prototype images; preserve full-resolution cover background.
- [x] Build cover plus sixteen pages, live text, service blueprint tables, journey diagrams, ecosystem, phone UI concepts, and contextual image zoom.
- [x] Integrate chapter navigation and existing gallery callback without modifying other project implementations.
- [x] Verify text selectability, image loading, desktop aspect ratios, mobile overflow, chapter jumps, gallery, zoom, and production build.

User approved the white visual direction and explicitly requested direct implementation of the generated pages in this existing website. Research assumptions and proposed services remain labeled. No fabricated research outcomes. Generated scene crops are illustrative; prototype evidence uses the supplied original photos.


Verification: initial browser test failed with 0 native pages; final development and production browser checks passed with 17 native pages, 17 headings, 2 semantic blueprints, decoded artwork, 16:9 interior pages, chapter/gallery/lightbox behavior, mobile widths 390 and 700, and no runtime errors. Syntax/resource check passed (738 references); production build passed (1411 files). Desktop page-by-page visual review and footer bounds checked. Cover retained byte-for-byte. Phone labels and material-page artwork adjusted after visual review. Changes remain in the existing workspace as requested; no commit or remote publication performed.
