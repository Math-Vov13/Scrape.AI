from docx import Document
import easyocr
import csv
from PyPDF2 import PdfReader


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
"""def img_reader(file_name):
    reader = easyocr.Reader(['fr']) 
    result = reader.readtext(file_name)
    return str(result)"""
def pdf_reader(file_name):
    reader = PdfReader(file_name)
    lines = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            for line in text.splitlines():
                lines.append(line)
    return lines

def read_file(file_name):
    if file_name.endswith(".txt"):
        return txt_reader(file_name)
    elif file_name.endswith(".docx"):
        return docx_reader(file_name)
    elif file_name.endswith(".csv"):
        return csv_reader(file_name)
    elif file_name.endswith(".pdf"):
        return pdf_reader(file_name)
    """elif file_name.endswith(".png"):
        return img_reader(file_name)"""

