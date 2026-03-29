from typing import TypedDict, Dict, List, Optional, Any
import operator

from app.models.governance import TextualGovernanceAudit, VisualGovernanceAudit

class GraphState(TypedDict):
    campaign_id: str
    db_id: str  # Convex ID
    brief: dict          # stored as plain dict via .model_dump() for LangGraph serialization
    compliance_rules: dict  # stored as plain dict via .model_dump() for LangGraph serialization
    assets: list[dict]
    draft_text: str
    text_audit: TextualGovernanceAudit
    locked_master_text: str
    enable_localization: bool
    selected_language: str
    localized_texts: dict[str, str]
    regional_audit: dict[str, str] # LQA results per locale
    visual_assets: list[dict[str, str]]
    visual_audit: VisualGovernanceAudit
    feedback: str # Human feedback for regeneration
    current_status: str
