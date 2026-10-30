# JMC Georgia — Design System & Product Page Standard

**Status:** Canonical product/design standard (v1.1, 2026-10-28)
**Scope:** All public pages, navigation, responsive components, future vehicle pages.
**Approval note:** Vigus's visual direction and final header/navigation were explicitly accepted by the user on 2026-10-28. This is the approved model-page baseline; it does **not** imply cross-browser (Safari/iOS) verification or approval of unprovided future model materials.

> **Source of truth for future development.** Before writing or editing UI, read this document, `app/design-system.css`, the target page and its data source. Follow the shared defaults unless a new explicit approval overrides a rule.

## 1. Design intent

- Product-first, restrained, confident, minimal, and editorial. Use Apple HIG as a usability **principle**, not as a license to reproduce Apple branding or ornamental UI.
- Give automotive photography, typography, and real product data the visual priority. No unnecessary effects, stripes, floating red rules, decorative underlines, dramatic button shadows, or gratuitous gradients.
- Keep existing Vigus motion storytelling, but make motion serve meaning. The confirmed **thin red scroll progress bar under Vigus's sticky local navigation** is deliberately retained.
- Never substitute a flashy animation for a usable function; no fake 360-degree vehicle view from only four photos.

## 2. Color and visual tokens

Canonical implementation: `app/design-system.css` (loaded **after** `app/globals.css` in `app/layout.tsx`).

| Role | Token | Value / intent |
| --- | --- | --- |
| Primary ink | `--jmc-ui-ink` | `#1d1d1f`, near-black |
| Secondary text | `--jmc-ui-secondary` | `#626269` |
| Supporting text | `--jmc-ui-tertiary` | `#818188` |
| Soft surface | `--jmc-ui-surface` | `#f5f5f7` |
| Hover surface | `--jmc-ui-surface-hover` | `#e9e9ed` |
| Hairline divider | `--jmc-ui-border` | `rgba(29,29,31,.10)` |
| Focus ring | `--jmc-ui-focus` | `#57575f` |
| Card radius | `--jmc-ui-radius-card` | `20px` |
| Control radius | `--jmc-ui-radius-control` | `999px` |
| Brand red | `--jmc-red` | `#E50012`; **only approved logos and meaningful exceptions** |

**Red exceptions:** Official JMC logo artwork stays red as supplied. The Vigus section-reading progress bar stays red, 2 px high. Do not add red decorative rules beneath numbers, tabs, titles, cards, trim selectors, or buttons. Any other red accent requires specific approval.

The site may use dark photo panels, dark CTA panels, or a subtle dark hero gradient, but avoid decorative geometric stripes. Do not recolor or reconstruct the official logo.

## 3. Typography and language

- Georgian: currently `--font-ka` prefers Google Sans and falls back to Noto Sans Georgian / sans-serif in the project. Latin/model labels: `--font-latin` prefers Switzer. Preserve Unicode Georgian glyph shaping and correct line-height.
- Human-readable Georgian. Sentence case and natural capitalization for titles and navigation; do not apply `text-transform:uppercase` to Georgian interface copy.
- **Permitted exception:** `VIGUS` may remain uppercase in its approved hero/model identification. Original brand marks remain as supplied.
- Editorial H1 and H2 should be large but clear, with line-height ~1.12–1.25; supporting copy usually 1.65–1.8.
- Use one heading hierarchy per page, descriptive links, short CTA text, and copy grounded in actually enabled functions. No invented slogans, corporate history, warranty/prices, locations, partner claims or specifications.

## 4. Buttons, links and interactive states

Use shared `.button` for general pages; `.vigus-pill` is the model-story equivalent.

| Role | Presentation | Behavior |
| --- | --- | --- |
| Primary CTA | Graphite fill / white type | Neutral hover; no red fill or raised shadow |
| Secondary CTA | Soft gray fill / dark type | Subtle surface-hover |
| CTA on a dark area | White fill / dark type | Secondary is translucent white |
| Text link | Type + optional direction arrow | No decorative red underline |
| Tabs/segmented controls | Soft neutral background; selected white/graphite | Do not add red rules |
| Arrows/icon controls | Simple circular surface and icon | Minimum comfortable hit target |
| Disabled states | Clearly disabled and unavailable | No fake navigation |

