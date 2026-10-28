# Grand Avenue — implementation & image handoff

**Status:** Draft; prepared from the user's uploaded `JMC_Brochure_Studio_2026_Final(2).html`, `model-data` JSON entry `avenue_gl`.
**Model:** JMC GRAND AVENUE — **4X4 AT GL Diesel**, model year 2026.
**Publication:** **NOT live**. The record has `publicationStatus:'draft'` in `lib/grand-avenue.ts`. The approved `vehicles` list filters out drafts, so `/vehicles/grand-avenue` remains 404 until user approves real photos and the complete page.

## 1. Confirmed brochure facts

| Field | Grand Avenue 4X4 AT GL Diesel |
| --- | --- |
| Engine | 2.5 L 4×4 diesel |
| Power | 211 hp |
| Transmission | 8-speed automatic (8AT) |
| 0–100 km/h | 12.03 seconds |
| Ground clearance | 235 mm |
| Fuel tank | 80 L |
| Rear differential lock | Listed in the technical features |
| Kerb / gross weight | 2095 kg / 3145 kg |
| Emissions | Euro 5 |
| L × W × H | 5435 × 1935 × 1890 mm |
| Cargo bed L × W × H | 1545 × 1595 × 545 mm |
| Wheelbase | 3270 mm |
| Wheels | 17″ with 265/65 R17 tires |
| Fuel consumption | **Blank in brochure** — never invent |
| Price / warranty | **Blank or unconfirmed in brochure** — never invent |

The project data in `lib/grand-avenue.ts` also includes a full, brochure-derived list of 18 interior features, 20 safety features, 7 consolidated exterior features (some source items were split without changing meaning) and capability notes. It preserves the exact GL trim engine and dimensions; no PRO data is mixed in.

## 2. Required photo handoff

The supplied HTML is an *editor*, not an exported brochure containing finished car photographs. Its initial project state is `photos: {}`; photography was stored in a separate browser/IndexedDB state and **is not embedded in the supplied file**. The only embedded base64 image assets belong to the editor's JMC logos. Original user-prepared photos must be delivered as files.

**Proposed source-media slots** (names are suggested for clean storage, not a claim that the files exist):

| Role | Suggested target path after receiving an actual matching file | UI |
| --- | --- | --- |
| Hero | `public/images/grand-avenue/hero.webp` | Large main vehicle photograph |
| Exterior | `.../exterior.webp` | Scroll Story 01 |
| Interior | `.../interior.webp` | Scroll Story 02 |
| Safety | `.../safety.webp` | Scroll Story 03 |
| Capability | `.../capability.webp` | Scroll Story 04 |
| Front | `.../front.webp` | Gallery |
| Side | `.../side.webp` | Gallery |
| Rear | `.../rear.webp` | Gallery |
| Detail | `.../detail.webp` | Gallery |

No specific pixel dimensions, photo color, angle or feature claim is assumed. Use the genuine photo's composition and actual variant/color. Once files are provided, optimize losslessly where practical and map each verified file to the corresponding entry of `grandAvenueMedia`. Do **not** put non-existing paths in public JSX or copy Vigus images.

When a scene has no corresponding photo, the private draft renders a neutral editorial surface rather than inventing an automobile picture; **do not approve or publish the final visual page without the actual required photos**.

## 3. Page structure already coded

- `lib/grand-avenue.ts`: approved-source technical data, complete equipment groups, photo map, draft vehicle.
- `app/vehicles/[slug]/brochure-model-page.tsx`: Hero, facts, four-chapter product storytelling, all verified technical data, full equipment accordions, real-photo-only gallery, truthful CTAs.
- `app/vehicles/[slug]/brochure-story.tsx`: accessible scroll/keyboard tabs and honest crossfades.
- `app/vehicles/[slug]/brochure-model-motion.tsx`: scroll progress, kinetic headings and reduced-motion support.
- `app/vehicles/[slug]/brochure-model.css`: scoped HIG-informed neutral style, responsive.
- `app/vehicles/[slug]/page.tsx`: Grand Avenue renderer selected only if publication gate allows it.
- `tests/e2e/site.spec.ts`: asserts model facts, equipment counts, no fabricated media, and draft route 404.

## 4. Separate next phase: Grand Avenue PRO

This brochure includes four **different** PRO records, which must not appear on the Grand Avenue GL page:
- `avenue_lx_d`: 4X4 PRO LX Diesel — **2.3 L, 177 hp, Euro 6, 255 mm clearance**.
- `avenue_lx_g`: 4X4 PRO LX Gasoline — **2.3 L, 258 hp, Euro 6, 255 mm clearance**.
- `avenue_slx_d`: 4X4 PRO SLX Diesel — **2.3 L, 177 hp, Euro 6, 255 mm clearance**.
- `avenue_slx_g`: 4X4 PRO SLX Gasoline — **2.3 L, 258 hp, Euro 6, 255 mm clearance**.

PRO has its own equipment, safety systems, clearances and body dimensions. These must be transcribed and approved when the user moves on to the PRO phase. No PRO media or specifications are to be used for GL.

## 5. Before publication

1. Receive original photos, inspect each file and confirm they depict **Grand Avenue GL** (not PRO).
2. Connect all verified media to `grandAvenueMedia`, test object fit, cropping, art direction and mobile layouts.
3. Review exact brochure facts and potential terminology polish with the user. Confirm market-specific prices separately if prices are to be shown.
4. Run Build, TypeScript, browser QA across six viewport sizes, keyboard, touch and reduced-motion; inspect screenshots.
5. Obtain explicit approval, then change `publicationStatus` to `approved` and deploy on Render.
6. Verify **live** route and preserve Vigus/regressions. Only then proceed to Grand Avenue PRO.
