#Simple csv merge script
import os

fout=open("merged_data.csv","w")
first = True
for file in os.listdir("."):
    if file.endswith(".csv") and file != "merged_data.csv": 
        print(file)
        f = open(file, "r")
        if (first):
            first = False
        else:
            f.readline() # skip the header
        for line in f:
            fout.write(line)
        f.close() # not really needed
fout.close()