- Interactive targets **44 × 44 px minimum** (48 px preferred for CTAs).
- Focus must remain visible for keyboard users. Neutral focus ring on light surfaces, white ring on dark surfaces; never rely solely on background changes to signal focus.
- Use `:hover` only as enhancement; all interactions must be possible by touch and keyboard.
- Don't add links without confirmed targets. Footer social icons (Facebook, Instagram, LinkedIn) have **null URLs** and are **non-interactive** pending supplied official links.
- An unimplemented form or feature must have a truthful status; no pretend booking or lead intake.

## 5. Layout and responsive behavior

- Preserve the existing content containers and generous whitespace; avoid unnecessary full-width text.
- Use responsive grid/flex, `minmax(0,1fr)`, safe inline padding, and readable Georgian text.
- Standard review breakpoints: **1440, 1024, 768, 430, 390, 320 px**.
- Under ~850 px, split informational panels stack into one column. Under ~700 px, CTAs and content spacing simplify; do not allow horizontal overflow.
- Header stays sticky, model-local navigation stays below header, mobile drawer remains a true modal with Escape, focus trap, focus return, inert background and scroll lock.
- Footer has the confirmed address **თბილისი, ბელიაშვილის 115**, real model/contact/test-drive/about links and three decorative social icons with no URLs.

## 6. Motion: Vigus is the reference implementation

Reference components:
- `app/vehicles/[slug]/page.tsx` — model routing and metadata only.
- `app/vehicles/[slug]/vigus-page.tsx` — approved Vigus editorial composition; unique vehicle-specific content is not blindly reused.
- `app/vehicles/[slug]/model-sections.tsx` — shared navigation, headings and truthful closing CTA.
- `app/vehicles/[slug]/generic-model-page.tsx` — data-driven fallback for future **approved** vehicle models, without Vigus-specific imagery.
- `app/vehicles/[slug]/model-page.css` — scoped responsive model layout and compact Vigus chapter rhythm.
- `app/vehicles/[slug]/vigus-motion.tsx` — GSAP/ScrollTrigger/SplitText orchestration.
- `app/vehicles/[slug]/vigus-experience.tsx` — photo view, tab/storytelling and trim selector.
- `app/vehicles/[slug]/vigus-gallery.tsx` — drag/keyboard photo gallery.

Approved pattern:
1. Hero enters once; no excessive looping.
2. Kinetic lines of text animate as whole lines; never split Georgian glyphs character-by-character.
3. Cinematic photo reveal and quiet parallax/Scroll storytelling on capable desktop.
4. Sticky story imagery transitions from **existing verified photographs**; mobile uses simpler switching.
5. Technical numbers always show **source-verified final values**; entrance animation may move/fade figures, never count through fabricated intermediate numbers.
6. Real four-photo view is described as four angles, **not** full 360° capture.
7. Trim selector/table updates use restrained transitions; all comparison data comes from `lib/vehicles.ts`.
8. Vigus sticky-local-nav has a thin **red** progress line: functional reading progress; preserve it.
9. `prefers-reduced-motion:reduce` must disable decorative animation without hiding content; JS failure must leave content readable.

No blanket reuse of Vigus-specific animation on unrelated informational pages.

## 7. Current page inventory and status

| Route | Intended layout | Data/functional state |
| --- | --- | --- |
| `/` | Cinematic, minimal editorial hero; Vigus card; three-step explanation; neutral contact CTA | Vigus is only confirmed model; no invented catalogue data |
| `/vehicles/vigus` | Approved reference page with photos, chapters, views, comparison and scroll progress | Visually approved; automated Chromium regression tested; Safari/iOS separate QA pending |
| `/vehicles` | Redirect to `/vehicles/vigus` | Full catalogue not yet active |
| `/about` | Shared informational page + truthful JMC/Vigus introduction | Corporate history pending officially approved text |
| `/contact` | Shared page intro + address information card | Only confirmed address; phone/hours pending |
| `/test-drive` | Shared informational page + disabled online booking status | No lead capture or live booking until approved API/consent exists |
| `/privacy` | Shared informational page + pending-policy status | **Not** a substitute for an approved legal privacy policy |
| Global header/footer | Consistent navigation / actions / neutral controls | Facebook/Instagram/LinkedIn intentionally not linked |

