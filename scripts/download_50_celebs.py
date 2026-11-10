import urllib.request
import json
import urllib.parse
import os
from PIL import Image
import io

celebs = [
    # Nov 12
    ("ryan-gosling", "Ryan Gosling"),
    ("anne-hathaway", "Anne Hathaway"),
    ("russell-westbrook", "Russell Westbrook"),
    ("grace-kelly", "Grace Kelly"),
    ("neil-young", "Neil Young"),
    ("sammy-sosa", "Sammy Sosa"),
    ("megan-mullally", "Megan Mullally"),
    ("jorge-masvidal", "Jorge Masvidal"),
    ("wallace-shawn", "Wallace Shawn"),
    ("auguste-rodin", "Auguste Rodin"),
    # Nov 13
    ("whoopi-goldberg", "Whoopi Goldberg"),
    ("jimmy-kimmel", "Jimmy Kimmel"),
    ("gerard-butler", "Gerard Butler"),
    ("lando-norris", "Lando Norris"),
    ("juhi-chawla", "Juhi Chawla"),
    ("chris-noth", "Chris Noth"),
    ("joe-mantegna", "Joe Mantegna"),
    ("monique-coleman", "Monique Coleman"),
    ("robert-louis-stevenson", "Robert Louis Stevenson"),
    ("michael-copon", "Michael Copon"),
    # Nov 14
    ("king-charles-iii", "Charles III"),
    ("travis-barker", "Travis Barker"),
    ("josh-duhamel", "Josh Duhamel"),
    ("olga-kurylenko", "Olga Kurylenko"),
    ("patrick-warburton", "Patrick Warburton"),
    ("yanni", "Yanni"),
    ("condoleezza-rice", "Condoleezza Rice"),
    ("jawaharlal-nehru", "Jawaharlal Nehru"),
    ("claude-monet", "Claude Monet"),
    ("laura-san-giacomo", "Laura San Giacomo"),
    # Nov 15
    ("shailene-woodley", "Shailene Woodley"),
    ("sania-mirza", "Sania Mirza"),
    ("chad-kroeger", "Chad Kroeger"),
    ("sam-waterston", "Sam Waterston"),
    ("beverly-dangelo", "Beverly D'Angelo"),
    ("jonny-lee-miller", "Jonny Lee Miller"),
    ("randy-savage", "Randy Savage"),
    ("petula-clark", "Petula Clark"),
    ("lily-aldridge", "Lily Aldridge"),
    ("georgia-okeeffe", "Georgia O'Keeffe"),
    # Nov 16
    ("pete-davidson", "Pete Davidson"),
    ("maggie-gyllenhaal", "Maggie Gyllenhaal"),
    ("paul-scholes", "Paul Scholes"),
    ("lisa-bonet", "Lisa Bonet"),
    ("aditya-roy-kapur", "Aditya Roy Kapur"),
    ("martha-plimpton", "Martha Plimpton"),
    ("missi-pyle", "Missi Pyle"),
    ("burgess-meredith", "Burgess Meredith"),
    ("christian-horner", "Christian Horner"),
    ("chinua-achebe", "Chinua Achebe")
]

headers = {'User-Agent': 'BirthdayAuraBot/1.0 (contact@birthdayaura.com)'}
out_dir = 'public/celebrities'
os.makedirs(out_dir, exist_ok=True)

success = 0
failed = []

for slug, title in celebs:
    out_path = os.path.join(out_dir, f"{slug}.jpg")
    if os.path.exists(out_path) and os.path.getsize(out_path) > 10000:
        print(f"[EXISTS] {slug}")
        success += 1
        continue

    api_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=pageimages&format=json&pithumbsize=800"
    try:
        req = urllib.request.Request(api_url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data['query']['pages']
            page = list(pages.values())[0]
            if 'thumbnail' in page:
                thumb_url = page['thumbnail']['source']
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
                    resized.save(out_path, format='JPEG', quality=88)
                    print(f"[SAVED] {slug}: {out_path} ({os.path.getsize(out_path)} bytes)")
                    success += 1
            else:
                print(f"[NO THUMB] {slug} ({title})")
                failed.append((slug, title))
    except Exception as e:
        print(f"[ERROR] {slug}: {e}")
        failed.append((slug, title))

print(f"\nFinished: {success} succeeded, {len(failed)} failed: {failed}")
