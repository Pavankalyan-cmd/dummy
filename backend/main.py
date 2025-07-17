from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv


from routers import candidates
load_dotenv()
app = FastAPI()
app.include_router(candidates.router,prefix="/api")

# Clean and validate ALLOWED_ORIGINS
origins_raw = os.getenv("ALLOWED_ORIGINS", "")
origins = [o.strip() for o in origins_raw.split(",") if o.strip()]
print("CORS Origins:", origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
