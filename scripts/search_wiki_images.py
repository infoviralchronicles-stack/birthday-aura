import urllib.request
import json
import urllib.parse
import os

celebs = [
    # Nov 3 (4 celebs)
    ("gabe-newell", "Gabe Newell"),
    ("dennis-miller", "Dennis Miller"),
    ("jim-cummings", "Jim Cummings"),
    ("antonia-thomas", "Antonia Thomas"),
    # Nov 4 (10 celebs)
    ("matthew-mcconaughey", "Matthew McConaughey"),
    ("sean-combs", "Sean Combs"),
    ("ralph-macchio", "Ralph Macchio"),
    ("tabu", "Tabu (actress)"),
    ("luis-figo", "Luís Figo"),
    ("kathy-griffin", "Kathy Griffin"),
    ("drew-starkey", "Drew Starkey"),
    ("top", "T.O.P"),
    ("tyrese-maxey", "Tyrese Maxey"),
    ("loretta-swit", "Loretta Swit")
]

headers = {'User-Agent': 'BirthdayAuraBot/1.0 (contact@birthdayaura.com)'}

for slug, title in celebs:
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=pageimages&format=json&pithumbsize=600"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data['query']['pages']
            page = list(pages.values())[0]
            if 'thumbnail' in page:
                thumb = page['thumbnail']['source']
                print(f"[FOUND] {slug}: {thumb}")
            else:
                print(f"[NO THUMB] {slug} ({title})")
    except Exception as e:
        print(f"[ERROR] {slug}: {e}")
