import urllib.request
import os
from PIL import Image
import io

images_dict = {
    "gabe-newell": "https://upload.wikimedia.org/wikipedia/commons/3/38/The_International_2018_%2843263984845%29_%28cropped_2%29.jpg",
    "dennis-miller": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Dennis_Miller_%28cropped%29.jpg/960px-Dennis_Miller_%28cropped%29.jpg",
    "jim-cummings": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Jim_Cummings_by_Gage_Skidmore_2.jpg/960px-Jim_Cummings_by_Gage_Skidmore_2.jpg",
    "antonia-thomas": "https://upload.wikimedia.org/wikipedia/commons/6/60/Antonia_Thomas_%28Cropped%29.jpg",
    "matthew-mcconaughey": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Matthew_McConaughey_at_the_2025_Toronto_Film_Festival_%283x4_cropped%29.jpg/960px-Matthew_McConaughey_at_the_2025_Toronto_Film_Festival_%283x4_cropped%29.jpg",
    "sean-combs": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Sean_Combs_Cannes_2012_%283x4_cropped_2%29.jpg/960px-Sean_Combs_Cannes_2012_%283x4_cropped_2%29.jpg",
    "ralph-macchio": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/RalphMacchio-byPhilipRomano.jpg/960px-RalphMacchio-byPhilipRomano.jpg",
    "tabu": "https://upload.wikimedia.org/wikipedia/commons/f/f3/Tabu_in_2024.jpg",
    "luis-figo": "https://upload.wikimedia.org/wikipedia/commons/1/15/Luis_Figo_2023.jpg",
    "kathy-griffin": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Kathy_Griffin_%40_SXSW_2019_%2840387773813%29_%28cropped%29.jpg/960px-Kathy_Griffin_%40_SXSW_2019_%2840387773813%29_%28cropped%29.jpg",
    "drew-starkey": "https://upload.wikimedia.org/wikipedia/commons/b/be/Drew_Starkey_at_81st_Venice_International_Film_Festival.jpg",
    "top": "https://upload.wikimedia.org/wikipedia/commons/4/47/T.O.P_-_0.TO.10_in_Seoul_-_2.jpg",
    "tyrese-maxey": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/1_tyrese_maxey_2026.jpg/960px-1_tyrese_maxey_2026.jpg",
    "loretta-swit": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Loretta_Swit_MASH_1972.JPG"
}

headers = {'User-Agent': 'BirthdayAuraDownloader/1.0 (https://birthdayaura.com; admin@birthdayaura.com)'}
out_dir = 'public/celebrities'
os.makedirs(out_dir, exist_ok=True)

for slug, url in images_dict.items():
    out_path = os.path.join(out_dir, f"{slug}.jpg")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = resp.read()
            img = Image.open(io.BytesIO(data)).convert('RGB')
            w, h = img.size
            min_dim = min(w, h)
            # Center crop top-weighted for portraits (focus more on faces)
            left = (w - min_dim) // 2
            top = max(0, (h - min_dim) // 3)
            right = left + min_dim
            bottom = top + min_dim
            if bottom > h:
                bottom = h
                top = h - min_dim
            cropped = img.crop((left, top, right, bottom))
            resized = cropped.resize((600, 600), Image.LANCZOS)
            resized.save(out_path, format='JPEG', quality=88)
            print(f"[SAVED 600x600] {out_path} ({os.path.getsize(out_path)} bytes)")
    except Exception as e:
        print(f"[FAIL] {slug}: {e}")
