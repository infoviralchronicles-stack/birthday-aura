import os
import urllib.request
import json
from PIL import Image
import io

HEADERS = {
    "User-Agent": "BirthdayAuraBot/1.0 (https://www.birthdayaura.com; info@birthdayaura.com)"
}

CELEBS_NEW = {
    "11-17": [
        ("Martin Scorsese", "martin-scorsese", 1942, "Creators", "Martin Scorsese"),
        ("Danny DeVito", "danny-devito", 1944, "Actors", "Danny DeVito"),
        ("RuPaul", "rupaul", 1960, "Creators", "RuPaul"),
        ("Leslie Bibb", "leslie-bibb", 1974, "Actors", "Leslie Bibb"),
        ("Tom Seaver", "tom-seaver", 1944, "Athletes", "Tom Seaver"),
        ("Jeff Buckley", "jeff-buckley", 1966, "Musicians", "Jeff Buckley"),
        ("Gordon Lightfoot", "gordon-lightfoot", 1938, "Musicians", "Gordon Lightfoot"),
        ("Rock Hudson", "rock-hudson", 1925, "Actors", "Rock Hudson"),
        ("Lorne Michaels", "lorne-michaels", 1944, "Creators", "Lorne Michaels"),
    ],
    "11-18": [
        ("Owen Wilson", "owen-wilson", 1968, "Actors", "Owen Wilson"),
        ("David Ortiz", "david-ortiz", 1975, "Athletes", "David Ortiz"),
        ("Kirk Hammett", "kirk-hammett", 1962, "Musicians", "Kirk Hammett"),
        ("Chloe Sevigny", "chloe-sevigny", 1974, "Actors", "Chloë Sevigny"),
        ("Damon Wayans Jr.", "damon-wayans-jr", 1982, "Actors", "Damon Wayans Jr."),
        ("Delroy Lindo", "delroy-lindo", 1952, "Actors", "Delroy Lindo"),
        ("Alan Shepard", "alan-shepard", 1923, "Creators", "Alan Shepard"),
        ("Margaret Atwood", "margaret-atwood", 1939, "Creators", "Margaret Atwood"),
        ("Peter Schmeichel", "peter-schmeichel", 1963, "Athletes", "Peter Schmeichel"),
        ("Nasim Pedrad", "nasim-pedrad", 1981, "Actors", "Nasim Pedrad"),
    ],
    "11-19": [
        ("Jodie Foster", "jodie-foster", 1962, "Actors", "Jodie Foster"),
        ("Meg Ryan", "meg-ryan", 1961, "Actors", "Meg Ryan"),
        ("Adam Driver", "adam-driver", 1983, "Actors", "Adam Driver"),
        ("Larry King", "larry-king", 1933, "Creators", "Larry King"),
        ("Calvin Klein", "calvin-klein", 1942, "Creators", "Calvin Klein"),
        ("Allison Janney", "allison-janney", 1959, "Actors", "Allison Janney"),
        ("Tyga", "tyga", 1989, "Musicians", "Tyga"),
        ("Patrick Kane", "patrick-kane", 1988, "Athletes", "Patrick Kane"),
        ("Indira Gandhi", "indira-gandhi", 1917, "Creators", "Indira Gandhi"),
        ("Ted Turner", "ted-turner", 1938, "Creators", "Ted Turner"),
    ],
    "11-20": [
        ("Joe Biden", "joe-biden", 1942, "Creators", "Joe Biden"),
        ("Future", "future", 1983, "Musicians", "Future (rapper)"),
        ("Ming-Na Wen", "ming-na-wen", 1963, "Actors", "Ming-Na Wen"),
        ("Joel McHale", "joel-mchale", 1971, "Actors", "Joel McHale"),
        ("Bo Derek", "bo-derek", 1956, "Actors", "Bo Derek"),
        ("Robert F. Kennedy", "robert-f-kennedy", 1925, "Creators", "Robert F. Kennedy"),
        ("Callan McAuliffe", "callan-mcauliffe", 1995, "Actors", "Callan McAuliffe"),
        ("Dierks Bentley", "dierks-bentley", 1975, "Musicians", "Dierks Bentley"),
        ("Sean Young", "sean-young", 1959, "Actors", "Sean Young"),
        ("Edwin Hubble", "edwin-hubble", 1889, "Creators", "Edwin Hubble"),
    ],
    "11-21": [
        ("Carly Rae Jepsen", "carly-rae-jepsen", 1985, "Musicians", "Carly Rae Jepsen"),
        ("Goldie Hawn", "goldie-hawn", 1945, "Actors", "Goldie Hawn"),
        ("Jena Malone", "jena-malone", 1984, "Actors", "Jena Malone"),
        ("Michael Strahan", "michael-strahan", 1971, "Athletes", "Michael Strahan"),
        ("Bjork", "bjork", 1965, "Musicians", "Björk"),
        ("Ken Griffey Jr.", "ken-griffey-jr", 1969, "Athletes", "Ken Griffey Jr."),
        ("Marlo Thomas", "marlo-thomas", 1937, "Actors", "Marlo Thomas"),
        ("Voltaire", "voltaire", 1694, "Creators", "Voltaire"),
        ("Stan Musial", "stan-musial", 1920, "Athletes", "Stan Musial"),
        ("Nicollette Sheridan", "nicollette-sheridan", 1963, "Actors", "Nicollette Sheridan"),
    ]
}

def get_wiki_image_url(title):
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=pageimages&format=json&pithumbsize=1000"
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        pages = data.get("query", {}).get("pages", {})
        for page_id, page_info in pages.items():
            if "thumbnail" in page_info:
                return page_info["thumbnail"]["source"]
    return None

def crop_and_save(img_data, out_path):
    img = Image.open(io.BytesIO(img_data))
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    width, height = img.size
    min_dim = min(width, height)
    left = (width - min_dim) // 2
    top = (height - min_dim) // 2
    right = left + min_dim
    bottom = top + min_dim
    cropped = img.crop((left, top, right, bottom))
    resized = cropped.resize((600, 600), Image.Resampling.LANCZOS)
    resized.save(out_path, "JPEG", quality=90)

def main():
    os.makedirs("public/celebrities", exist_ok=True)
    total = 0
    downloaded = 0
    failed = []

    for date_key, celebs in CELEBS_NEW.items():
        print(f"\n--- Processing {date_key} ({len(celebs)} celebs) ---")
        for name, slug, year, cat, search_title in celebs:
            total += 1
            out_file = f"public/celebrities/{slug}.jpg"
            if os.path.exists(out_file) and os.path.getsize(out_file) > 1000:
                print(f"[EXISTS] {slug}")
                downloaded += 1
                continue
            
            img_url = get_wiki_image_url(search_title)
            if not img_url:
                print(f"[FAIL-NO-IMG] {name} ({search_title})")
                failed.append((name, slug, search_title))
                continue
            
            try:
                img_req = urllib.request.Request(img_url, headers=HEADERS)
                with urllib.request.urlopen(img_req, timeout=15) as res:
                    raw_data = res.read()
                    crop_and_save(raw_data, out_file)
                    print(f"[OK] Downloaded & cropped: {slug}")
                    downloaded += 1
            except Exception as e:
                print(f"[ERROR] {name}: {e}")
                failed.append((name, slug, search_title))

    print(f"\n======================================")
    print(f"Total: {total}, Successfully Ready: {downloaded}, Failed: {len(failed)}")
    if failed:
        print("Failed list:", failed)

if __name__ == "__main__":
    main()
