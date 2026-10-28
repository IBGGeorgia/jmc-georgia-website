# Grand Avenue PRO — received photo inventory / 2026-10-28

Status: **media intake, not published**. 11 images uploaded by user. These are actual supplied JMC PRO photos; do not swap with Grand Avenue GL or VIGUS.

| User file | Native dimensions | Intended role | QA/usage |
|---|---|---|---|
| prooo.jpg | 1400×784 | Hero candidate, wide red pickup with desert | High priority original reference; a FLUX.2 Flex 2K candidate was generated for comparison. Inspect product fidelity before approval. |
| prppppp_0.jpg | 1400×784 | Exterior / main editorial scene | Wide red pickup, mountain composition |
| pro1-copy_0.jpg | 1400×784 | Exterior / landscape capability | Red pickup with terrain |
| picture19.jpg | 1643×1095 | Rear ¾ / gallery | Large vehicle rear and side |
| picture20.jpg | 1717×1146 | Details / front wheel, grille, lighting | Sharp close-up |
| picture21.jpg | 1746×1164 | Exterior / elevated terrain | Red pickup, rugged road |
| picture16.jpg | 536×340 | Thumbnail / secondary reference | Small source, not recommended full-bleed hero |
| picture17.jpg | 497×332 | Thumbnail / secondary reference | Small source, not recommended full-bleed hero |
| picture18 (2).jpg | 537×366 | Thumbnail / driving mood | Small source, avoid enlargement |
| picture1_1.jpg | 512×341 | Four-image collage / K-MAN suspension and rear details | Must not treat collage as four high-resolution originals; can use a supported cropped tile with quality limits |
| picture22.jpg | 569×320 | Overhead turn shot | Small source / possible supporting visual only |

Additional supplied interior views:
- Picture showing instrument cluster and driving angles (picture18?); see user images and source filename verification below.
- Actual detailed interior photos are limited to instrument-cluster close-ups, **not** a complete wide cabin picture.

**Important visual QA:** above filename/role association for the 11 uploaded images needs a direct source QA against their image pixels before production assignment; avoid inferring specific trim just from red exterior. User has NOT confirmed LX vs SLX for the exterior photos, although the K-MAN photo suggests SLX-specific equipment (verify brochure/stock before claim).

## Higgsfield generation
- Requested model: `flux_2` with `variant=flex`, `resolution=2k`, `aspect_ratio=16:9`.
- Input: `prooo.jpg` provided by user.
- Job id: `be63a43e-1ac9-43f5-8607-ab639e509419`, status completed.
- Generated candidate URL: https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261028_165119_be63a43e-1ac9-43f5-8607-ab639e509419.png
- Acceptance: manually check grille wordmark, headlight shape, mirror and snorkel, wheel spoke/tires, body geometry and visual authenticity. If AI changes them, revert to original, not invented corrections.

## Image delivery gates
1. Match uploaded images to named filenames and model/trim (do not assume LX or SLX from context).
2. Select original photograph as default whenever edits risk vehicle fidelity.
3. Generate optional additional Flex compositions only with referenced user images.
4. Obtain a genuinely wide PRO cabin photo if available; avoid claiming dashboard close-up as full cabin.
5. Image export optimized WebP at suitable sizes with descriptive alt text and no baked-in CTA typography.
6. Mount in unpublished draft until user review and release approval.
