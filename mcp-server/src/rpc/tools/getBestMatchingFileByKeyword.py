import glob
import concurrent.futures
from docx import Document
import csv
import fitz
import re
from rapidfuzz import fuzz
import statistics
from docx import Document
import csv
import fitz  




def txt_reader(file_name):
    with open(file_name,"r",encoding="utf-8") as file:
        full_text = file.readlines()
    return full_text
def docx_reader(file_name):
    doc = Document(file_name)
    full_text = [paragraph.text for paragraph in doc.paragraphs]
    return full_text
def csv_reader(file_name):
    with open(file_name, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        rows = ['\t'.join(row) for row in reader]
        return str('\n'.join(rows))
def pdf_reader(file_name):
    doc = fitz.open(file_name)
    lignes = []
    for page in doc:
        for bloc in page.get_text("dict")["blocks"]:
            if "lines" in bloc:
                for ligne in bloc["lines"]:
                    texte = " ".join([span["text"] for span in ligne["spans"]])
                    lignes.append(texte)
    return lignes


def read_file(file_name):
    if file_name.endswith(".txt"):
        return txt_reader(file_name)
    elif file_name.endswith(".docx"):
        return docx_reader(file_name)
    elif file_name.endswith(".csv"):
        return csv_reader(file_name)
    elif file_name.endswith(".pdf"):
        return pdf_reader(file_name)
    




def clean(s):
    return re.sub(r"[^A-Za-zÀ-ÖØ-öø-ÿĀ-ž ']+", "", s)

def score_content(note):
    total=0
    for i in note:
        total+=(i/100)**10
    return (statistics.median(note)/90)+round(total,3)

def score_filename(liste_mot :list[str],title):
    banned_word=['txt', 'pdf','copy','copie']
    filename = title.split('/')[-1] if '/' in title else title
    liste = re.split(r'[^A-Za-zÀ-ÖØ-öø-ÿĀ-ž]', filename)
    liste = [word.lower() for word in liste if word.lower() not in banned_word]
    best_score=0
    for i in liste:
        for mot in liste_mot:
            score=fuzz.ratio(mot,i)
            if best_score<score:
                best_score=score
    return best_score

def folder_path(list_path):
    dict_path={}
    value=[]
    last_key="/".join(list_path[0].split("/")[:-1])

    for i in list_path:
        key="/".join(i.split("/")[:-1])
        if last_key!=key:
            dict_path[last_key]=value
            value=[]

        value.append(i.rsplit("/")[-1])
        last_key=key

    dict_path[last_key]=value
    return dict_path

def score_folders(words_list,folder_names):
    best_score=0
    list_file_score=[]
    last_word=[]
    for j in folder_names:
        for word in words_list:
            if word==last_word and len(words_list)>1:
                list_file_score.append([j,best_score])
            folder_name = j.rsplit("/")[-1]
            folder_name = re.sub(r'[^A-Za-zÀ-ÖØ-öø-ÿĀ-ž _ \- ]', '', folder_name)
            folder_name = re.split(r'[.\(\):,;\+=&_ \-]', folder_name)

            for i in folder_name:
                score=fuzz.ratio(word,i)
                if score>best_score:
                    best_score=score
            last_word=word
        list_file_score.append([j,best_score])
        best_score=0
    return list_file_score



def files_ordered(list_files,similar_words):
    folder_number= score_folders(similar_words,folder_path(list_files))
    folder_number.sort(key=lambda x: x[1], reverse=True)
    temp_folder_score=[]
    for j in folder_number:
        temp_folder_score.append(j[0])
    files_path=folder_path(list_files)


    temp_filename_score=[]
    folder_plus_file=[]
    temp=[]
    for i in temp_folder_score:
        for j in files_path[i]:
            folder_plus_file.append(i)
            temp.append([j,score_filename(similar_words,j)])
        temp_filename_score.append(temp)
        temp=[]



    for sublist in temp_filename_score:
        sublist.sort(key=lambda x: x[1], reverse=True)
    
    result_files = []
    i=0
    for folder_files in temp_filename_score:
        for file_data in folder_files:
            result_files.append(str(folder_plus_file[i])+"/"+str(file_data[0]))
            i+=1
    return result_files    




def Levenshtein(target, text_lines):
    target=target.lower()
    result=[]
    best_score=0
    for line in text_lines:
        filtered = clean(line)
        for i in filtered.split():
            score = fuzz.ratio(target, i.lower())
            if score > best_score:
                best_score=score
        
        if len(result)<5:
            result.append([filtered,best_score])
            result.sort(key=lambda x: x[1], reverse=True)
        else:
            if best_score > result[-1][1]:
                result[-1] = [filtered, best_score]
                result.sort(key=lambda x: x[1], reverse=True)
        best_score=0

    s=[]
    rl=[]
    for j in result:
        rl.append(j[0])
        s.append(j[1])
    return [score_content(s),rl]


def find_files():
    return glob.glob("me/**/*.txt", recursive=True) + glob.glob("me/**/*.pdf", recursive=True) + glob.glob("me/**/*.docx", recursive=True)

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


def tool(searching_word,similar_words):
    positive_file_count=0
    result=[]

    files=find_files()
    for i in analyse_files(searching_word,files,similar_words):
        print(i)
        if i[0]>1:
            result.append(i[-1])
            positive_file_count+=1
        if positive_file_count==1 and i[0]>1:
            return read_file(result)
    return "No file"

