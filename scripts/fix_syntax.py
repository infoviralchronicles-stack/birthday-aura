with open('src/lib/birthdayData.ts', 'r', encoding='utf-8', errors='replace') as f:
    text = f.read()

text = text.replace("profession: 'Ballon d'Or Winner & Football Legend'", "profession: 'Ballon dOr Winner and Football Legend'")
text = text.replace("name: 'Lu\ufffds Figo'", "name: 'Luis Figo'")

with open('src/lib/birthdayData.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print('Fixed syntax successfully')
