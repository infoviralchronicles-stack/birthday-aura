import urllib.request
import json

HEADERS = {
    "User-Agent": "BirthdayAuraBot/1.0 (https://www.birthdayaura.com; info@birthdayaura.com)"
}

candidates = [
    "David Pastrňák",
    "Kat DeLuna",
    "Isaac Hanson",
    "Daisy Fuentes",
    "Harry E. Browne",
    "Bo Scarbrough",
    "Mary Elizabeth Mastrantonio",
    "Sophie Marceau",
]

for name in candidates:
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(name)}&prop=pageimages&format=json&pithumbsize=1000"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get("query", {}).get("pages", {})
            for page_id, page_info in pages.items():
                if "thumbnail" in page_info:
                    print(f"[FOUND] {name} -> {page_info['thumbnail']['source']}")
    except Exception as e:
        print(f"[ERR] {name} -> {e}")
