# JMC Georgia Website

Next.js App Router / React / TypeScript project for JMC Georgia. Deployed on Render at https://jmc-georgia.onrender.com/ (currently staged for content approval and `noindex`).

## Mandatory design specification

**Read `docs/JMC_DESIGN_SYSTEM.md` before every UI, content or model addition.**

- Shared styles: `app/design-system.css` (imported after legacy `app/globals.css`)
- Development guardrails: `AGENTS.md`
- Model source data and explicit approved/draft publication gate: `lib/vehicles.ts`
- New model intake checklist: `docs/NEXT_MODEL_INTAKE.md`
- Vigus editorial composition: `app/vehicles/[slug]/vigus-page.tsx`
- Shared model components: `app/vehicles/[slug]/model-sections.tsx`
- Future verified-model baseline: `app/vehicles/[slug]/generic-model-page.tsx`
- Motion system: `app/vehicles/[slug]/vigus-motion.tsx`
- Approved asset notes: `docs/VIGUS_ASSET_INSTALL.md`

The design direction is premium, minimal and HIG-informed. Keep Vigus's **red functional reading-progress bar** but do not add decorative red lines or red CTA buttons. Preserve original brand/logo assets and verified vehicle photographs.

## Development

```bash
npm install
npm run dev
npm run build
npm run lint
npm run audit
npm run qa:browser  # after npm run build and npx playwright install chromium
```

## Current route and availability status

- `/`: JMC home with Vigus.
- `/vehicles/vigus`: approved reference model-page visual design; automated Chromium QA is in place (Safari/iOS QA is separate).
- `/vehicles`: currently redirects to Vigus, since the wider catalogue is not yet published.
- `/about`, `/contact`, `/test-drive`, `/privacy`: shared neutral editorial design.
- Confirmed address: **თბილისი, ბელიაშვილის 115**.
- Test-drive online submissions are disabled; a validated and spam-protected API and consent flow are not yet available.
- Privacy policy is pending approval. No fake policy or live-lead promise should be introduced.
- Facebook, Instagram and LinkedIn icons deliberately have no links.


## Automated cross-page browser QA

Playwright covers six public routes at **1440 / 1024 / 768 / 430 / 390 / 320px** and checks horizontal overflow, page load, the accessible mobile drawer, Vigus progress bar, trim/view interactions and reduced-motion behavior.

- Test specification: `tests/e2e/site.spec.ts`
- Browser configuration: `playwright.config.ts`
- GitHub Actions workflow: `.github/workflows/browser-qa.yml`
- Review screenshots, failures and traces in the **jmc-browser-qa** artifact attached to each [Browser QA run](https://github.com/gkalandia-pixel/jmc-georgia-website/actions/workflows/browser-qa.yml).
- These are automated checks, **not** a replacement for visual acceptance and cross-browser manual testing.

## Before public launch or additional models

- Vigus's design baseline is approved; maintain regression testing and complete separate Safari/iOS verification before a public launch.
- Obtain officially verified specifications, price availability, trims, model-specific photographs and rights for each new model.
- Approve legal/consent, lead capture and CRM integrations before enabling online forms.
- Verify SEO policy, custom domain and indexing permission.
- Deploy and verify the exact GitHub commit on Render.

**Do not describe a successful Build as equivalent to browser or visual QA.**
