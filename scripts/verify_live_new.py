import urllib.request

urls = [
    # Samples from each new day
    "https://www.birthdayaura.com/people/martin-scorsese",
    "https://www.birthdayaura.com/people/owen-wilson",
    "https://www.birthdayaura.com/people/jodie-foster",
    "https://www.birthdayaura.com/people/joe-biden",
    "https://www.birthdayaura.com/people/carly-rae-jepsen",
    "https://www.birthdayaura.com/people/bjork",
    "https://www.birthdayaura.com/people/future",
    "https://www.birthdayaura.com/birthdays/11-17",
    "https://www.birthdayaura.com/birthdays/11-18",
    "https://www.birthdayaura.com/birthdays/11-19",
    "https://www.birthdayaura.com/birthdays/11-20",
    "https://www.birthdayaura.com/birthdays/11-21",
]

for url in urls:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as res:
            print(f"[{res.status}] {url}")
    except Exception as e:
        print(f"[FAILED] {url} -> {e}")
