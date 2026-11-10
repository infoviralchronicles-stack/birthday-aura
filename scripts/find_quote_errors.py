import re

content = open("src/lib/birthdayData.ts", "r", encoding="utf-8").read()

# Let's inspect all lines starting around line 6000
lines = content.splitlines()
print(f"Total lines: {len(lines)}")

# Let's check for lines with odd number of unescaped single quotes
for idx, line in enumerate(lines[5900:], start=5901):
    # Ignore comments or lines without quotes
    if "'" not in line:
        continue
    # Count unescaped single quotes
    # Replace escaped \' first
    clean = line.replace("\\'", "")
    # Check if single quote count is odd
    q_count = clean.count("'")
    if q_count % 2 != 0:
        print(f"Line {idx}: {line}")
