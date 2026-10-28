# JMC Georgia — Next Vehicle Model Intake

**Status:** Awaiting model selection and Georgian-market approved source materials.
**Reference:** Vigus is the user-approved model-page design baseline, 2026-10-28.
**Production scope:** No new model is published until its identity, market-specific product data and photos are approved.

## 1. Model identification
- Exact model and version/variant designation (e.g. JMC naming as supplied by HQ); **not confirmed yet**.
- Georgia import and market availability; **not confirmed yet**.
- SEO slug and segment (pickup/SUV/commercial); choose only after exact name.
- Positioning and Georgian copy approved by marketing; avoid importing copy from third-party markets.

## 2. Official content and media
- Official Georgian-market PDF/brochure and any HQ product configuration sheets.
- Vehicle's exact real photos: hero, exterior, interior, 4 approved angle photos (if available), details, and trim-specific imagery.
- Source/usage rights, original filenames and color/trim pairing. **Do not repurpose Vigus photographs**.
- Images must depict the correct actual model and trim; never infer a coherent 360° sequence from unrelated angles.
- Prices in GEL and financing only if explicitly confirmed; otherwise hide them.

## 3. Specifications and trims
- Engine/displacement, fuel, power/torque, transmission, 2WD/4WD, dimensions, clearance, payload, safety.
- Clearly distinguish **shared features** from **trim-specific features**.
- For every spec record the provenance: approved brochure page/configuration sheet, unit and validity date.
- Market differences matter: a model can have different engines/gearboxes in another country. Never copy unverified international-market powertrains or equipment.

## 4. Reusable design and UX
- Use `app/vehicles/[slug]/generic-model-page.tsx`, shared `ModelLocalNavigation`, `ModelSectionHeading`, `ModelClosingCTA` and `app/vehicles/[slug]/model-page.css`.
- Use `docs/JMC_DESIGN_SYSTEM.md` for spacing, fonts, neutral HIG-informed controls, sticky navigation and accessibility.
- Preserve approved top header (burger + centered logo) and local model CTA **„დაჯავშნე Test Drive“** linking to information-only `/test-drive` while booking is disabled.
- Prefer accurate real-photo galleries, supported interaction and restrained motion. The Vigus red reading-progress bar is a confirmed visual reference, not a requirement to invent an indicator on content-poor pages.
- For a Vigus-level immersive page, use only supplied/approved genuine media and specifically verified data.

## 5. Safe publishing workflow
1. Intake the exact next model and source materials.
2. Add model to the internal `catalogue` in `lib/vehicles.ts` with `publicationStatus:'draft'`. Drafts must not appear in published `vehicles`, generated routes, SEO or navigation.
3. Configure hero, gallery, trims, data and model-specific copy; no placeholders on the public website.
4. Verify in a controlled environment and run `npm run build`, `npm run lint`, `npm run audit` and `npm run qa:browser`.
5. Present the actual page for visual approval; fix review feedback.
6. Change `publicationStatus` to `approved` only following explicit approval, then deploy to existing Render service.
7. Verify Render live commit and new model route, and run browser QA across 1440, 1024, 768, 430, 390 and 320 px.

## 6. Known confirmed materials as of 2026-10-28
- Public model record: **JMC Vigus** only, with approved site assets and existing product data.
- Existing user-owned JMC brochure previews found in prior materials refer to **Vigus**.
- Global JMC model names include Grand Avenue, Grand Avenue Plus, Grand Avenue Pro and Vigus Plus, but **this alone is not evidence of Georgian-market availability, trim specifications or next-model choice**.
- **Blocked:** Exact next model, locally approved technical sheets and model-specific media must be provided or explicitly selected and verified before drafting a truthful model page.
