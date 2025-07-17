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


def clean_spacing(text: str) -> str:
    collapsed = re.sub(r'(?<!\w)(?:[A-Za-z]\s+){2,}[A-Za-z](?!\w)', lambda m: ''.join(m.group(0).split()), text)
    normalized = re.sub(r'\s+', ' ', collapsed)
    return normalized.strip()

def clean_candidate_data(data: dict) -> dict:
    data["name"] = clean_spacing(data["name"])
    data["designation"] = clean_spacing(data["designation"])
    data["professional_summary"] = clean_spacing(data["professional_summary"])

    data["certifications"] = [clean_spacing(c) for c in data.get("certifications", [])]
    data["technical_skills"] = [clean_spacing(s) for s in data.get("technical_skills", [])]
    data["key_achievements"] = [clean_spacing(a) for a in data.get("key_achievements", [])]

    for edu in data.get("education", []):
        edu["degree"] = clean_spacing(edu["degree"])
        edu["institution"] = clean_spacing(edu["institution"])

    for project in data.get("projects", []):
        project["title"] = clean_spacing(project["title"])
        project["description"] = clean_spacing(project["description"])

    return data
def normalize_experience(text: str) -> int | None:
    """
    Extracts numeric experience in years from strings like:
    - "3+ years"
    - "at least 2 years"
    - "5 yrs experience"
    Returns an integer (e.g., 3), or None if not found.
    """
    match = re.search(r'(\d+)', text)
    if match:
        return int(match.group(1))
    return None

def extract_years_experience(text: str) -> str:
    # Extract patterns like "4 years", "4+ years", "3-5 years"
    match = re.search(r"\d+\s*\+?\s*[-–]?\s*\d*\s*years?", text.lower())
    return match.group().strip() if match else text

def clean_jd_data(data: dict) -> dict:
    data["jobtitle"] = clean_spacing(data["jobtitle"])
    data["company"] = clean_spacing(data["company"])
    data["location"] = clean_spacing(data.get("location", "")) if data.get("location") else None
    data["required_experience"] = extract_years_experience(data.get("required_experience", ""))  # <-- fixed here

    data["job_type"] = clean_spacing(data.get("job_type", "")) if data.get("job_type") else None
    data["required_skills"] = [clean_spacing(skill) for skill in data.get("required_skills", [])]
    data["responsibilities"] = clean_spacing(data.get("responsibilities", "")) if data.get("responsibilities") else None
    data["qualifications"] = clean_spacing(data["qualifications"])
    data["salary_range"] = clean_spacing(data.get("salary_range", "")) if data.get("salary_range") else None
    data["posted_date"] = clean_spacing(data.get("posted_date", "")) if data.get("posted_date") else None
    data["contact_email"] = clean_spacing(data.get("contact_email", "")) if data.get("contact_email") else None
    data["description"] = clean_spacing(data["description"])
    return data

def clean_jd_data(data: dict) -> dict:
    data["jobtitle"] = clean_spacing(data["jobtitle"])
    data["company"] = clean_spacing(data["company"])
    data["location"] = clean_spacing(data.get("location", "")) if data.get("location") else None
    data["required_experience"] = clean_spacing(data.get("required_experience", "")) if data.get("required_experience") else None
    data["job_type"] = clean_spacing(data.get("job_type", "")) if data.get("job_type") else None
    data["required_skills"] = [clean_spacing(skill) for skill in data.get("required_skills", [])]
    data["responsibilities"] = clean_spacing(data.get("responsibilities", "")) if data.get("responsibilities") else None
    data["qualifications"] = clean_spacing(data["qualifications"])
    data["salary_range"] = clean_spacing(data.get("salary_range", "")) if data.get("salary_range") else None
    data["posted_date"] = clean_spacing(data.get("posted_date", "")) if data.get("posted_date") else None
    data["contact_email"] = clean_spacing(data.get("contact_email", "")) if data.get("contact_email") else None
    data["description"] = clean_spacing(data["description"])
    return data


def normalize_experience(text: str) -> int | None:
    """
    Extracts numeric experience in years from strings like:
    - "3+ years"
    - "at least 2 years"
    - "5 yrs experience"
    Returns an integer (e.g., 3), or None if not found.
    """
    match = re.search(r'(\d+)', text)
    if match:
        return int(match.group(1))
    return None
