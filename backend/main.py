import os
import logging
from pathlib import Path
from dotenv import load_dotenv

# 1. MUST BE CALLED FIRST: Load .env using an absolute path anchored to this file's location.
# This ensures the correct .env is always found, even when uvicorn's reloader
# spawns the worker subprocess from a different working directory.
_env_path = Path(__file__).resolve().parent / ".env"
# encoding='utf-8-sig' silently strips UTF-8 BOM if present (common Windows editor artifact)
load_dotenv(dotenv_path=_env_path, override=True, encoding='utf-8-sig')

# Startup diagnostic — confirms the key loaded without exposing it
logging.basicConfig(level=logging.INFO)
_logger = logging.getLogger(__name__)
_key = os.getenv("OPENAI_API_KEY", "")
_logger.info(f"[Startup] OPENAI_API_KEY loaded: {'YES (len=%d)' % len(_key) if _key else 'NO — KEY IS MISSING'}")

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
