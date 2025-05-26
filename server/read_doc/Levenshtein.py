import re
from rapidfuzz import fuzz
import statistics


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
            result.append([line,best_score])
            result.sort(key=lambda x: x[1], reverse=True)
        else:
            if best_score > result[-1][1]:
                result[-1] = [line, best_score]
                result.sort(key=lambda x: x[1], reverse=True)
        best_score=0

    s=[]
    rl=[]
    for j in result:
        rl.append(j[0])
        s.append(j[1])
    return [score_content(s),rl]
