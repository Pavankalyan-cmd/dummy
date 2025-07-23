# scoring.py
from firebase_config import db

def fetch_user_weights(uid: str, profile_type: str) -> dict:
    doc_ref = db.collection("users").document(uid).collection("score_weights").document(profile_type)
    doc = doc_ref.get()

    if not doc.exists:
        raise ValueError(f"No score weights found for user {uid} and profile {profile_type}")
    
    data = doc.to_dict()
    return data.get("weights", {})


def calculate_total_score(candidate: dict, uid: str) -> dict:
    profile_type = candidate.get("profile_type", "senior_engineer")
    weights = fetch_user_weights(uid, profile_type)

    total_weight = sum(weights.values()) or 1
    normalized_weights = {
        k: v / total_weight for k, v in weights.items()
    }

    scores = {
        "skills": candidate.get("skills_score", 0),
        "experience": candidate.get("experience_score", 0),
        "education": candidate.get("education_score", 0),
        "certifications": candidate.get("certifications_score", 0),
    }

    weighted_scores = {
        k: round(scores[k] * normalized_weights.get(k, 0), 2) for k in scores
    }

    total_score = round(sum(weighted_scores.values()), 2)

    return {
        "total_score": total_score,
        "breakdown": {
            k: {
                "score": scores[k],
                "weight": round(normalized_weights.get(k, 0), 2),
                "weighted": weighted_scores[k],
            }
            for k in scores
        }
    }




def initialize_user_weights(uid: str):
    user_doc_ref = db.collection("users").document(uid)
    weights_ref = user_doc_ref.collection("score_weights")

    existing_weights = weights_ref.stream()

    if not any(existing_weights): 
        default_weights = {
            "fresher": {"skills": 40, "education": 30, "certifications": 20, "experience": 10},
            "mid_professional": {"skills": 35, "education": 25, "certifications": 15, "experience": 25},
            "senior_engineer": {"skills": 30, "education": 20, "certifications": 10, "experience": 40},
        }

        for role, weights in default_weights.items():
            weights_ref.document(role).set({
                "role": role,
                "weights": weights
            })

        print(f"Initialized score weights for new user: {uid}")
    else:
        print(f"Score weights already exist for user: {uid}")
