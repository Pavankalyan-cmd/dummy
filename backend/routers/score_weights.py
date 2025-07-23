from fastapi import APIRouter,Request,HTTPException
from pydantic import BaseModel
from typing import Dict
from firebase_config import db,verify_firebase_token

router = APIRouter()

class WeightUpdateRequest(BaseModel):
    weights: Dict[str, int]
    def validate_total(self):
        total = sum(self.weights.values())
        if total != 100:
            raise HTTPException(status_code=400, detail="Weights must sum up to 100.")
        
@router.get("/user-weights")
def get_user_weights(request: Request):
    uid = verify_firebase_token(request)
    print(uid,"at get function")
    weights_ref = db.collection("users").document(uid).collection("score_weights")
    weights_docs = weights_ref.stream()

    user_weights = {}
    for doc in weights_docs:
        data = doc.to_dict()
        role = data.get("role")
        weights = data.get("weights")
        if role and weights:
            user_weights[role] = weights
    print(user_weights)    

    return { "weights": user_weights}




@router.put("/user-weights/{role}")
def update_user_weights(request:Request, role: str, body: WeightUpdateRequest):
    uid = verify_firebase_token(request)
    weights_ref = db.collection("users").document(uid).collection("score_weights").document(role)
    body.validate_total()

    if weights_ref.get().exists:
        weights_ref.update({"weights": body.weights})
        return {"message": f"Updated weights for role '{role}'"}
    else:
        return {"error": f"Role '{role}' does not exist for user: {uid}"}
