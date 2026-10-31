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
| Storytelling cards | VIGUS: approved 1440 × 1080 WebP; remaining models: existing first-party photos | Desktop three-column; tablet image-left/editorial-right; mobile single column |
| Photo Explorer | VIGUS: 4 approved 1440 × 1080 WebP studio angles + preserved cockpit/seats; remaining models: original photos | Contain, real numbered angles, touch and keyboard; no invented views |

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
Production pages serve generated WebP under `/images/homepage/` from the app itself. All Homepage master assets, including VIGUS four-angle editorial views, are stored as immutable first-party WebP binaries under `public/images/homepage` and SHA-256 pinned in `assets/homepage/media-lock.json`. Model-page source galleries are unchanged; other product-page import dependencies are tracked separately.

## Homepage 3.8 VIGUS editorial composition
- Storytelling's first card uses the approved VIGUS **front-three-quarter** angle, replacing the dark front-on legacy image.
- Homepage Explorer VIGUS sequence: three-quarter front, straight front, side profile, three-quarter rear, then the existing cockpit and seats. This is not a 360-degree view.
- The four exterior photographs share the same clean architectural studio, illumination and neutral 4:3 canvas. They are intentionally Homepage-only; do not overwrite canonical VIGUS galleries on model detail pages.
- Main Explorer exterior frame uses a controlled wide editorial crop on desktop and exact 4:3 framing on mobile. Non-VIGUS/interior photos retain contain treatment to protect image content.
- Photo thumbnail edges, stage height and storytelling image slots use consistent design tokens and radius.

## Homepage 3.9 Model Lineup final art direction
- All three model tabs use separate, first-party **1600 × 1200** SHA-256-pinned WebP masters.
- Matching image family: bright neutral architectural studio, three-quarter FRONT camera, vehicle pointing camera-left, gentle directional daylight and floor shadow.
- VIGUS remains the previously approved four-angle studio reference (only its master is converted to the required lineup canvas); its existing model page is untouched.
- Grand Avenue uses its documented official model-page hero and front photo as identity references; inaccurate door copy was removed in the final candidate.
- Grand Avenue PRO uses its original official model photography as identity references; the distinctive black grille with DADAO styling and rugged body are preserved in the reviewed image.
- Human visual comparison with source images is required for every future replacement, even after all Playwright image tests pass.
- `object-fit:contain`, no extra media padding, and a fixed media-stage height avoid clipping the bumpers/wheels or shifting layout across tab changes.
- No Homepage models' source galleries, trims, Hero banner, editorial cards or Photo Explorer are changed by this milestone.
- Prebuilt media binaries are in Git; no production request to external AI generation/CDN is needed.
