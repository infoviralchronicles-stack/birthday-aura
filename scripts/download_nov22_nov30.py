import os
import urllib.request
import json
from PIL import Image
import io

HEADERS = {
    "User-Agent": "BirthdayAuraBot/1.0 (https://www.birthdayaura.com; info@birthdayaura.com)"
}

CELEBS_REST_OF_NOV = {
    "11-22": [
        ("Scarlett Johansson", "scarlett-johansson", 1984, "Actors", "Scarlett Johansson"),
        ("Mark Ruffalo", "mark-ruffalo", 1967, "Actors", "Mark Ruffalo"),
        ("Hailey Bieber", "hailey-bieber", 1996, "Creators", "Hailey Bieber"),
        ("Jamie Lee Curtis", "jamie-lee-curtis", 1958, "Actors", "Jamie Lee Curtis"),
        ("Mads Mikkelsen", "mads-mikkelsen", 1965, "Actors", "Mads Mikkelsen"),
        ("Billie Jean King", "billie-jean-king", 1943, "Athletes", "Billie Jean King"),
        ("Steven Van Zandt", "steven-van-zandt", 1950, "Musicians", "Steven Van Zandt"),
        ("Boris Becker", "boris-becker", 1967, "Athletes", "Boris Becker"),
        ("Charles de Gaulle", "charles-de-gaulle", 1890, "Creators", "Charles de Gaulle"),
        ("Adele Exarchopoulos", "adele-exarchopoulos", 1993, "Actors", "Adèle Exarchopoulos"),
    ],
    "11-23": [
        ("Miley Cyrus", "miley-cyrus", 1992, "Musicians", "Miley Cyrus"),
        ("Asafa Powell", "asafa-powell", 1982, "Athletes", "Asafa Powell"),
        ("Snooki", "snooki", 1987, "Creators", "Snooki"),
        ("Vincent Cassel", "vincent-cassel", 1966, "Actors", "Vincent Cassel"),
        ("Robin Roberts", "robin-roberts", 1960, "Creators", "Robin Roberts (newscaster)"),
        ("Bruce Hornsby", "bruce-hornsby", 1954, "Musicians", "Bruce Hornsby"),
        ("Nav", "nav", 1989, "Musicians", "Nav (rapper)"),
        ("Kelly Brook", "kelly-brook", 1979, "Creators", "Kelly Brook"),
        ("Billy the Kid", "billy-the-kid", 1859, "Creators", "Billy the Kid"),
        ("Oded Fehr", "oded-fehr", 1970, "Actors", "Oded Fehr"),
    ],
    "11-24": [
        ("Sarah Hyland", "sarah-hyland", 1990, "Actors", "Sarah Hyland"),
        ("Katherine Heigl", "katherine-heigl", 1978, "Actors", "Katherine Heigl"),
        ("Stephen Merchant", "stephen-merchant", 1974, "Creators", "Stephen Merchant"),
        ("Colin Hanks", "colin-hanks", 1977, "Actors", "Colin Hanks"),
        ("Pete Best", "pete-best", 1941, "Musicians", "Pete Best"),
        ("Ryan Fitzpatrick", "ryan-fitzpatrick", 1982, "Athletes", "Ryan Fitzpatrick"),
        ("Conleth Hill", "conleth-hill", 1964, "Actors", "Conleth Hill"),
        ("Scott Joplin", "scott-joplin", 1868, "Musicians", "Scott Joplin"),
        ("Dale Carnegie", "dale-carnegie", 1888, "Creators", "Dale Carnegie"),
        ("Billy Connolly", "billy-connolly", 1942, "Actors", "Billy Connolly"),
    ],
    "11-25": [
        ("Christina Applegate", "christina-applegate", 1971, "Actors", "Christina Applegate"),
        ("Joel Kinnaman", "joel-kinnaman", 1979, "Actors", "Joel Kinnaman"),
        ("Amy Grant", "amy-grant", 1960, "Musicians", "Amy Grant"),
        ("Katie Cassidy", "katie-cassidy", 1986, "Actors", "Katie Cassidy"),
        ("Donovan McNabb", "donovan-mcnabb", 1976, "Athletes", "Donovan McNabb"),
        ("John Larroquette", "john-larroquette", 1947, "Actors", "John Larroquette"),
        ("Andrew Carnegie", "andrew-carnegie", 1835, "Creators", "Andrew Carnegie"),
        ("Xabi Alonso", "xabi-alonso", 1981, "Athletes", "Xabi Alonso"),
        ("Jill Hennessy", "jill-hennessy", 1968, "Actors", "Jill Hennessy"),
        ("Gaspard Ulliel", "gaspard-ulliel", 1984, "Actors", "Gaspard Ulliel"),
    ],
    "11-26": [
        ("Rita Ora", "rita-ora", 1990, "Musicians", "Rita Ora"),
        ("DJ Khaled", "dj-khaled", 1975, "Musicians", "DJ Khaled"),
        ("Tina Turner", "tina-turner", 1939, "Musicians", "Tina Turner"),
        ("Charles M. Schulz", "charles-m-schulz", 1922, "Creators", "Charles M. Schulz"),
        ("Peter Facinelli", "peter-facinelli", 1973, "Actors", "Peter Facinelli"),
        ("Natasha Bedingfield", "natasha-bedingfield", 1981, "Musicians", "Natasha Bedingfield"),
        ("Gauri Shinde", "gauri-shinde", 1974, "Creators", "Gauri Shinde"),
        ("Shawn Kemp", "shawn-kemp", 1969, "Athletes", "Shawn Kemp"),
        ("Maia Shibutani", "maia-shibutani", 1994, "Athletes", "Maia Shibutani"),
        ("Arjun Rampal", "arjun-rampal", 1972, "Actors", "Arjun Rampal"),
    ],
    "11-27": [
        ("Bruce Lee", "bruce-lee", 1940, "Actors", "Bruce Lee"),
        ("Jimi Hendrix", "jimi-hendrix", 1942, "Musicians", "Jimi Hendrix"),
        ("Bill Nye", "bill-nye", 1955, "Creators", "Bill Nye"),
        ("Kathryn Bigelow", "kathryn-bigelow", 1951, "Creators", "Kathryn Bigelow"),
        ("Jaleel White", "jaleel-white", 1976, "Actors", "Jaleel White"),
        ("Alison Pill", "alison-pill", 1985, "Actors", "Alison Pill"),
        ("Sharlto Copley", "sharlto-copley", 1973, "Actors", "Sharlto Copley"),
        ("Suresh Raina", "suresh-raina", 1986, "Athletes", "Suresh Raina"),
        ("Samantha Harris", "samantha-harris", 1973, "Creators", "Samantha Harris (television host)"),
        ("Jimmy Rollins", "jimmy-rollins", 1978, "Athletes", "Jimmy Rollins"),
    ],
    "11-28": [
        ("Jon Stewart", "jon-stewart", 1962, "Creators", "Jon Stewart"),
        ("Karen Gillan", "karen-gillan", 1987, "Actors", "Karen Gillan"),
        ("Mary Elizabeth Winstead", "mary-elizabeth-winstead", 1984, "Actors", "Mary Elizabeth Winstead"),
        ("Randy Newman", "randy-newman", 1943, "Musicians", "Randy Newman"),
        ("Alfonso Cuaron", "alfonso-cuaron", 1961, "Creators", "Alfonso Cuarón"),
        ("Judd Nelson", "judd-nelson", 1959, "Actors", "Judd Nelson"),
        ("Ryan Kwanten", "ryan-kwanten", 1976, "Actors", "Ryan Kwanten"),
        ("Ed Harris", "ed-harris", 1950, "Actors", "Ed Harris"),
        ("William Blake", "william-blake", 1757, "Creators", "William Blake"),
        ("Paul Shaffer", "paul-shaffer", 1949, "Musicians", "Paul Shaffer"),
    ],
    "11-29": [
        ("Chadwick Boseman", "chadwick-boseman", 1976, "Actors", "Chadwick Boseman"),
        ("Don Cheadle", "don-cheadle", 1964, "Actors", "Don Cheadle"),
        ("Anna Faris", "anna-faris", 1976, "Actors", "Anna Faris"),
        ("Russell Wilson", "russell-wilson", 1988, "Athletes", "Russell Wilson"),
        ("The Game", "the-game", 1979, "Musicians", "The Game (rapper)"),
        ("Howie Mandel", "howie-mandel", 1955, "Creators", "Howie Mandel"),
        ("C.S. Lewis", "cs-lewis", 1898, "Creators", "C. S. Lewis"),
        ("Mariano Rivera", "mariano-rivera", 1969, "Athletes", "Mariano Rivera"),
        ("Fawad Khan", "fawad-khan", 1981, "Actors", "Fawad Khan"),
    ],
    "11-30": [
        ("Ben Stiller", "ben-stiller", 1965, "Actors", "Ben Stiller"),
        ("Kaley Cuoco", "kaley-cuoco", 1985, "Actors", "Kaley Cuoco"),
        ("Chrissy Teigen", "chrissy-teigen", 1985, "Creators", "Chrissy Teigen"),
        ("Ridley Scott", "ridley-scott", 1937, "Creators", "Ridley Scott"),
        ("Steve Aoki", "steve-aoki", 1977, "Musicians", "Steve Aoki"),
        ("Gael Garcia Bernal", "gael-garcia-bernal", 1978, "Actors", "Gael García Bernal"),
        ("Bo Jackson", "bo-jackson", 1962, "Athletes", "Bo Jackson"),
        ("Mark Twain", "mark-twain", 1835, "Creators", "Mark Twain"),
        ("Winston Churchill", "winston-churchill", 1874, "Creators", "Winston Churchill"),
        ("Elisha Cuthbert", "elisha-cuthbert", 1982, "Actors", "Elisha Cuthbert"),
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

    for date_key, celebs in CELEBS_REST_OF_NOV.items():
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
    print(f"Total: {total}, Ready: {downloaded}, Failed: {len(failed)}")
    if failed:
        print("Failed list:", failed)

if __name__ == "__main__":
    main()
