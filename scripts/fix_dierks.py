with open("src/lib/birthdayData.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("What Was I Thinkin',", "What Was I Thinking,")

with open("src/lib/birthdayData.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed line 7208!")
