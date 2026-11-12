with open("src/lib/birthdayData.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("King T'Challa", "King T\\'Challa")

with open("src/lib/birthdayData.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed King T'Challa!")
