# Grand Avenue — implementation & Higgsfield image handoff

**Status:** Draft; prepared from the user's uploaded `JMC_Brochure_Studio_2026_Final(2).html`, `model-data` JSON entry `avenue_gl`.
**Model:** JMC GRAND AVENUE — **4X4 AT GL Diesel**, model year 2026.
**Publication:** **NOT live**. The record has `publicationStatus:'draft'` in `lib/grand-avenue.ts`. The approved `vehicles` list filters out drafts, so `/vehicles/grand-avenue` remains 404 until the complete page receives separate publication approval.

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

## 2. Approved image assets (2026-10-28)

Eleven original user-uploaded reference photographs were confirmed in Higgsfield Media Library. The user approved all nine generated editorial photographs, made with Higgsfield FLUX.2 variant Flex at 2K resolution. The live model is still intentionally gated as draft.

| Slot | Generation job ID | Purpose |
| --- | --- | --- |
| Hero | `2618ac2a-6fdd-45f1-ab7b-913d17196084` | Main hero |
| Exterior | `7ccde32f-9886-481d-8963-f848fd1af820` | Exterior story |
| Interior | `6f5f73c8-35fd-4f09-abc1-38c15629a997` | Cabin story |
| Safety | `aa8f7919-0d1a-4ba5-b9c5-3589b3f043bf` | Safety story |
| Capability | `77b6d53a-b43b-4942-a29d-e2166c58003e` | Capability story |
| Front | `a3fecc16-6b7f-49b9-9f02-78e556bf145e` | Front gallery |
| Side | `968a642d-26d1-4fb1-b0fa-6af16dd007c3` | Side gallery |
| Rear | `fe4a7d2e-bd4a-4dd1-956f-efa1f082be73` | Rear gallery |
| Detail | `9ffcabbb-332e-4d69-b601-8eb02ca533bf` | Detail gallery |

The nine job output URLs currently resolve through the Higgsfield CloudFront CDN and are mapped to `grandAvenueMedia` in `lib/grand-avenue.ts`. Production-hardening should copy these to first-party `public/images/grand-avenue/*.webp` files, then update media paths and verify responsive crops. Do not replace these approved images with newly generated variants without review. Generated photos are editorial visualizations, not proof of specific mechanical options or equipment.

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

1. **Completed:** original reference photos uploaded and nine FLUX.2 Flex visuals generated and approved by user.
2. **Pending:** first-party hosting, crop/layout review, responsive browser QA and generated-detail validation.
3. Review exact brochure facts and potential terminology polish with the user. Confirm market-specific prices separately if prices are to be shown.
4. Run Build, TypeScript, browser QA across six viewport sizes, keyboard, touch and reduced-motion; inspect screenshots.
5. Obtain explicit approval, then change `publicationStatus` to `approved` and deploy on Render.
6. Verify **live** route and preserve Vigus/regressions. Only then proceed to Grand Avenue PRO.
