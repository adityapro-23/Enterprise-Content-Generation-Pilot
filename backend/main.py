import os
from dotenv import load_dotenv

# 1. MUST BE CALLED FIRST: Load environment variables before any local modules are imported
load_dotenv(override=True)

# 2. Standard imports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 3. Local imports (These will now have access to populated os.environ)
from app.api.routes import router
from app.core.config import settings

app = FastAPI(title="ECGP Orchestrator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def health_check():
    return {"status": "ECGP Backend is Online"}
