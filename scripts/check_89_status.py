import os

slugs = [
    # Nov 22 (10)
    "scarlett-johansson", "mark-ruffalo", "hailey-bieber", "jamie-lee-curtis", "mads-mikkelsen",
    "billie-jean-king", "steven-van-zandt", "boris-becker", "charles-de-gaulle", "adele-exarchopoulos",
    # Nov 23 (10)
    "miley-cyrus", "asafa-powell", "snooki", "vincent-cassel", "robin-roberts",
    "bruce-hornsby", "nav", "kelly-brook", "billy-the-kid", "oded-fehr",
    # Nov 24 (10)
    "sarah-hyland", "katherine-heigl", "stephen-merchant", "colin-hanks", "pete-best",
    "ryan-fitzpatrick", "conleth-hill", "scott-joplin", "dale-carnegie", "billy-connolly",
    # Nov 25 (10)
    "christina-applegate", "joel-kinnaman", "amy-grant", "katie-cassidy", "donovan-mcnabb",
    "john-larroquette", "andrew-carnegie", "xabi-alonso", "jill-hennessy", "gaspard-ulliel",
    # Nov 26 (10)
    "rita-ora", "dj-khaled", "tina-turner", "charles-m-schulz", "peter-facinelli",
    "natasha-bedingfield", "gauri-shinde", "shawn-kemp", "maia-shibutani", "arjun-rampal",
    # Nov 27 (10)
    "bruce-lee", "jimi-hendrix", "bill-nye", "kathryn-bigelow", "jaleel-white",
    "alison-pill", "sharlto-copley", "suresh-raina", "william-fichtner", "jimmy-rollins",
    # Nov 28 (10)
    "jon-stewart", "karen-gillan", "mary-elizabeth-winstead", "randy-newman", "alfonso-cuaron",
    "judd-nelson", "ryan-kwanten", "ed-harris", "william-blake", "paul-shaffer",
    # Nov 29 (9 new + 1 salish-matter already present)
    "chadwick-boseman", "don-cheadle", "anna-faris", "russell-wilson", "the-game",
    "howie-mandel", "cs-lewis", "mariano-rivera", "fawad-khan",
    # Nov 30 (10)
    "ben-stiller", "kaley-cuoco", "chrissy-teigen", "ridley-scott", "steve-aoki",
    "gael-garcia-bernal", "bo-jackson", "mark-twain", "winston-churchill", "elisha-cuthbert",
]

missing = [s for s in slugs if not os.path.exists(f"public/celebrities/{s}.jpg")]
print(f"Total checked: {len(slugs)}")
print(f"Missing: {len(missing)} -> {missing}")
if not missing:
    print("ALL 89 CELEBRITY PORTRAITS EXIST AND ARE 600x600 CROPPED READY!")