`app/vehicles/catalogue-explorer.tsx` exists for later expansion but is **not** mounted at the current `/vehicles` route.

## 8. Future model pages: required workflow

**Vigus is now approved as the model-page visual reference.** Future models must still pass independent market-data/media intake and page acceptance.

1. Intake: approved model name/slug/segment, variants, prices (or explicit *not available*), powertrain/specification source, brand assets, full photo set and permitted image use.
2. Data: add model/trim/features to `lib/vehicles.ts`; preserve existing slugs/fields. Never copy Vigus specifications into a different model. Only models in this verified list should generate public routes.
3. Composition: use shared `ModelLocalNavigation`, `ModelSectionHeading`, `ModelClosingCTA` and data-driven `GenericModelPage`. New-model-specific stories are optional only with approved media/copy. Complex photo/360 interactions **only when source images actually support them**.
4. Motion: reuse the approved GSAP philosophy, not necessarily identical timings for every model; respect `prefers-reduced-motion`.
5. Functional truthfulness: no unsupported form, checkout, price, social URL, finance promise, test drive booking or location.
6. SEO: title and description reflect confirmed model. Preserve current `robots:noindex` until authorized to launch.
7. QA: build, type check, npm audit, desktop/tablet/mobile, keyboard/touch, image loading, sticky nav, in-page anchors, hover/focus, scrolling, accessibility and Render LIVE status.
8. Obtain explicit user approval of each future model's content and visuals before changing its status from draft to approved.

## 9. Definition of done & QA

**Required:**
- Static source audit confirms exact confirmed content; no placeholder CTA promises.
- Successful `npm install`, `npm run build`, `npm run lint` (TS checks), `npm run audit`.
- Visual acceptance on 1440 / 1024 / 768 / 430 / 390 / 320 px, including zoom and Georgian wrapping.
- Test every link, CTA, dialog, gallery/trim control, keyboard Tab/Escape, screen-reader names, mobile touch and reduced-motion mode.
- Confirm no image crop changes, Vigus 4-photo truthfulness and no invented model data.
- Render service `srv-dbge2kflk1mc73dq4lpg` deployed to `https://jmc-georgia.onrender.com/`; record deployed commit and actual Render status.
- Vigus's visual standard is approved; each new model requires its own specification/media sign-off.

**Unverified unless explicitly tested:** Screenshot-level browser rendering, performance/Core Web Vitals, keyboard behavior in an actual browser, iOS Safari touch behavior, and legal policy content. A successful Build is **not** the same as visual QA.

## 10. Change-control rule

For every future UI request:
- Read **this document + `app/design-system.css`** before touching components.
- Prefer modifying shared tokens/components to copying overrides into individual pages.
- Keep the design history and all approved media/data intact.
- Do not add new red lines/buttons, unsupported marketing copy, or new animations without a clear functional purpose.
- Test the impacted routes and publish to the existing production Render service.
- Record what was verified and what remains untested; never claim screenshots or browser QA without evidence.

**Known technical debt:** `app/globals.css` contains historical layered styles (~110 KB). `app/design-system.css` is the canonical shared override layer; gradually consolidate legacy CSS without destructive large deletions or changing model imagery/functionality.

## 11. Automated browser regression suite

- Canonical suite: `tests/e2e/site.spec.ts`; runner config: `playwright.config.ts`.
- Github Actions: `.github/workflows/browser-qa.yml`. Run on changes to pages, CSS, shared components or model data.
- Screenshots and failure traces: downloadable artifact `jmc-browser-qa` from the selected GitHub Actions run.
- Current automated route matrix: shared pages plus **every approved published model** × viewport widths 1440, 1024, 768, 430, 390 and 320 px.
- Additional checks: modal focus trap / Escape, inert background, Vigus reading-progress bar, 4-photo selector, trim controls, reduced-motion and real-scroll reveal assertions.
- Interpret results correctly: Chromium automation can establish responsive/functional baselines, but cannot automatically approve aesthetics, iOS/Safari or all visual transitions. Review screenshots and obtain user approval for Vigus before adding the next model.


