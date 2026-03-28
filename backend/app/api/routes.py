from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models.campaign import CampaignBrief
from app.models.admin_rules import ComplianceRules
from app.workflows.main_graph import app as graph_app
from app.workflows.state import GraphState

router = APIRouter()

class ApproveGate1Request(BaseModel):
    campaign_id: str

@router.post("/api/campaign/initiate")
async def initiate_campaign(brief: CampaignBrief):
    try:
        # Mock compliance rules for simple testing
        compliance_rules = ComplianceRules(
            forbidden_phrases=["medical grade"],
            mandatory_disclaimers_by_region={},
            mandatory_disclaimers_by_topic={}
        )
        
        initial_state: GraphState = {
            "campaign_id": brief.campaign_id,
            "brief": brief,
            "compliance_rules": compliance_rules,
            "draft_text": "",
            "text_audit": None,
            "locked_master_text": "",
            "localized_texts": {},
            "visual_assets": {},
            "visual_audit": None,
            "current_status": "PENDING"
        }
        
        config = {"configurable": {"thread_id": brief.campaign_id}}
        
        # Invoke the graph using async invoke
        # For LangGraph compiled app, ainvoke handles state transition
        result = await graph_app.ainvoke(initial_state, config)
        
        # Check graph status from checkpointer
        state_info = graph_app.get_state(config)
        next_nodes = state_info.next
        
        status = f"WAITING_AT_{next_nodes[0].upper()}" if next_nodes else "COMPLETED"
            
        return {
            "campaign_id": brief.campaign_id,
            "status": status,
            "locked_master_text": result.get("locked_master_text", "")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/campaign/approve-gate-1")
async def approve_gate_1(req: ApproveGate1Request):
    try:
        campaign_id = req.campaign_id
        config = {"configurable": {"thread_id": campaign_id}}
        
        state_info = graph_app.get_state(config)
        if not state_info.next:
            raise HTTPException(status_code=400, detail="Graph is not currently waiting or thread not found")
            
        # Resume the graph by passing None
        result = await graph_app.ainvoke(None, config)
        
        state_info = graph_app.get_state(config)
        next_nodes = state_info.next
        
        status = f"WAITING_AT_{next_nodes[0].upper()}" if next_nodes else "COMPLETED"
            
        return {
            "campaign_id": campaign_id,
            "status": status,
            "message": "Gate 1 approved, graph resumed."
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
