import urllib.request
import json
import urllib.parse
import os
from PIL import Image
import io

celebs = [
    ("lorde", "Lorde"),
    ("kamal-haasan", "Kamal Haasan"),
    ("anushka-shetty", "Anushka Shetty"),
    ("david-de-gea", "David de Gea"),
    ("rio-ferdinand", "Rio Ferdinand"),
    ("adam-devine", "Adam DeVine"),
    ("joni-mitchell", "Joni Mitchell"),
    ("marie-curie", "Marie Curie")
]

headers = {'User-Agent': 'BirthdayAuraBot/1.0 (contact@birthdayaura.com)'}
out_dir = 'public/celebrities'
os.makedirs(out_dir, exist_ok=True)

for slug, title in celebs:
    api_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=pageimages&format=json&pithumbsize=800"
    try:
        req = urllib.request.Request(api_url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data['query']['pages']
            page = list(pages.values())[0]
            if 'thumbnail' in page:
                thumb_url = page['thumbnail']['source']
                print(f"[DOWNLOADING] {slug} from {thumb_url}")
                img_req = urllib.request.Request(thumb_url, headers=headers)
                with urllib.request.urlopen(img_req) as img_resp:
                    img_bytes = img_resp.read()
                    img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
                    w, h = img.size
                    min_dim = min(w, h)
                    left = (w - min_dim) // 2
                    top = max(0, (h - min_dim) // 3)
                    right = left + min_dim
                    bottom = top + min_dim
                    if bottom > h:
                        bottom = h
                        top = h - min_dim
                    cropped = img.crop((left, top, right, bottom))
                    resized = cropped.resize((600, 600), Image.LANCZOS)
                    out_path = os.path.join(out_dir, f"{slug}.jpg")
                    resized.save(out_path, format='JPEG', quality=88)
                    print(f"[SAVED] {out_path} ({os.path.getsize(out_path)} bytes)")
            else:
                print(f"[NO THUMB] {slug} ({title})")
    except Exception as e:
        print(f"[ERROR] {slug}: {e}")
