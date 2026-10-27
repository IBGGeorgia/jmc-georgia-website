# JMC Vigus asset integration

The website code expects these production paths under `public/`. The exact prepared bundle is `jmc-vigus-web-assets.zip` from the project conversation.

## Required files

- `public/brand/jmc-logo.svg` — user-supplied official SVG
- `public/images/vigus/hero.webp`
- `public/images/vigus/front.webp`
- `public/images/vigus/side.webp`
- `public/images/vigus/rear.webp`
- `public/images/vigus/cockpit.webp`
- `public/images/vigus/seats.webp`
- `public/images/vigus/dashboard.webp`
- `public/images/vigus/console.webp`
- `public/images/vigus/adventure-1.webp`
- `public/images/vigus/adventure-2.webp`
- `public/images/vigus/adventure-3.webp`
- `public/images/vigus/adventure-4.webp`

Unzip the archive, preserving the paths above, and commit all files to `main`. Merely committing the ZIP itself will not make images accessible at these URLs.

## QA after deployment

- `/vehicles/vigus` — verify hero photo, gallery, exterior and interior sections.
- `/images/vigus/hero.webp` — must return the image (HTTP 200).
- `/brand/jmc-logo.svg` — must return valid SVG (HTTP 200).
- Compare vehicle details against source photography; do not generatively change headlights, grille, wheels, cockpit, or trim-specific details.

## Brand rules

Georgian: FiraGO. Latin: Inter. Identity: JMC #E50012 and neutral palette. Apple HIG is a usability/reference framework, not a substitute for JMC corporate identity. Never publish undetermined local prices or trim attributes.

## Important

The `site-components.tsx` currently uses a temporary embedded PNG logo. Once the SVG above is present, replace that PNG data URL with the local SVG resource and review contrast on the dark footer.
