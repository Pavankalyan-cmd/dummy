from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from services.parser import extract_text_from_pdf, extract_text_from_docx, clean_spacing, clean_candidate_data
from firebase_config import verify_firebase_token, db
from pydantic import BaseModel, Field
from typing import List, Optional
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
import re
from urllib.parse import urlparse

import uuid
from storage.azure import upload_resume_to_azure,delete_resume_from_azure

load_dotenv()


genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

router = APIRouter()

class Education(BaseModel):
    degree: str
    institution: str
    year: Optional[str] = None

class Project(BaseModel):
    title: str
    description: str

class Candidate(BaseModel):
    name: str
    designation: str
    experience: float = Field(..., description="Experience in years (e.g., 3.0)")
    contact_number: str
    email: str
    location: Optional[str] = Field(None, alias="Location") 
    education: List[Education]
    technical_skills: List[str]
    key_achievements: List[str]
    certifications: List[str]
    projects: List[Project]
    professional_summary: str

def extract_json_from_response(text: str) -> str:
    try:
        json_match = re.search(r"\{.*\}", text, re.DOTALL)
        if not json_match:
            raise ValueError("No valid JSON object found in response.")
        return json_match.group(0)
    except Exception as e:
        raise ValueError(f"Failed to extract JSON: {str(e)}")

@router.post("/candidate-resume")
async def candidate_resumes(
    request: Request,
    resumes: List[UploadFile] = File(...)
):
    
    uid = verify_firebase_token(request)
    results = []

    for resume in resumes:
        try:
            resume_content = await resume.read()

            if resume.filename.endswith(".pdf"):
                resume_text = extract_text_from_pdf(resume_content)
            elif resume.filename.endswith(".docx"):
                resume_text = extract_text_from_docx(resume_content)
            else:
                raise HTTPException(status_code=400, detail=f"Unsupported resume format: {resume.filename}")

            candidate_schema_json = Candidate.schema_json(indent=2)
            prompt = f"""
            You are an information extraction engine.

            Task: Read the resume text below and extract ONLY the information that is explicitly supported by the text. Do NOT guess or invent anything.

            Output: return ONLY valid JSON. Do not include comments, markdown, or extra text.
            Extract the following candidate fields:
            - name
            - designation
            - experience
            - Location
            - contact number
            - email
            - education (list of degree, institution, year)
            - technical skills (list of technologies or tools)
            - key achievements
            - certifications
            - projects (list of title and description)
            - professional summary

            Return the result as valid JSON that matches this schema exactly:
            {candidate_schema_json}

            Resume Text:
            \"\"\"
            {resume_text}
            \"\"\"
            """

            generation_config = genai.types.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.0,
                max_output_tokens=2048,
            )

            response = model.generate_content(prompt, generation_config=generation_config)
            raw_output = getattr(response, "text", None)

            cleaned_json_str = extract_json_from_response(raw_output)
            parsed_json = json.loads(cleaned_json_str)
            cleaned_data = clean_candidate_data(parsed_json)

            candidate_data = Candidate.parse_obj(cleaned_data)
            candidate_id = str(uuid.uuid4())
            resume_url = upload_resume_to_azure(
            uid=uid,
            candidate_id=candidate_id,
            filename=resume.filename,
            content=resume_content,
            content_type=resume.content_type or "application/pdf"
             )


            candidate_dict = candidate_data.dict()
            candidate_dict.update({
                "uid": uid,
                "candidate_id": candidate_id,
                "resume_url": resume_url,
            })

            db.collection("users").document(uid).collection("candidates").document(candidate_id).set(candidate_dict)

            results.append({
                "filename": resume.filename,
                "candidate_id": candidate_id,
                "parsed_data": candidate_dict
            })

        except Exception as e:
            results.append({
                "filename": resume.filename,
                "error": str(e)
            })

    return {
        "status": "completed",
        "uid": uid,
        "results": results
    }

@router.get("/candidate-resumes")
async def get_candidate_resumes(request: Request):
    try:
        uid = verify_firebase_token(request)

        candidates_ref = db.collection("users").document(uid).collection("candidates")
        docs = candidates_ref.stream()

        candidate_list = []
        for doc in docs:
            candidate = doc.to_dict()
            candidate["id"] = doc.id  
            candidate_list.append(candidate)

        return {
            "status": "success",
            "uid": uid,
            "candidates": candidate_list
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching resumes: {str(e)}")




@router.delete("/candidate-resume/{candidate_id}")
async def delete_candidate_resume(request: Request, candidate_id: str):
    try:
        uid = verify_firebase_token(request)

   
        candidate_doc_ref = db.collection("users").document(uid).collection("candidates").document(candidate_id)
        doc_snapshot = candidate_doc_ref.get()

        if not doc_snapshot.exists:
            raise HTTPException(status_code=404, detail="Candidate not found")

        candidate_data = doc_snapshot.to_dict()


        resume_url = candidate_data.get("resume_url")
        if resume_url:
            parsed_url = urlparse(resume_url)
            blob_path = parsed_url.path.lstrip(f"/{os.getenv('AZURE_CONTAINER_NAME')}/")
            delete_resume_from_azure(blob_path)

        print(f"Candidate {candidate_id} and resume deleted successfully")
        candidate_doc_ref.delete()

        return {
            "status": "success",
            "message": f"Candidate {candidate_id} and resume deleted successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting candidate: {str(e)}")