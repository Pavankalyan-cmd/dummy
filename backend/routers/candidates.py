from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from firebase_config import verify_firebase_token, db
from pydantic import BaseModel, Field
from typing import List, Optional
from google import genai
import os
from services.parser import extract_text_from_docx
import json
from dotenv import load_dotenv
import re
from urllib.parse import urlparse
from google.genai.types import GenerateContentConfig,Part
import uuid
from storage.azure import upload_resume_to_azure,delete_resume_from_azure
from llmservices.topscore_gemini import analyze_multiple_resumes_structured
from services.scoring import calculate_total_score
from storage.firestore import save_candidate_topscore_to_firestore
load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

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


@router.post("/candidate-resume")
async def candidate_resumes(
    request: Request,
    resumes: List[UploadFile] = File(...)
):
    uid = verify_firebase_token(request)
    results = []

    for resume in resumes:
        try:
            resume_bytes = await resume.read()
            candidate_id = str(uuid.uuid4())
            resume_url = upload_resume_to_azure(
                uid=uid, candidate_id=candidate_id,
                filename=resume.filename,
                content=resume_bytes,
                content_type=resume.content_type or "application/pdf"
            )
            if resume.filename.lower().endswith(".docx") or resume.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                extracted_text = extract_text_from_docx(resume_bytes)
                print("EXTRACTED TEXT:\n", extracted_text[:1000])

                file_part = Part.from_text(extracted_text)
                print("file_part mime_type:", file_part.mime_type)
                if hasattr(file_part, "text"):
                    print("file_part.text snippet:", file_part.text[:500])
                else:
                    print("No .text attribute available on file_part")
            else:  
                file_part = Part.from_bytes(
                    data=resume_bytes,
                    mime_type=resume.content_type or "application/pdf"
                )


            candidate_schema_json = Candidate.schema_json(indent=2)
            prompt = f"""You are an information extraction engine...
            Return only valid JSON matching this schema:
            {candidate_schema_json}
            """

            response = await client.aio.models.generate_content(
                model="gemini-2.0-flash",
                contents=[file_part, prompt],
                config=GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=Candidate,
                    temperature=0.2
                )
            )
            
            candidate_model = response.parsed
            if isinstance(candidate_model, Candidate):
                candidate_dict = candidate_model.model_dump()
            else:
                candidate_dict = json.loads(response.text)

            candidate_dict.update({
                "uid": uid,
                "candidate_id": candidate_id,
                "resume_url": resume_url
            })

            db.collection("users").document(uid) \
              .collection("candidates").document(candidate_id) \
              .set(candidate_dict)
            def has_skill_overlap(jd_skills, candidate_skills, min_overlap=2):
                return len(set(jd_skills).intersection(set(candidate_skills))) >= min_overlap
            
            jd_ref = db.collection("users").document(uid).collection("job_descriptions")
            jd_docs = jd_ref.stream()
            matching_jds = []


            for jd_doc in jd_docs:
                jd_dict = jd_doc.to_dict()
                jd_skills = jd_dict.get("required_skills", [])
                candidate_skills = candidate_dict.get("technical_skills", [])

                if has_skill_overlap(jd_skills, candidate_skills, min_overlap=1):
                    matching_jds.append((jd_doc.id, jd_dict))

            # If matches found, score and store top match
            for jd_id, jd_data in matching_jds:
                scored = analyze_multiple_resumes_structured(jd_data, [candidate_dict])
                for s in scored:
                    s["total_score"] = calculate_total_score(s)
                for candidate in scored:
                    save_candidate_topscore_to_firestore(uid=uid, jd_id=jd_id, candidate=candidate)


            results.append({
                "filename": resume.filename,
                "candidate_id": candidate_id,
                "parsed_data": candidate_dict
            })

        except Exception as e:
            results.append({
                "filename": resume.filename,
                "error": str(e),
                "raw_output": locals().get("response", {}).text if 'response' in locals() else None
            })

    return {"status": "completed", "uid": uid, "results": results}


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