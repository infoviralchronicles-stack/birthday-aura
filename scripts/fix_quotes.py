content = open("src/lib/birthdayData.ts", "r", encoding="utf-8").read()

content = content.replace("name: 'Beverly D'Angelo',", "name: 'Beverly D\\'Angelo',")
content = content.replace("profession: 'Victoria's Secret Angel & Supermodel',", "profession: 'Victoria\\'s Secret Angel & Supermodel',")
content = content.replace("name: 'Georgia O'Keeffe',", "name: 'Georgia O\\'Keeffe',")

with open("src/lib/birthdayData.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed quotes!")
