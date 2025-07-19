# scoring.py

WEIGHT_PROFILES = {
    "senior_engineer": {
        "skills": 0.30,
        "experience": 0.50,
        "education": 0.10,
        "certifications": 0.10
    },
    "mid_professional": {
        "skills": 0.30,
        "experience": 0.40,
        "education": 0.20,
        "certifications": 0.10
    },
    "fresher": {
        "skills": 0.30,
        "experience": 0.20,
        "education": 0.30,
        "certifications": 0.20
    }
}


def calculate_total_score(candidate: dict, weight_profiles: dict = WEIGHT_PROFILES) -> float:
    profile_type = candidate.get("profile_type", "senior_engineer")
    weights = weight_profiles.get(profile_type, weight_profiles["senior_engineer"])

    total_score = (
        candidate.get("skills_score", 0) * weights["skills"] +
        candidate.get("experience_score", 0) * weights["experience"] +
        candidate.get("education_score", 0) * weights["education"] +
        candidate.get("certifications_score", 0) * weights["certifications"]
    )

    return round(total_score, 2)
