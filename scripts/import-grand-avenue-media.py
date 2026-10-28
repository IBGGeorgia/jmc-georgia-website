"""Promote user-approved Higgsfield 2K images into local optimized assets (one-shot)."""
from pathlib import Path
import io, urllib.request
from PIL import Image

URLS = {
    "hero": "https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261028_124938_2618ac2a-6fdd-45f1-ab7b-913d17196084.png",
    "exterior": "https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261028_124954_7ccde32f-9886-481d-8963-f848fd1af820.png",
    "interior": "https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261028_124954_6f5f73c8-35fd-4f09-abc1-38c15629a997.png",
    "safety": "https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261028_124954_aa8f7919-0d1a-4ba5-b9c5-3589b3f043bf.png",
    "capability": "https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261028_124954_77b6d53a-b43b-4942-a29d-e2166c58003e.png",
    "front": "https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261028_125008_a3fecc16-6b7f-49b9-9f02-78e556bf145e.png",
    "side": "https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261028_125009_968a642d-26d1-4fb1-b0fa-6af16dd007c3.png",
    "rear": "https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261028_125008_fe4a7d2e-bd4a-4dd1-956f-efa1f082be73.png",
    "detail": "https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261028_125008_9ffcabbb-332e-4d69-b601-8eb02ca533bf.png"
}
root=Path("public/images/grand-avenue")
root.mkdir(parents=True, exist_ok=True)
for name,url in URLS.items():
    with urllib.request.urlopen(url,timeout=50) as response:
        raw=response.read()
    image=Image.open(io.BytesIO(raw)).convert("RGB")
    target=root/f"{name}.webp"
    image.save(target,"WEBP",quality=88,method=6)
    print(name,image.size,target.stat().st_size)
source=Path("lib/grand-avenue.ts")
content=source.read_text()
for name,url in URLS.items():
    assert f" {name}:'{url}'" in content, f"Unexpected media source: {name}"
    content=content.replace(f" {name}:'{url}'",f" {name}:'/images/grand-avenue/{name}.webp'")
source.write_text(content)
tests=Path("tests/e2e/site.spec.ts")
s=tests.read_text()
s=s.replace("expect(url,\x60\x24{slot}: approved Higgsfield FLUX.2 image\x60).toMatch(/^https:\\/\\/d8j0ntlcm91z4\\.cloudfront\\.net\\/.+\\.png$/);","expect(url,\x60\x24{slot}: first-party optimized asset\x60).toBe(\x60/images/grand-avenue/\x24{slot}.webp\x60);")
tests.write_text(s)
