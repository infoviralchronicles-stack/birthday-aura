with open("src/lib/birthdayData.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "rachel-mcadams" in line:
        print(f"Line {i+1}: {line}")
        for j in range(max(0, i-5), min(len(lines), i+25)):
            print(f"{j+1}: {lines[j]}", end="")
        break
