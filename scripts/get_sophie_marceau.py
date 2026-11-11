import urllib.request
import json
from PIL import Image
import io

HEADERS = {
    "User-Agent": "BirthdayAuraBot/1.0 (https://www.birthdayaura.com; info@birthdayaura.com)"
}

candidates = [
    ("Sophie Marceau", "sophie-marceau", "Sophie Marceau"),
    ("Daisy Fuentes", "daisy-fuentes", "Daisy Fuentes"),
    ("Kat DeLuna", "kat-deluna", "Kat DeLuna"),
]

for name, slug, title in candidates:
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=pageimages&format=json&pithumbsize=1000"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        pages = data.get("query", {}).get("pages", {})
        for page_id, page_info in pages.items():
            if "thumbnail" in page_info:
                src = page_info["thumbnail"]["source"]
                print(f"[FOUND] {name}: {src}")
                # Download and crop
                img_req = urllib.request.Request(src, headers=HEADERS)
                with urllib.request.urlopen(img_req, timeout=15) as img_resp:
                    img = Image.open(io.BytesIO(img_resp.read()))
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGB")
                    w, h = img.size
                    dim = min(w, h)
                    l = (w - dim) // 2
                    t = (h - dim) // 2
                    cropped = img.crop((l, t, l + dim, t + dim)).resize((600, 600), Image.Resampling.LANCZOS)
                    cropped.save(f"public/celebrities/{slug}.jpg", "JPEG", quality=90)
                    print(f"[SAVED] public/celebrities/{slug}.jpg")
