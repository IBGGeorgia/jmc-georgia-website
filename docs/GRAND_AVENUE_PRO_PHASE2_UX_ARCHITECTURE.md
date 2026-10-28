# Grand Avenue PRO — Phase 2 UX/UI architecture
Status: design specification (draft), 2026-10-28. No public PRO route, no fabricated media, no deploy.
Source: JMC_Brochure_Studio_2026_Final(2).html; phase-1 analysis; docs/JMC_DESIGN_SYSTEM.md.

## Design direction
Premium Technical / Editorial. Product-first imagery and calm neutral layout. Distinct from the approved VIGUS dynamic comparison and Grand Avenue GL editorial grid. PRO's distinction is a **four-variant configurator**, not exaggerated animation. Do not imply genuine 360° imagery without a 360° photo set.

## Content model
Represent 4 immutable source-backed variant IDs:
- avenue_lx_d = PRO LX · 2.3 L Diesel · 177 hp · 8AT
- avenue_lx_g = PRO LX · 2.3 L Gasoline · 258 hp · 8AT
- avenue_slx_d = PRO SLX · 2.3 L Diesel · 177 hp · 8AT
- avenue_slx_g = PRO SLX · 2.3 L Gasoline · 258 hp · 8AT

Shared, as stated in brochure: clearance 255 mm; tank 80 L; Euro 6; size 5535 × 2055 × 1920 mm; wheelbase 3270 mm. Confirm before publication as Georgian market stock may vary. Acceleration, consumption, price and warranty must remain absent, not '0' or calculated.

Source model: variant has trim (lx|slx), fuel (diesel|gasoline), sourceId, technical fields, equipment categories (exterior/interior/safety/offroad). Do not merge lists across variants or infer equipment from another model. Store raw source and normalized display labels separately. Keep original source spelling for audit and polished Georgian for display.

## Section Map and behavior
1. Hero: 'GRAND AVENUE PRO', independent verified PRO hero photo; neutral tagline only; primary CTA '#choose-pro', secondary truthful '/test-drive' information. No price.
2. Signature metrics: 2.3 L, 4×4, 8AT, 255 mm. Power is fuel-dependent and must NOT display a single default value without showing selected fuel.
3. Editorial exterior: 1 wide photo + 1 detail, short grounded description; restrained reveal.
4. Interior: 1 verified cabin photo, feature callouts only when present on currently selected trim.
5. Capability/safety: feature chapters anchored to brochure and variant-specific availability; no simulated function demos.
6. Gallery: 4 distinct approved angles; desktop editorial two-column grid, mobile horizontal scroll-snap, verified full-screen lightbox.
7. Choose your PRO (central interaction): **two explicit axes** — trim LX/SLX, fuel Diesel/Gasoline; initial selection LX Diesel for predictable state, shown in full label. A single selected variant drives all facts and equipment. Persist selection only in component state until routing requirements are approved. No false 'available in stock' claim.
8. Compare configurations: choose 2 to 4 variants with an accessible option selector. Distinguish engine/fuel from LX/SLX equipment deltas. Difference-only toggle; show 'no documented difference' when appropriate, never treat absent feature as definitively absent unless source explicitly says so. Sticky row labels on wide viewport, stacked cards on narrow viewport.
9. Technical specifications: groups 'ძრავა და ამძრავი', 'გაბარიტები და პრაქტიკულობა'; all verified fields; variant-dependent updates.
10. Equipment: exterior, interior, safety, offroad disclosures with counts; selected variant label in heading. Distinguish documented presence vs unclear/missing documentation.
11. Closing CTA: truthful '/test-drive' page, and jump back to chooser. No working reservation promise.

## Interaction contract
- Trim and fuel controls are accessible segmented/radio choices with a clear visible active state and keyboard focus.
- Derived values, equipment and section labels update atomically when either control changes; announce selected trim+fuel politely.
- Changing trim/fuel must NOT silently change independent comparison selections.
- Comparison view defaults to two meaningful variants: LX Diesel vs SLX Diesel, making trim differences visible. Add a fuel comparison preset as a convenience if useful.
- There is no price or booking form in phase 2.
- Mobile: controls wrap to available width; no horizontally overflowing body. Gallery scrolls within its region.
- Reduced motion users receive immediate state changes and visible static content.

## Responsive specification
>= 1200px: wide photographic hero and editorial grids; chooser with vehicle visual adjacent to trim card; comparison table.
768–1199px: narrower two-column story when possible, chooser stacks gracefully.
<= 767px: single-column hero and specs (2×2), horizontal gallery strip, full-width trim controls, comparison stacked cards; sticky UI must not cover anchors.
Test widths: 1440, 1024, 768, 390, 320; touch + keyboard navigation, no JS errors, no broken images or horizontal document overflow.

## Required imagery and intake (do NOT request until build reaches media integration)
Priority:
P0: independent verified PRO hero/front three-quarter; side; rear three-quarter; interior wide.
P1: front detail/lighting; screen+cockpit close-up; cargo bed; credible terrain capability.
P2: LX vs SLX differences where physically visible (e.g. wheels/trim, driver aids, shock absorber close-up) and second campaign mood photo.
Target 10–12 originals, ideally >= 2000px wide for hero/wide; use actual photos, no reinterpretation of headlights, grille, wheels or body proportions. Record which trim each image depicts; avoid borrowing Grand Avenue GL assets.
If only P0 are supplied, finish a draft with remaining photo components withheld rather than guessed.

## Implementation gates
A. Phase-2 approval: UI architecture and variant behavior.
B. Phase-3/4: prepare truthful model data and reusable independent PRO components as *draft*, with no public vehicle export/route/menu/homepage/test-drive additions and no public images under a misleading route.
C. Photos: receive authentic PRO references, QA each angle and trim applicability, then integrate.
D. Visual signoff by user on whole PRO page, not merely on photo assets.
E. Publish approved route and site-wide links; GitHub actions pass, Render live commit checked, browser QA and real imagery verified.

## Explicitly unresolved
- Locally available trims/colors and equipment vs brochure.
- Approved selling prices, warranty, acceleration and consumption.
- Exact PRO photographs and distinguishable LX/SLX imagery.
- Whether selector should reflect inventory availability (out of scope until a source exists).
