# Grand Avenue PRO — received photo inventory / 2026-10-28

Status: **media intake, not published**. 11 images uploaded by user. These are actual supplied JMC PRO photos; do not swap with Grand Avenue GL or VIGUS.

| User file | Native dimensions | Intended role | QA/usage |
|---|---|---|---|
| picture1_1.jpg | 512×341 | Small side-profile in bright desert | Reference / thumbnail only |
| picture16.jpg | 536×340 | Small front three-quarter in mountains | Reference / thumbnail only |
| picture17.jpg | 497×332 | Dusty action/front three-quarter | Small original, no full bleed |
| picture18 (2).jpg | 537×366 | Four-image collage with K-MAN suspension, rear detail | Lower-resolution multi-tile source; don't treat as four original photos |
| picture19.jpg | 1643×1095 | Rear three-quarter desert, side and tailgate | Editorial/gallery, high-resolution original |
| picture20.jpg | 1717×1146 | Digital instrument cluster, gauges | Technology detail; NOT wide cabin |
| picture21.jpg | 1746×1164 | Digital instrument cluster, terrain mode graphic | Technology/offroad detail; NOT wide cabin |
| picture22.jpg | 569×320 | Bird's-eye red pickup doing circle in desert | Small atmospheric/reference photo |
| pro1-copy_0.jpg | 1400×784 | Close-up front lighting, grille, wheel and snorkel | Detail photography |
| prooo.jpg | 1400×784 | Wide front three-quarter red pickup in desert | Main hero candidate; Flex 2K candidate reference |
| prppppp_0.jpg | 1400×784 | Front three-quarter in rugged dark mountains | Storytelling/off-road |

Additional supplied interior views:
- **picture20.jpg** and **picture21.jpg** show the instrument cluster and driving/terrain settings.
- A full wide-cabin photo is **not included** in this batch; do not invent a cabin from a dashboard crop.

**Source visual QA completed:** all eleven file-role mappings were verified using a filename-labeled contact sheet. Specific LX vs SLX trim identity cannot be inferred from red exterior photos; K-MAN-equipped close-up is only in a collage and requires trim confirmation. User has NOT confirmed LX vs SLX for the exterior photos, although the K-MAN photo suggests SLX-specific equipment (verify brochure/stock before claim).

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
