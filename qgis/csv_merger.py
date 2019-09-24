# Simple csv merge script
import os
import glob

country = input("What country should be merged?")

pathList = glob.glob(f"./data/Output/{country}*.csv")

fout = open(f"./data/{country}-merged_data.csv", "w")

print(f"Beggining merge of {pathList} into {fout.name}")
first = True
for file in pathList:
    if file.endswith(".csv") and file != "merged_data.csv":
        print(f"Adding file {file}...")
        f = open(file, "r")
        if first:
            first = False
        else:
            f.readline()  # skip the header
        for line in f:
            fout.write(line)
        print(f"Success")
        f.close()  # not really needed
print(f"Merged all files")
fout.close()
