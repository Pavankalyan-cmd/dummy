from fastapi import APIRouter, UploadFile, File, HTTPException,Request
from services.parser import extract_text_from_pdf ,extract_text_from_docx
from firebase_config import verify_firebase_token
router = APIRouter()
import requests
@router.post("/analyze-resume-jd")
async def analyze_resume_and_jd(request: Request,
    resume: UploadFile = File(...),
    jd: UploadFile = File(...)
):
    uid = verify_firebase_token(request)
    try:
        resume_content = await resume.read()
        jd_content = await jd.read()

        # Resume
        if resume.filename.endswith(".pdf"):
            resume_text = extract_text_from_pdf(resume_content)
        elif resume.filename.endswith(".docx"):
            resume_text = extract_text_from_docx(resume_content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported resume format")

        # JD
        if jd.filename.endswith(".pdf"):
            jd_text = extract_text_from_pdf(jd_content)
        elif jd.filename.endswith(".docx"):
            jd_text = extract_text_from_docx(jd_content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported JD format")
        print({"resume_text": resume_text, "jd_text": jd_text})
        return {
            "resume_text": resume_text,
            "jd_text": jd_text

        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")
