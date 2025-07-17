from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from services.parser import extract_text_from_pdf, extract_text_from_docx,clean_spacing,clean_jd_data
from firebase_config import verify_firebase_token
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
import re
from firebase_config import db
import uuid

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

router = APIRouter()


class JobDescription(BaseModel):
    jobtitle: str
    company: str
    location: Optional[str]
    required_experience: Optional[str]
    job_type: Optional[str]  # Full-time, Part-time, Internship, etc.
    required_skills: List[str]
    responsibilities: Optional[str]
    qualifications: str
    salary_range: Optional[str]
    posted_date: Optional[str]
    contact_email: Optional[str]
    description: str
def extract_json_from_response(text: str) -> str:
    try:
        json_match = re.search(r"\{.*\}", text, re.DOTALL)
        if not json_match:
            raise ValueError("No valid JSON object found in response.")
        return json_match.group(0)
    except Exception as e:
        raise ValueError(f"Failed to extract JSON: {str(e)}")



@router.post("/upload-jd")
async def upload_jd(
    request: Request,
    jd_file: UploadFile = File(...)
):
    uid = verify_firebase_token(request)

    try:
        jd_content = await jd_file.read()

        if jd_file.filename.endswith(".pdf"):
            jd_text = extract_text_from_pdf(jd_content)
        elif jd_file.filename.endswith(".docx"):
            jd_text = extract_text_from_docx(jd_content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported JD format")
        print(jd_text)
   

        jd_schema = JobDescription.schema_json(indent=2)
        prompt = f"""
         You are an information extraction engine.

        Task: Read the resume text below and extract ONLY the information that is explicitly supported by the text. Do NOT guess or invent anything.

        Output: return ONLY valid JSON. Do not include comments, markdown, or extra text.
        Extract the following candidate fields:
        Here is a description of what each field represents:
        - jobtitle: Title of the job role (e.g., Software Engineer)
        - company: Name of the hiring company
        - location: City or address where the job is located (if available)
        - required_experience: Experience level required for the job (e.g., 3+ years, Entry level)
        - job_type: Type of job (e.g., Full-time, Part-time, Internship, Contract)
        - required_skills: A list of required technical and soft skills (e.g., ["Python", "Communication", "React"])
        - responsibilities: Main responsibilities and duties expected in this role
        - qualifications: Required educational background or degrees
        - salary_range: Salary mentioned, if any (e.g., "₹8-10 LPA" or "$60,000-$80,000")
        - posted_date: When the job was posted (if mentioned)
        - contact_email: HR or recruiter email if present
        - description: Full job description as extracted from the document

        Return result as JSON matching this schema:
        {jd_schema}

        JD Text:
        \"\"\"{jd_text}\"\"\"
        """

        response = model.generate_content(prompt)
        raw_output = getattr(response, "text", None)

        cleaned_json_str = extract_json_from_response(raw_output)
        parsed_json = json.loads(cleaned_json_str)
        cleaned_data = clean_jd_data(parsed_json)
        jd_data = JobDescription.parse_obj(cleaned_data)
        print("Parsed JD Data:", repr(jd_data))

        jd_id = str(uuid.uuid4())

        jd_dict = jd_data.dict()
        jd_dict.update({
            "uid": uid,
            "jd_id": jd_id
        })
        print(jd_dict)

        db.collection("users").document(uid).collection("job_descriptions").document(jd_id).set(jd_dict)

        return {
            "status": "success",
            "uid": uid,
            "jd_data": jd_dict
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"JD extraction failed: {str(e)}")




@router.get("/job-descriptions")
async def get_job_descriptions(request: Request):
    try:
        uid = verify_firebase_token(request)

        jd_ref = db.collection("users").document(uid).collection("job_descriptions")
        docs = jd_ref.stream()

        jd_list = []
        for doc in docs:
            jd = doc.to_dict()
            jd["id"] = doc.id
            jd_list.append(jd)

        return {
            "status": "success",
            "uid": uid,
            "job_descriptions": jd_list
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching JDs: {str(e)}")
