import io
from docx import Document


def extract_text_from_docx(data):
    doc = Document(io.BytesIO(data))
    return "\n".join([para.text.strip() for para in doc.paragraphs if para.text.strip()])


