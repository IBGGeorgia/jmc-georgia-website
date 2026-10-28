# JMC Georgia — Repository Development Rules

Before any page, component, content, CSS, animation, or new-model change, read:
1. `docs/JMC_DESIGN_SYSTEM.md` — CANONICAL product & UI specification.
2. `app/design-system.css` — shared tokens and design overrides.
3. The relevant page/components and `lib/vehicles.ts` for model data.

## Non-negotiable user decisions
- Premium minimal, HIG-informed UI; graphite primary CTAs, soft-gray secondary CTAs, neutral focus and active states.
- Do not add decorative red lines or red buttons. **Preserve Vigus's functional red 2px sticky-navigation Scroll Progress Bar**, plus original official JMC logo artwork.
- Natural Georgian text and approved title casing; VIGUS hero/model identification may remain uppercase. No gratuitous all-caps UI.
- Preserve approved vehicle photos, logos, technical figures, and real 4-photo stepped view (do not call it an uninterrupted 360° view).
- Respect reduced-motion preferences, keyboard/focus behavior, mobile usability and legible content without JS.
- Preserve confirmed address: **თბილისი, ბელიაშვილის 115**. Social icons have NO destination URLs until supplied.
- No fabricated model, pricing, warranty, finance, contact hours/phone, campaign offer, social URL or lead collection.
- Test-drive form is currently nonfunctional; privacy policy is pending. Do not suggest live intake is possible.
- Do not add next model until Vigus is explicitly approved by the user as final template.

## Workflow
- Prefer shared CSS and components over per-page styling patches. Do not keep piling overrides into legacy `app/globals.css`.
- For new models follow chapter 8 of the canonical design document.
- QA must include build, TypeScript, npm audit and the GitHub Actions Playwright browser suite (`npm run qa:browser`) covering 6 routes × 6 viewport widths, keyboard/touch simulations and reduced motion. Inspect the run artifact's screenshots. Confirm live Render deployment before claiming release.
- Do not claim visual/browser QA unless a real browser actually tested the result.
- Preserve existing working data, links, and APIs. Record remaining limitations precisely.


## Latest approved navigation decision

- Main header: burger menu + centered official logo only. No Vigus CTA.
- Model sticky navigation: `დაჯავშნე Test Drive` -> `/test-drive`, with the Vigus red progress bar retained.
- Address access: Contact, Footer, and Burger menu address block. Keep model-page actions oriented to verified content/test-drive information instead.
- Booking is **not live**: the target page must clearly state applications are not accepted. No false confirmation or enabled lead form.
