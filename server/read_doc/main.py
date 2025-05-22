from read_file import read_file
from Levenshtein import Levenshtein
import glob
import time 

def find_files():
    return glob.glob("me/**/*.txt", recursive=True) + glob.glob("me/**/*.pdf", recursive=True)


start=time.time()

files = find_files()
print("\n\n")
for file in files:
    score,line = Levenshtein("Chien", read_file(file))

    print(f"Score du fichier : {score}")
    print("\n Meilleures correspondances\n")

    for i in line: 
        print(f"-- {i}")
    print("\n--------------------------------------------")


end=time.time()
print(end-start)