## 12. Header, address and Test Drive navigation — approved 2026-10-28

- The primary site header shows **only the burger menu and centered official JMC logo**. Do not restore the old "გაიცანი Vigus" action or add a second top-header button.
- On every model's sticky local navigation, use the single right-side CTA **"დაჯავშნე Test Drive"** linking to `/test-drive`; preserve the functional **red scroll-progress bar** on Vigus.
- The verified street address **თბილისი, ბელიაშვილის 115** is primarily surfaced in **Contact**, **Footer**, and the **Burger Menu's address block**. Do not add an address button back into model-local navigation.
- The `/test-drive` page is currently **informational only**: its online booking form is not connected. Keep the unavailable-booking message explicit and do not imply that clicking the CTA completes a booking. Update this state only after implementing and verifying actual lead submission, consent, and CRM integration.
- Additional actions inside model pages may say **"ტესტ-დრაივის ინფორმაცია"** while online booking is disabled. Use minimal neutral buttons consistent with the HIG-informed design system.
- Include automated regression tests for the removed header CTA, local Test Drive CTA, compact viewports, and address presence in the drawer and footer.

## 13. Next model intake and publication safety

Read `docs/NEXT_MODEL_INTAKE.md` before adding any non-Vigus model. Only records explicitly marked `publicationStatus:'approved'` may appear in public routing and catalogue. A draft is strictly private and must not have a published model route. Browser QA dynamically tests every approved model at all supported breakpoints; do not borrow another market's trim specifications.

## Approved UI Design System v2.0 (2026-10-29)

- **Icons:** shared `JmcIcon` component in `app/jmc-icons.tsx`, Lucide-compatible 24×24 viewBox, outline stroke **1.75**, standard rendered **20px** (24px for emphasized use). Use semantic icons, avoid raw Unicode arrows in newly authored controls.
- **Buttons:** fully pill-shaped (`border-radius:999px`), graphite primary, soft-gray secondary, white on dark imagery. Default min height **48px**, compact local controls at least **44px**, hero CTAs **52px** where space allows.
- **Spacing:** shared 4/8/12/16/24/32px tokens. **Cards** use shared 20px radius where appropriate; preserve intentional square cinematic Hero edges.
- **Interactions:** consistent neutral focus ring, no transform-on-hover, clear keyboard focus and disabled-state treatment, reduced motion respects accessibility.
- **Typography and Layout:** explicitly preserve previously approved fonts/type hierarchy and Width Bible (1680px / 760px; gutters 24px / 16px; Hero 748px desktop and 650px mobile). Do not redefine.
- **Scope:** Header, Footer, Homepage, Catalogue, model pages, About, Contact, Test Drive and Privacy. Product-specific interactive controls retain intentional behavior, gallery scrolling and compact mobile navigation.
- **Implementation:** shared styling in `app/design-system.css`; existing page-specific rules are superseded only where inconsistent with this standard. Remove superseded CSS opportunistically after visual regression comparison, not by broad deletion.

## Approved Test Drive flow (2026-10-30)

The public `/test-drive` route follows **Hero → vehicle selector and contact form → next steps → showroom**, with no full explanatory three-step section between the hero and selector. Keep the three existing model Studio assets, minimal white/neutral card treatment and 44px+ controls. On mobile shorten the route to model selection; avoid a second overlapping fixed CTA that obstructs form fields. After submission, clearly explain that the booking time still requires the sales team's confirmation.

Approved privacy contact: **compliance@ibg.ge**. Approved Test Drive lead retention period: **12 calendar months since the last substantive lead update**. Deployment of the actual cleanup scheduler, policy publication and intake activation remain separate verified operations. See `docs/LEAD_RETENTION_OPERATIONS.md` and privacy draft PR #44.
