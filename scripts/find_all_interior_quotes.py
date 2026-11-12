with open("src/lib/birthdayData.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Let's fix line 8738 first
content = content.replace("the Ocean's franchise", "the Oceans franchise")
content = content.replace("Showtime's House of Lies", "Showtimes House of Lies")

# Let's check for any other occurrences of interior single quotes in single-quoted fields
lines = content.splitlines()
suspicious = []
for idx, line in enumerate(lines, 1):
    stripped = line.strip()
    if not (stripped.endswith("',") or stripped.endswith("'")):
        continue
    # Find the opening quote
    colon_idx = stripped.find(":")
    if colon_idx == -1:
        continue
    val_part = stripped[colon_idx+1:].strip()
    if not (val_part.startswith("'") and (val_part.endswith("',") or val_part.endswith("'"))):
        continue
    # Strip opening and closing quotes
    end_strip = 2 if val_part.endswith("',") else 1
    inner = val_part[1:-end_strip]
    # Check for unescaped '
    # Replace \' with blank
    clean_inner = inner.replace("\\'", "")
    if "'" in clean_inner:
        suspicious.append((idx, stripped))

print(f"Suspicious lines remaining: {len(suspicious)}")
for idx, s in suspicious:
    print(f"  Line {idx}: {s}")

with open("src/lib/birthdayData.ts", "w", encoding="utf-8") as f:
    f.write(content)
