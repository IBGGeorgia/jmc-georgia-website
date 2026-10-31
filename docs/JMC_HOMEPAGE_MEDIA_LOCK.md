# JMC Homepage — Immutable media source and CDN independence

Four approved, already-mastered Homepage outputs live as **version-controlled binary WebP files** in `public/images/homepage/`:

| Asset | Dimensions | Purpose |
| --- | --- | --- |
| `lineup-vigus.webp` | 1600 × 1200 | VIGUS stage |
| `lineup-grand-avenue.webp` | 1600 × 1200 | Grand Avenue stage |
| `lineup-grand-avenue-pro.webp` | 1600 × 1200 | Grand Avenue PRO stage |
| `grand-avenue-pro-hero.webp` | 1920 × 1080 | approved cinematic Homepage Hero |

The authoritative SHA-256 lock is `assets/homepage/media-lock.json`. Ordinary production and CI builds **fail closed** if the lock or any file is missing/corrupt. A normal build MUST NOT fetch any Homepage assets from Higgsfield, and the site serves files directly from its own first-party paths.

## One-time historical pin procedure
The workflow `.github/workflows/pin-homepage-assets.yml`, scoped to the dedicated source branch, fetches the existing, already-approved visual outputs **exactly once** with `HOMEPAGE_ASSET_BOOTSTRAP=1`, runs Sharp mastering, checks physical dimensions and file sizes, writes SHA-256 digests, then commits the four actual WebP binaries and the lock to the same branch.

This workflow is NOT part of normal deployment. For future artwork changes, make a new reviewed media pin commit; do not overwrite unlocked or approved images implicitly.

## CI / production contract
- Production `prebuild` detects the lock and skips remote Homepage imports.
- The media master checks SHA-256 on every local file, validates pixel dimensions and format, then emits `public/images/homepage/audit.json` as a current audit artifact.
- The Playwright photo master test asserts `mode = immutable-local` and all image dimensions/weights.
- This only removes **Homepage image** CDN dependence. Other model-image imports elsewhere in the project may have their own existing dependencies.
