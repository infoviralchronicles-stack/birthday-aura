with open('src/lib/birthdayData.ts', 'r', encoding='utf-8', errors='replace') as f:
    text = f.read()

text = text.replace("name: 'Sisq\ufffdo'", "name: 'Sisqo'")
text = text.replace("name: 'Sven-G\ufffdran Eriksson'", "name: 'Sven-Goran Eriksson'")
text = text.replace("name: 'Lu\ufffds Figo'", "name: 'Luis Figo'")

with open('src/lib/birthdayData.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Normalized names successfully!")
