# -*- coding: utf-8 -*-
# Best Matching Sentences with BERT Tool

import glob
import os
import concurrent.futures
from docx import Document
import csv
import fitz
import re
from rapidfuzz import fuzz
import numpy as np

# Try to import BERT dependencies
try:
    from sentence_transformers import SentenceTransformer
    from sklearn.metrics.pairwise import cosine_similarity
    BERT_AVAILABLE = True
    model = SentenceTransformer('distilbert-base-uncased')
except ImportError:
    BERT_AVAILABLE = False

def read_file(file_name):
    """Read file and split into sentences"""
    try:
        text = ""
        if file_name.endswith(".txt"):
            with open(file_name, "r", encoding="utf-8") as f:
                text = f.read()
        elif file_name.endswith(".docx"):
            doc = Document(file_name)
            text = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
        elif file_name.endswith(".csv"):
            with open(file_name, newline='', encoding='utf-8') as f:
                text = "\n".join([" ".join(row) for row in csv.reader(f)])
        elif file_name.endswith(".pdf"):
            doc = fitz.open(file_name)
            text = "\n".join([page.get_text() for page in doc])
            doc.close()
        
        # Split into sentences
        sentences = re.split(r'(?<=[.!?])\s+', text)
        return [s.strip() for s in sentences if len(s.strip()) > 15]
    except Exception as e:
        print(f"Error reading {file_name}: {e}")
        return []

def find_best_sentences(query, sentences, top_k=3):
    """Find best sentences using BERT or keyword matching"""
    if not sentences:
        return []
    
    # Clean sentences
    clean_sentences = [re.sub(r'\s+', ' ', s).strip() for s in sentences if len(s.strip()) > 15]
    
    if BERT_AVAILABLE:
        try:
            # BERT similarity
            query_emb = model.encode([query])
            sent_embs = model.encode(clean_sentences)
            similarities = cosine_similarity(query_emb, sent_embs)[0]
            
            top_indices = np.argsort(similarities)[::-1][:top_k]
            return [(clean_sentences[i], float(similarities[i])) 
                   for i in top_indices if similarities[i] > 0.2]
        except Exception as e:
            print(f"BERT error: {e}")
    
    # Fallback: keyword matching
    query_words = query.lower().split()
    scores = []
    
    for sentence in clean_sentences:
        words = sentence.lower().split()
        matches = sum(1 for qw in query_words 
                     if any(fuzz.ratio(qw, w) > 70 for w in words))
        if matches > 0:
            score = matches / len(query_words)
            scores.append((sentence, score))
    
    scores.sort(key=lambda x: x[1], reverse=True)
    return scores[:top_k]

def find_files():
    """Find all supported files"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    base_path = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(current_dir))))
    me_path = os.path.join(base_path, "me")
    
    if os.path.exists(me_path):
        patterns = [f"{me_path}/**/*.{ext}" for ext in ['txt', 'pdf', 'docx', 'csv']]
        files = [f for pattern in patterns for f in glob.glob(pattern, recursive=True)]
        print(f"Found {len(files)} files")
        return files[:10]  # Limit to 10 files for performance
    
    return []

def analyze_file_with_bert(args):
    """Analyze a single file using BERT for sentence similarity"""
    query, file_path = args
    try:
        sentences = read_file(file_path)
        if not sentences:
            return None
        
        best_sentences = find_best_sentences(query, sentences, top_k=3)
        
        if best_sentences:
            # Calculate overall file relevance score
            avg_score = sum(score for _, score in best_sentences) / len(best_sentences)
            return {
                'file_path': file_path,
                'avg_score': avg_score,
                'best_sentences': best_sentences
            }
        return None
    
    except Exception as e:
        print(f"Error analyzing file {file_path}: {e}")
        return None

def score_filename(keywords, file_path):
    """Score filename relevance based on keywords"""
    filename = os.path.basename(file_path).lower()
    score = 0
    for keyword in keywords:
        if keyword.lower() in filename:
            score += 1
    return score

def sort_files_by_relevance(files, similar_words):
    """Sort files by filename relevance to keywords"""
    file_scores = []
    for file_path in files:
        filename_score = score_filename(similar_words, file_path)
        file_scores.append((file_path, filename_score))
    
    # Sort by filename score (descending)
    file_scores.sort(key=lambda x: x[1], reverse=True)
    return [file_path for file_path, _ in file_scores]

def tool(searching_word, similar_words):
    """
    Find the 5 best sentences using BERT semantic similarity or keyword matching as fallback
    
    Args:
        searching_word (str): The main search query
        similar_words (list): List of similar words to expand search
    
    Returns:
        dict: Dictionary containing the best matching sentences with their scores and source files
    """
    print("-" * 100)
    print(f"Searching for: {searching_word}")
    print(f"Similar words: {similar_words}")
    print(f"BERT available: {BERT_AVAILABLE}")
    
    # Handle different input types for similar_words
    if isinstance(similar_words, dict):
        similar_words = list(similar_words.values())
    elif isinstance(similar_words, str):
        similar_words = [similar_words]
    elif not isinstance(similar_words, list):
        similar_words = [str(similar_words)]
    
    # Combine main search word with similar words for comprehensive search
    all_keywords = [searching_word] + similar_words
    search_query = " ".join(all_keywords)
    
    print(f"Combined search query: {search_query}")
    
    files = find_files()
    if not files:
        return {"error": "No files found to search"}
    
    print(f"Found {len(files)} files to search")
    
    # Sort files by filename relevance first
    sorted_files = sort_files_by_relevance(files, all_keywords)
    
    # Analyze files with BERT or keyword matching
    all_results = []
    
    # Use ThreadPoolExecutor for parallel processing
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        args_list = [(search_query, file_path) for file_path in sorted_files[:8]]  # Limit to top 8 files
        
        futures = [executor.submit(analyze_file_with_bert, args) for args in args_list]
        
        for future in concurrent.futures.as_completed(futures):
            try:
                result = future.result()
                if result and result['avg_score'] > 0.2:  # Minimum relevance threshold
                    all_results.append(result)
            except Exception as e:
                print(f"Error processing file: {e}")
    
    # Sort results by average score
    all_results.sort(key=lambda x: x['avg_score'], reverse=True)
    
    # Collect the best 5 sentences overall
    best_sentences = []
    for result in all_results:
        for sentence, score in result['best_sentences']:
            if len(best_sentences) < 5:
                best_sentences.append({
                    'sentence': sentence,
                    'score': round(score, 3),
                    'file_path': result['file_path'].split('/')[-1],  # Just filename
                    'full_path': result['file_path']
                })
    
    # Sort by individual sentence scores
    best_sentences.sort(key=lambda x: x['score'], reverse=True)
    
    if not best_sentences:
        return {
            "message": "Aucune phrase pertinente trouvée",
            "search_query": search_query,
            "files_searched": len(sorted_files[:8]),
            "method_used": "BERT" if BERT_AVAILABLE else "Keyword matching"
        }
    
    return {
        "search_query": search_query,
        "files_searched": len(sorted_files[:8]),
        "best_sentences": best_sentences[:5],
        "total_relevant_files": len(all_results),
        "method_used": "BERT" if BERT_AVAILABLE else "Keyword matching"
    }
