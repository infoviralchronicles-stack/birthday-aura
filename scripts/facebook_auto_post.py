#!/usr/bin/env python3
"""
Birthday Aura - Automated Facebook Daily Poster
Fetches today's birthday celebrities from Birthday Aura and automatically publishes
rich photo posts with biography, age, and direct website links to the Facebook Page.
"""

import os
import re
import sys
import json
import argparse
import datetime
import urllib.request
import urllib.parse

# Ensure UTF-8 output on Windows consoles
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ZODIAC_SIGNS = [
    (1, 20, "Capricorn"), (2, 19, "Aquarius"), (3, 21, "Pisces"),
    (4, 20, "Aries"), (5, 21, "Taurus"), (6, 21, "Gemini"),
    (7, 23, "Cancer"), (8, 23, "Leo"), (9, 23, "Virgo"),
    (10, 23, "Libra"), (11, 22, "Scorpio"), (12, 22, "Sagittarius"),
    (12, 32, "Capricorn")
]

MONTH_NAMES = [
    "", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

def get_zodiac(month, day):
    for m, d, sign in ZODIAC_SIGNS:
        if month < m or (month == m and day <= d):
            return sign
    return "Capricorn"

def parse_celebrities(file_path="src/lib/birthdayData.ts"):
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return []

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    m = re.search(r"export const CELEBRITY_DIRECTORY: CelebrityProfile\[\] = \[(.*?)\];\s*$", content, re.DOTALL)
    if not m:
        return []

    entries = []
    blocks = re.findall(r"\{([^{}]+)\}", m.group(1))
    for b in blocks:
        obj = {}
        for line in b.strip().split("\n"):
            line = line.strip()
            field_m = re.match(r"([a-zA-Z0-9_]+)\s*:\s*(.+?),?$", line)
            if field_m:
                k, v = field_m.group(1), field_m.group(2)
                if v.startswith("'") and v.endswith("'"):
                    v = v[1:-1].replace("\\'", "'")
                elif v.startswith('"') and v.endswith('"'):
                    v = v[1:-1]
                elif v.isdigit():
                    v = int(v)
                obj[k] = v
        if "id" in obj and "name" in obj:
            entries.append(obj)
    return entries

def build_post_message(star, current_year):
    name = star.get("name", "")
    b_year = star.get("birthYear", current_year)
    b_month = star.get("birthMonth", 1)
    b_day = star.get("birthDay", 1)
    age = current_year - b_year if b_year else 0
    month_name = MONTH_NAMES[b_month] if 1 <= b_month <= 12 else ""
    zodiac = get_zodiac(b_month, b_day)
    profession = star.get("profession", "Celebrity")
    birthplace = star.get("birthplace", "")
    about = star.get("about", "")
    trivia = star.get("trivia", "")
    star_id = star.get("id", "")

    clean_hashtag_name = re.sub(r"[^a-zA-Z0-9]", "", name)
    clean_profession_tag = re.sub(r"[^a-zA-Z0-9]", "", profession)

    message = (
        f"🎂 Happy Birthday to {name}! 🎉\n"
        f"Born on {month_name} {b_day}, {b_year} — turning {age} today!\n\n"
        f"🌟 Profession: {profession}\n"
        f"📍 Birthplace: {birthplace}\n"
        f"♈ Zodiac: {zodiac}\n\n"
    )

    if about:
        message += f"📖 {about}\n\n"
    elif trivia:
        message += f"💡 {trivia}\n\n"

    message += (
        f"👉 Explore {name}'s full verified biography, real age, and fun trivia on Birthday Aura:\n"
        f"https://www.birthdayaura.com/people/{star_id}\n\n"
        f"#HappyBirthday #{clean_hashtag_name} #BirthdayAura #CelebrityBirthdays #{clean_profession_tag}"
    )
    return message

def post_to_facebook(page_id, access_token, message, image_url=None):
    if not page_id or not access_token:
        print("Error: FB_PAGE_ID and FB_PAGE_ACCESS_TOKEN must be provided.")
        return False

    api_url = f"https://graph.facebook.com/v21.0/{page_id}/photos" if image_url else f"https://graph.facebook.com/v21.0/{page_id}/feed"
    
    data = {
        "access_token": access_token,
    }
    if image_url:
        data["url"] = image_url
        data["caption"] = message
    else:
        data["message"] = message

    encoded_data = urllib.parse.urlencode(data).encode("utf-8")
    req = urllib.request.Request(api_url, data=encoded_data, headers={"User-Agent": "BirthdayAura-Bot/1.0"})

    try:
        with urllib.request.urlopen(req) as resp:
            resp_data = json.loads(resp.read().decode("utf-8"))
            print(f"Successfully published to Facebook! Post ID: {resp_data.get('id') or resp_data.get('post_id')}")
            return True
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8", "ignore")
        print(f"Facebook API Error ({e.code}): {err_msg}")
        return False
    except Exception as e:
        print(f"Error publishing to Facebook: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Birthday Aura Facebook Daily Auto Poster")
    parser.add_argument("--dry-run", action="store_true", help="Simulate without posting to Facebook")
    parser.add_argument("--star-id", type=str, help="Specific celebrity ID to post")
    parser.add_argument("--month", type=int, help="Specific month (1-12)")
    parser.add_argument("--day", type=int, help="Specific day (1-31)")
    args = parser.parse_args()

    now = datetime.datetime.now()
    target_month = args.month if args.month else now.month
    target_day = args.day if args.day else now.day
    current_year = now.year

    celebrities = parse_celebrities()
    if not celebrities:
        print("No celebrities found in database.")
        sys.exit(1)

    selected_star = None
    if args.star_id:
        selected_star = next((c for c in celebrities if c.get("id") == args.star_id), None)
        if not selected_star:
            print(f"Celebrity with ID '{args.star_id}' not found.")
            sys.exit(1)
    else:
        # Match today's birthdays
        matches = [c for c in celebrities if c.get("birthMonth") == target_month and c.get("birthDay") == target_day]
        if matches:
            # Sort by boosts descending
            matches.sort(key=lambda x: int(x.get("boosts", 0)), reverse=True)
            selected_star = matches[0]
        else:
            print(f"No exact birthday match for {MONTH_NAMES[target_month]} {target_day}. Selecting top trending star.")
            celebrities.sort(key=lambda x: int(x.get("boosts", 0)), reverse=True)
            selected_star = celebrities[0]

    name = selected_star.get("name")
    img_path = selected_star.get("image", "")
    full_image_url = f"https://www.birthdayaura.com{img_path}" if img_path else None

    post_content = build_post_message(selected_star, current_year)

    print("==================================================")
    print(f"Target Celebrity: {name} (ID: {selected_star.get('id')})")
    print(f"Image URL: {full_image_url}")
    print("------------------ Post Content ------------------")
    print(post_content)
    print("==================================================")

    if args.dry_run:
        print("[DRY RUN] Finished without publishing.")
        return

    page_id = os.environ.get("FB_PAGE_ID", "").strip()
    access_token = os.environ.get("FB_PAGE_ACCESS_TOKEN", "").strip()

    if not page_id or not access_token:
        print("[NOTE] FB_PAGE_ID or FB_PAGE_ACCESS_TOKEN environment variables not set.")
        print("Run with --dry-run or provide credentials to publish live.")
        return

    post_to_facebook(page_id, access_token, post_content, full_image_url)

if __name__ == "__main__":
    main()
