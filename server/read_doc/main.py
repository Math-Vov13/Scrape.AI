from read_file import read_file
from Levenshtein import Levenshtein,files_ordered
import glob
import concurrent.futures

def find_files():
    return glob.glob("me/**/*.txt", recursive=True) + glob.glob("me/**/*.pdf", recursive=True)

def analyse_file(args):
    mot, file_path = args
    contenu_fichier = read_file(file_path)
    result = Levenshtein(mot, contenu_fichier)
    result.append(file_path)
    return result


def analyse_files(mot, files,similar_words, max_workers: int = 8):
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


def connection_mcp(mot_recherche,files,mots_similaire):
    positive_file_count=0
    result=[]
    for i in analyse_files(mot_recherche,files,mots_similaire):
        
        if i[0]>2:
            result.append(i)
            positive_file_count+=1

            if positive_file_count==2:
                break
    return result



    
if __name__ == "__main__":
    mot_recherche = "Capgemini"
    similar_words=["animaux","bete","dom","chienne","chien"] 
    

    files = find_files()

    print(connection_mcp(mot_recherche, files, similar_words))

