from fastapi import APIRouter, HTTPException, Request
from firebase_config import db
from firebase_config import verify_firebase_token

router = APIRouter()

@router.get("/top-score/{jd_id}")
async def get_top_score_candidates(jd_id: str, request: Request):
    uid = verify_firebase_token(request)
    if not uid:
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        candidates_ref = (
            db.collection("users")
            .document(uid)
            .collection("top_score")
            .document(jd_id)
            .collection("candidates")
        )
        candidates = candidates_ref.stream()

        result = []
        for doc in candidates:
            data = doc.to_dict()
            data["candidate_id"] = doc.id
            result.append(data)

        # Sort by total_score in descending order
        result.sort(key=lambda x: x.get("total_score", 0), reverse=True)

        if not result:
            raise HTTPException(status_code=404, detail="No top score candidates found.")

        return {
            "jd_id": jd_id,
            "top_score_candidates": result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching top score data: {str(e)}")
