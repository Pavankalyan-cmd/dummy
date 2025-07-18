from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from services.parser import extract_text_from_pdf, extract_text_from_docx, clean_spacing, clean_jd_data
from firebase_config import verify_firebase_token, db
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
import re
import uuid

# Load environment variables
load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

router = APIRouter()

class JobDescription(BaseModel):
    jobtitle: str
    company: str
    location: Optional[str]
    required_experience: Optional[str]
    job_type: Optional[str]
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
async def upload_multiple_jds(
    request: Request,
    jd_files: List[UploadFile] = File(...)
):
    uid = verify_firebase_token(request)
    results = []

    for jd_file in jd_files:
        try:
            jd_content = await jd_file.read()

            if jd_file.filename.endswith(".pdf"):
                jd_text = extract_text_from_pdf(jd_content)
            elif jd_file.filename.endswith(".docx"):
                jd_text = extract_text_from_docx(jd_content)
            else:
                raise HTTPException(status_code=400, detail=f"Unsupported JD format: {jd_file.filename}")

            jd_schema = JobDescription.schema_json(indent=2)
            prompt = f"""
            You are an information extraction engine.

            Task: Read the resume text below and extract ONLY the information that is explicitly supported by the text. Do NOT guess or invent anything.

            Output: return ONLY valid JSON. Do not include comments, markdown, or extra text.
            Extract the following job description fields:

            - jobtitle
            - company
            - location
            - required_experience
            - job_type
            - required_skills
            - responsibilities
            - qualifications
            - salary_range
            - posted_date
            - contact_email
            - description

            Match this schema:
            {jd_schema}

            JD Text:
            \"\"\"{jd_text}\"\"\"
            """

            response = model.generate_content(prompt)
            raw_output = getattr(response, "text", None)
            print(f"Raw output for {jd_file.filename}:", raw_output)

            cleaned_json_str = extract_json_from_response(raw_output)
            parsed_json = json.loads(cleaned_json_str)
            cleaned_data = clean_jd_data(parsed_json)
            jd_data = JobDescription.parse_obj(cleaned_data)

            jd_id = str(uuid.uuid4())
            jd_dict = jd_data.dict()
            jd_dict.update({
                "uid": uid,
                "jd_id": jd_id
            })

            db.collection("users").document(uid).collection("job_descriptions").document(jd_id).set(jd_dict)

            results.append({
                "filename": jd_file.filename,
                "jd_id": jd_id,
                "parsed_data": jd_dict
            })

        except Exception as e:
            results.append({
                "filename": jd_file.filename,
                "error": str(e)
            })

    return {
        "status": "completed",
        "uid": uid,
        "results": results
    }




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
