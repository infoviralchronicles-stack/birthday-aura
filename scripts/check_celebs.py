import re

with open('src/lib/birthdayData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# find blocks
entries = text.split('{')
nov3 = []
nov4 = []
for e in entries:
    if 'birthMonth: 11' in e:
        if 'birthDay: 3' in e:
            m = re.search(r"id:\s*['\"]([^'\"]+)['\"]", e)
            if m: nov3.append(m.group(1))
        elif 'birthDay: 4' in e:
            m = re.search(r"id:\s*['\"]([^'\"]+)['\"]", e)
            if m: nov4.append(m.group(1))

print("Nov 3 entries:", nov3)
print("Nov 4 entries:", nov4)
