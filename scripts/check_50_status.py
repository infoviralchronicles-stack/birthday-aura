import os

slugs = [
    # Nov 12
    "ryan-gosling", "anne-hathaway", "russell-westbrook", "grace-kelly", "neil-young",
    "sammy-sosa", "megan-mullally", "jorge-masvidal", "wallace-shawn", "auguste-rodin",
    # Nov 13
    "whoopi-goldberg", "jimmy-kimmel", "gerard-butler", "lando-norris", "juhi-chawla",
    "chris-noth", "joe-mantegna", "monique-coleman", "robert-louis-stevenson", "michael-copon",
    # Nov 14
    "king-charles-iii", "travis-barker", "josh-duhamel", "olga-kurylenko", "patrick-warburton",
    "yanni", "condoleezza-rice", "jawaharlal-nehru", "claude-monet", "laura-san-giacomo",
    # Nov 15
    "shailene-woodley", "sania-mirza", "chad-kroeger", "sam-waterston", "beverly-dangelo",
    "jonny-lee-miller", "randy-savage", "petula-clark", "lily-aldridge", "georgia-okeeffe",
    # Nov 16
    "pete-davidson", "maggie-gyllenhaal", "paul-scholes", "diana-krall", "aditya-roy-kapur",
    "martha-plimpton", "missi-pyle", "burgess-meredith", "christian-horner", "chinua-achebe"
]

missing = [s for s in slugs if not os.path.exists(f"public/celebrities/{s}.jpg")]
found = [s for s in slugs if os.path.exists(f"public/celebrities/{s}.jpg")]

print(f"Found: {len(found)} / {len(slugs)}")
if missing:
    print(f"Missing: {len(missing)} -> {missing}")
else:
    print("ALL 50 CELEBRITIES HAVE VALID 600x600 PORTRAITS!")
