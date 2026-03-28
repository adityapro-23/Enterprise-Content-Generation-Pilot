from typing import TypedDict, Annotated, Dict
import operator

from app.models.campaign import CampaignBrief
from app.models.admin_rules import ComplianceRules
from app.models.governance import TextualGovernanceAudit, VisualGovernanceAudit

class GraphState(TypedDict):
    campaign_id: str
    brief: CampaignBrief
    compliance_rules: ComplianceRules
    draft_text: str
    text_audit: TextualGovernanceAudit
    locked_master_text: str
    localized_texts: Dict[str, str]
    visual_assets: Dict[str, str]
    visual_audit: VisualGovernanceAudit
    current_status: str
