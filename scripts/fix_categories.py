import re

path = 'src/lib/birthdayData.ts'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace Comedians with Actors
text = text.replace("category: 'Comedians',", "category: 'Actors',")

valid = {'Creators', 'Actors', 'Musicians', 'Athletes'}
entries = text.split('{')
for e in entries:
    m_id = re.search(r"id:\s*'([^']+)'", e)
    m_cat = re.search(r"category:\s*'([^']+)'", e)
    if m_id and m_cat:
        if m_cat.group(1) not in valid:
            print(f"INVALID: {m_id.group(1)} -> {m_cat.group(1)}")

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated categories successfully!")
