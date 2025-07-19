from firebase_config import db

def save_topscore_results_to_firestore(uid: str, jd_id: str, topscore_results: list):
    for candidate in topscore_results:
        candidate_id = candidate.get("candidate_id")
        if not candidate_id:
            continue  # Skip if no candidate_id
        
        # Path: users/{uid}/top_score/{jd_id}/candidates/{candidate_id}
        candidate_doc_ref = (
            db.collection("users")
              .document(uid)
              .collection("top_score")
              .document(jd_id)
              .collection("candidates")
              .document(candidate_id)
        )


        candidate_doc_ref.set(candidate)
from firebase_admin import firestore

def save_candidate_topscore_to_firestore(uid: str, jd_id: str, candidate: dict):
    candidate_id = candidate.get("candidate_id")
    if not candidate_id:
        return

    top_score_jd_ref = (
        db.collection("users")
          .document(uid)
          .collection("top_score")
          .document(jd_id)
    )

    jd_snapshot = top_score_jd_ref.get()


    if not jd_snapshot.exists:

        top_score_jd_ref.set({
            "jd_id": jd_id,
            "created_at": firestore.SERVER_TIMESTAMP
        })


    candidate_doc_ref = top_score_jd_ref.collection("candidates").document(candidate_id)

    if candidate_doc_ref.get().exists:
        # Update candidate data
        candidate_doc_ref.update({
            "total_score": candidate.get("total_score"),
            "skills_score": candidate.get("skills_score"),
            "experience_score": candidate.get("experience_score"),
            "education_score": candidate.get("education_score"),
            "certifications_score": candidate.get("certifications_score"),
            "resume_url": candidate.get("resume_url"),
            "name": candidate.get("name"),
            "email": candidate.get("email"),
            "updated_at": firestore.SERVER_TIMESTAMP
        })
    else:
    
        candidate_doc_ref.set({
            **candidate,
            "created_at": firestore.SERVER_TIMESTAMP
        })
