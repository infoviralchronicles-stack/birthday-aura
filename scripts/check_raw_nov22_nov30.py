import re

content = open("scripts/insert_nov22_nov30.py", "r", encoding="utf-8").read()
match = re.search(r'PROFILES_REST_OF_NOV = """(.*?)"""', content, re.DOTALL)
if not match:
    print("Could not extract PROFILES_REST_OF_NOV")
    exit(1)

raw = match.group(1)
lines = raw.splitlines()

quote_errors = []
for idx, line in enumerate(lines, 1):
    clean = line.replace("\\'", "")
    if clean.count("'") % 2 != 0:
        quote_errors.append((idx, line))

print(f"Total lines: {len(lines)}")
if quote_errors:
    print(f"Found {len(quote_errors)} quote errors:")
    for idx, l in quote_errors:
        print(f"  Line {idx}: {l}")
else:
    print("0 quote errors found! Quotes are clean.")

categories = re.findall(r"category:\s*['\"]([^'\"]+)['\"]", raw)
valid = {'Creators', 'Actors', 'Musicians', 'Athletes'}
invalid = [c for c in categories if c not in valid]
print(f"Total categories checked: {len(categories)}")
if invalid:
    print(f"Invalid categories: {invalid}")
else:
    print("All categories are 100% valid TypeScript union values!")
