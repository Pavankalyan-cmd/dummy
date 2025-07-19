
from dotenv import load_dotenv
from fastapi import  HTTPException, Request


import os, json, firebase_admin
from firebase_admin import credentials, firestore,auth
load_dotenv()
def initialize_firebase():
    # Skip if an app is already initialized
    try:
        firebase_admin.get_app()
        return
    except ValueError:
        pass

    raw_json   = os.getenv("FIREBASE_CREDENTIAL_JSON") #Azure
    local_path = os.getenv("FIREBASE_CREDENTIAL_PATH")

    if raw_json:
        cred = credentials.Certificate(json.loads(raw_json))
    else:
        if not os.path.exists(local_path):
            raise FileNotFoundError(f"Firebase credential file not found at {local_path}")
        cred = credentials.Certificate(local_path)

    firebase_admin.initialize_app(cred)

initialize_firebase()
db = firestore.client()




def verify_firebase_token(request: Request):
    auth_header = request.headers.get("authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    id_token = auth_header.split("Bearer ")[1]

    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token["uid"]
    except auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Expired Firebase token")
    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
