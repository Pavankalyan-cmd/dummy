from pydantic import BaseModel, Field
from typing import List, Optional
from google import genai

genai.configure(api_key="YOUR_GOOGLE_API_KEY")

model = genai.GenerativeModel("gemini-1.5-flash")




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
    experience: str
    contact_number: str
    email: Optional[str]
    education: List[Education]
    key_achievements: List[str]
    certifications: List[str]
    projects: List[Project]
    professional_summary: str



response = model.generate_content(
    contents=f"""Extract the following structured information from this resume:
    - name
    - designation
    - experience
    - contact number
    - email
    - education (list of degree, institution, year)
    - key achievements
    - certifications
    - projects (list of title and description)
    - professional summary
    
    Output as a JSON that conforms to the Candidate schema.

    Resume Text:
    {resume_text}
    """,
    generation_config={
        "response_mime_type": "application/json",
        "response_schema": Candidate,
    }
)

candidate_data = Candidate.parse_raw(response.text)
print(candidate_data)