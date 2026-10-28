# Blue Calico Implementation Plan

Goal: implement the approved research-and-work narrative in p12 Full Project.
Architecture: a dedicated DOM renderer called by project-details.js; scoped responsive CSS; reuse project images, lightbox and translation registry.
Tech Stack: existing vanilla JavaScript and CSS.
Spec: ../specs/2026-10-25-blue-calico-design.md

## Constraints and review focus
Use verified paper content only; preserve other projects; check image/PDF links, narrow layouts, chapter navigation, translation and production build.

## Tasks
- [ ] Create dist/blue-calico.js with bilingual narrative, ECMF diagram, three scenes, evaluation and paper link.
- [ ] Wire p12 into dist/project-details.js and add scoped responsive styles in dist/blue-calico.css imported by the renderer.
- [ ] Run site syntax/resource checks and production build; inspect desktop and mobile rendering if browser runtime is available.

User explicitly requested direct implementation in this session. This is a reversible content/layout change; use existing checks rather than implementation-mirroring tests.
