# JMC Georgia — Homepage Photography & Framing Bible v1.0

Status: implementation specification subordinate to `docs/JMC_DESIGN_SYSTEM.md` and `docs/JMC_GLOBAL_WIDTH_BIBLE_V1.md`. No general layout or brand-token changes.

## Approved source fidelity
- Never alter the automotive make, grille, headlights, wheels, mirrors, trim, bed length or body proportions.
- Use the real approved images; generation may only enter customer-facing pages after identity review. Do not pass an automated test as proof of automotive-detail fidelity.
- Preserve original official image assets and model galleries. Model photos are not a 360° capture.

## Exact media contract
| Placement | Master format | Display intent |
| --- | --- | --- |
| Homepage Hero | 1920 × 1080 WebP, 16:9, derived from approved 1920 × 1088 original without enlargement | Desktop: full-bleed cover with left reading zone; mobile: whole scene visible on a dark stage |
| Model Lineup, 3 vehicles | 1600 × 1200 WebP, 4:3 for all | Equal source canvas; centered contain, preserve vehicle proportions |
| Storytelling cards | Existing 4:3 first-party master image | Desktop three-column; tablet image-left/editorial-right; mobile single column |
| Photo Explorer | Original first-party source photos | Contain, real numbered angles, touch and keyboard; no invented views |

## Rendering scale
- Above 900px, the Model Lineup media stage is capped at 600px tall. Below 900px its frame stays 4:3.
- At or below 700px, the Hero stays exactly 650px high. Use a bottom-anchored full image (`background-size:min(100%,520px) auto`) instead of 16:9 cover cropping; place readable text above it.
- Georgian punctuation must not become its own orphaned line; constrain only the last word when necessary and test 320px.
- Use JMC Width Bible tokens, graphite/white pill controls, no additional red flourishes.

## QA gates
- Before deployment, verify first-party image endpoints; source natural width/height; compressed size; 320/390/430/700/768/950/1440/1920px layout; no horizontal overflow; no clipped CTA.
- Load lazy images by scrolling them into view *before* taking full-page screenshot artifacts. A blank lazy image in a synthetic full-page screenshot is not proof that production imagery is broken.
- Preserve reduce-motion support.
- Build success and screenshot tests do **not** replace human review for AI-generated grille/headlight/wheel authenticity.

## Dependency note
Production pages serve generated WebP under `/images/homepage/` from the app itself. Source imports currently occur at build time from Higgsfield URLs; the repo does **not** yet retain immutable binary originals. A fully offline/reproducible build requires committing or storing vetted source binaries in owned durable storage.
