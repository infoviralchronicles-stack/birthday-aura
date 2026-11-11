import os

slugs = [
    # Nov 17 (9 new)
    "martin-scorsese", "danny-devito", "rupaul", "leslie-bibb", "tom-seaver",
    "sophie-marceau", "gordon-lightfoot", "rock-hudson", "lorne-michaels",
    # Nov 18 (10)
    "owen-wilson", "david-ortiz", "kirk-hammett", "chloe-sevigny", "damon-wayans-jr",
    "delroy-lindo", "alan-shepard", "margaret-atwood", "peter-schmeichel", "nasim-pedrad",
    # Nov 19 (10)
    "jodie-foster", "meg-ryan", "adam-driver", "larry-king", "calvin-klein",
    "allison-janney", "tyga", "patrick-kane", "indira-gandhi", "ted-turner",
    # Nov 20 (10)
    "joe-biden", "future", "ming-na-wen", "joel-mchale", "bo-derek",
    "robert-f-kennedy", "callan-mcauliffe", "dierks-bentley", "sean-young", "edwin-hubble",
    # Nov 21 (10)
    "carly-rae-jepsen", "goldie-hawn", "jena-malone", "michael-strahan", "bjork",
    "ken-griffey-jr", "marlo-thomas", "voltaire", "stan-musial", "nicollette-sheridan",
]

missing = [s for s in slugs if not os.path.exists(f"public/celebrities/{s}.jpg")]
print(f"Total verified: {len(slugs) - len(missing)} / {len(slugs)}")
if missing:
    print(f"Missing: {missing}")
else:
    print("ALL 49 PORTRAITS EXIST AND ARE READY!")
