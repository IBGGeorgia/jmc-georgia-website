# JMC Georgia — Global Width Bible v1.0

**Approved:** 2026-10-29. **Reference:** Grand Avenue PRO live layout.

## Canonical tokens
| Token | Value | Meaning |
| --- | --- | --- |
| `--jmc-content-max` | `1680px` | Maximum width of centered page content |
| `--jmc-readable-max` | `760px` | Maximum width of editorial text |
| `--jmc-gutter-desktop` | `24px` | Space on each side above 700px |
| `--jmc-gutter-mobile` | `16px` | Space on each side at/below 700px |

Formula: `contentWidth = min(1680px, viewportWidth - 2 * gutter)`. 
`margin-inline: auto` centers the result.

The single source of truth lives in `app/design-system.css`. Existing names (`--content-gallery`, `--content-wide`, `--content-readable`, `--content-ui`, `--layout-max`) alias these tokens during migration.

## Layout contracts
- Global header and hamburger, model navigation, hero *copy*, spec strips, product editorial sections, gallery, configurator, footer and ordinary page containers share the centered **main** grid.
- Hero *backgrounds*, cinematic imagery, and intentionally full-bleed sections remain **100% of viewport**; their internal copy uses the main grid.
- Long paragraphs should not exceed the 760px readable-width token. Large illustrations, photo grids and tables use the main grid.
- At 1920px, content width is 1680px (120px on either side). At 1440px it is 1392px (24px). At 390px it is 358px (16px).
- Do **not** add hard-coded 1200px, 1240px or 1480px max-width overrides for generic page layout. Narrow UI elements may retain purpose-specific widths (forms, cards, controls).
- New components should consume `--jmc-content-max`, `--jmc-readable-max`, and `--jmc-page-gutter` instead of duplicating literals.

## QA gate
Run `npm run lint`, `npm run build`, then test public pages at 1920, 1440, 768, 390 and 320 pixels. Assert HTTP 200, no horizontal overflow, and no JS page errors. Check main layout offsets on Homepage and the three model pages. The 1680px grid does not imply limiting the full-bleed image background.

## Future maintenance
If migrating legacy CSS, remove superseded selectors instead of stacking multiple new overrides; keep intentional narrow component-specific constraints. Any Width Bible amendment requires explicit design approval and corresponding regression QA.

## Approved Hero Height — v1.1
- Global cinematic hero: **748px desktop**, **650px mobile** (breakpoint at 700px).
- Full-bleed artwork occupies the full hero; text aligns with the main content grid.
- Keep consistent values across Homepage, VIGUS, Grand Avenue and PRO. Exception only with explicit design approval.
