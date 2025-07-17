import io
import re
from PyPDF2 import PdfReader
from docx import Document
from pdf2image import convert_from_bytes
import pytesseract

def normalize_extracted_text(text: str) -> str:
    text = re.sub(r'(?<!\n)\n(?!\n)', ' ', text)
    text = re.sub(r' +', ' ', text)
    text = re.sub(r'\n{2,}', '\n\n', text)
    return text.strip()

def extract_text_using_ocr(data):
    images = convert_from_bytes(data)
    text = ""
    for img in images:
        text += pytesseract.image_to_string(img) + "\n"
    return text

def extract_text_from_pdf(data):
    text = ""
    reader = PdfReader(io.BytesIO(data))
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"
    if not text.strip():
        text = extract_text_using_ocr(data)
    return normalize_extracted_text(text)

def extract_text_from_docx(data):
    doc = Document(io.BytesIO(data))
    return "\n".join([para.text for para in doc.paragraphs])