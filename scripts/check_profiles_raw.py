import re

content = open("scripts/insert_nov17_nov21.py", "r", encoding="utf-8").read()
# Extract PROFILES_RAW
match = re.search(r'PROFILES_RAW = """(.*?)"""', content, re.DOTALL)
if not match:
    print("Could not extract PROFILES_RAW")
    exit(1)

lines = match.group(1).splitlines()
errors = []
for idx, line in enumerate(lines, 1):
    clean = line.replace("\\'", "")
    if clean.count("'") % 2 != 0:
        errors.append((idx, line))

if errors:
    print(f"Found {len(errors)} quote error(s):")
    for idx, l in errors:
        print(f"  Line {idx}: {l}")
else:
    print("0 quote errors found in PROFILES_RAW! Clean and ready.")
