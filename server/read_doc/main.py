from read_file import read_file
from Levenshtein import Levenshtein,files_ordered
import glob
import time
import concurrent.futures

def find_files():
    return glob.glob("me/**/*.txt", recursive=True) + glob.glob("me/**/*.pdf", recursive=True)

def analyse_file(args):
    mot, file_path = args
    contenu_fichier = read_file(file_path)
    return Levenshtein(mot, contenu_fichier)


def analyse_files(mot, files,similar_words, max_workers: int = 1):
    with concurrent.futures.ProcessPoolExecutor(max_workers=max_workers) as executor:
        
        list_exec=files_ordered(files,similar_words)
        args_list = [(mot, file) for file in list_exec]

        futures = [executor.submit(analyse_file, args) for args in args_list]
        for future in concurrent.futures.as_completed(futures):
            try:
                resultat = future.result()
                yield resultat
            except Exception as e:
                print(f"Erreur lors de l'analyse: {e}")
                yield None

if __name__ == "__main__":
    mot_recherche = "Chien"
    similar_words=["animaux","bete","dom","chienne","chien"] 
    files = find_files()
    start = time.time()


    j=0
    for i in analyse_files(mot_recherche, files,similar_words):
        print(j,end="")
        if i[0]>2:
            print("\t\tBINGO")
            print(i,end="\n")
        print("---")
        j+=1
        
    temps_processes = time.time() - start
    print(f"Temps processus: {temps_processes:.2f} secondes")
    

