import re

with open('src/lib/birthdayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

entries = text.split('{')
nov_days = {}

for e in entries:
    if 'birthMonth: 11' in e:
        m_day = re.search(r'birthDay:\s*(\d+)', e)
        m_name = re.search(r"name:\s*['\"]([^'\"]+)['\"]", e)
        if m_day and m_name:
            day = int(m_day.group(1))
            name = m_name.group(1)
            nov_days.setdefault(day, []).append(name)

print("=== NOVEMBER CELEBRITIES IN DATABASE ===")
for d in sorted(nov_days.keys()):
    print(f"Nov {d}: ({len(nov_days[d])}) -> {', '.join(nov_days[d])}")

if 7 not in nov_days:
    print("\nNov 7 (AJ KI DATE): 0 celebrities in database!")
else:
    print(f"\nNov 7 (AJ KI DATE): {len(nov_days[7])} celebrities found: {nov_days[7]}")
