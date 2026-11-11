import urllib.request

urls = [
    "https://www.birthdayaura.com/people/ryan-gosling",
    "https://www.birthdayaura.com/people/whoopi-goldberg",
    "https://www.birthdayaura.com/people/king-charles-iii",
    "https://www.birthdayaura.com/people/shailene-woodley",
    "https://www.birthdayaura.com/people/pete-davidson",
    "https://www.birthdayaura.com/birthdays/11-12",
    "https://www.birthdayaura.com/birthdays/11-13",
    "https://www.birthdayaura.com/birthdays/11-14",
    "https://www.birthdayaura.com/birthdays/11-15",
    "https://www.birthdayaura.com/birthdays/11-16",
]

for url in urls:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as res:
            print(f"[{res.status}] {url}")
    except Exception as e:
        print(f"[FAILED] {url} -> {e}")
