# Grand Avenue PRO — self-hosting media migration (prepared 2026-10-28)

Status: assets optimized and packaged, **not yet uploaded into GitHub**. Production remains on validated Higgsfield CDN original media until the assets are committed.

## Exact destination inside the repository
`public/images/grand-avenue-pro/`

Files (original unaltered vehicle details, WebP exports, quality 85):
- `hero.webp` from `prooo.jpg`
- `exterior.webp` from `prppppp_0.jpg`
- `rear.webp` from `picture19.jpg`
- `front-detail.webp` from `pro1-copy_0.jpg`
- `cluster.webp` from `picture20.jpg`
- `terrain-display.webp` from `picture21.jpg`
- `overhead.webp` from `picture22.jpg`

The ChatGPT artifact `JMC_Grand_Avenue_PRO_SelfHosted_Images.zip` contains those files under `public/images/grand-avenue-pro/`, plus a SHA-256 manifest. The GitHub connector used for this repo is limited to UTF-8 text and cannot upload binary image bytes; do not replace URLs before upload succeeds.

## Migration steps after uploading the images to this repository
1. Verify all seven `/images/grand-avenue-pro/*.webp` return HTTP 200 and `image/webp` from a staging/static build.
2. In `lib/grand-avenue-pro-media.ts`, change each `.src` to the local path above, preserving `.alt` and `.original`.
3. `lib/vehicles.ts` already uses this media registry for homepage, catalogue, and test-drive cards: all three update automatically once the registry changes.
4. Run production build and full Chromium QA; inspect mobile hero and lightbox original detail consistency.
5. Deploy to Render, confirm the exact commit is live, and check seven local image paths and gallery navigation.
6. Ensure no rendered PRO image URL points to `d2ol7oe51mr4n9.cloudfront.net` before claiming migration complete.

**Do not delete or revoke original CDN images before production verification.** Preserve the original photo identity, especially the grille logo, headlights and wheels.
