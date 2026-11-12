with open("src/lib/birthdayData.ts", "r", encoding="utf-8") as f:
    content = f.read()

replacements = [
    ("Palme d'Or", "Palme d\\'Or"),
    ("I'm the One", "I\\'m the One"),
    ("Queen of Rock 'n' Roll", "Queen of Rock \\'n\\' Roll"),
    ("What's Love Got to Do with It", "What\\'s Love Got to Do with It"),
    ("It's the Great Pumpkin, Charlie Brown", "It\\'s the Great Pumpkin, Charlie Brown"),
    ("Chitlin' Circuit", "Chitlin\\' Circuit"),
    ("master's degree", "master\\'s degree"),
    ("St. Elmo's Fire", "St. Elmo\\'s Fire"),
    ("It's Raining Men", "It\\'s Raining Men"),
    ("Ma Rainey's Black Bottom", "Ma Rainey\\'s Black Bottom"),
    ("Ocean's Eleven", "Ocean\\'s Eleven"),
    ("What's Your Number?", "What\\'s Your Number?"),
    ("Bobby's World", "Bobby\\'s World"),
    ("Yuk Yuk's", "Yuk Yuk\\'s"),
    ("Metallica's Enter Sandman", "Metallica\\'s Enter Sandman"),
    ("There's Something About Mary", "There\\'s Something About Mary"),
]

for old, new in replacements:
    content = content.replace(old, new)

with open("src/lib/birthdayData.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Applied replacements!")
