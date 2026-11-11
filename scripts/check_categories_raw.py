import re

content = open("scripts/insert_nov17_nov21.py", "r", encoding="utf-8").read()
categories = re.findall(r"category:\s*['\"]([^'\"]+)['\"]", content)
valid = {'Creators', 'Actors', 'Musicians', 'Athletes'}
invalid = [c for c in categories if c not in valid]
print(f"Total categories checked: {len(categories)}")
if invalid:
    print(f"Invalid categories: {invalid}")
else:
    print("All categories are 100% valid TypeScript union values!")
