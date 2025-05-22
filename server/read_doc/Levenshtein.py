import re
from rapidfuzz import fuzz
import statistics


def clean(s: str) -> str:
    return re.sub(r"[^A-Za-zÀ-ÖØ-öø-ÿĀ-ž ']+", "", s)

def score_file(note):
    total=0
    note==note[::4]
    for i in note:
        total+=(i/100)**10
    return (statistics.median(note)/90)+round(total,3)

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
    return [score_file(s),rl]


