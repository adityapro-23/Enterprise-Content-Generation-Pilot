from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List
from app.models.campaign import CampaignBrief
from app.models.admin_rules import ComplianceRules
from app.workflows.main_graph import app as graph_app
from app.workflows.state import GraphState

router = APIRouter()

class InitiateRequest(BaseModel):
    db_id: str
    campaign_id: str
    initiated_by: str
    creative_objective: str
    target_regions: List[str]
    target_personas: List[str]
    desired_formats: List[str]
    enable_localization: bool
    selected_language: Optional[str] = None
    workspace_rules: dict = {}
    assets: Optional[List[dict]] = []

class GateRequest(BaseModel):
    db_id: str
    feedback: Optional[str] = None
    gate_number: Optional[int] = None

class StopRequest(BaseModel):
    db_id: str

@router.post("/api/campaign/initiate")
async def initiate_campaign(req: InitiateRequest, background_tasks: BackgroundTasks):
    try:
        # Extract rules from workspace payload
        compliance_rules_data = req.workspace_rules.get("compliance_rules", {})
        compliance_rules = ComplianceRules(
            forbidden_phrases=compliance_rules_data.get("forbidden_phrases", []),
            mandatory_disclaimers_by_region=compliance_rules_data.get("mandatory_disclaimers_by_region", {}),
            mandatory_disclaimers_by_topic=compliance_rules_data.get("mandatory_disclaimers_by_topic", {})
        )

        brief = CampaignBrief(
            campaign_id=req.campaign_id,
            initiated_by=req.initiated_by,
            creative_objective=req.creative_objective,
            target_regions=req.target_regions,
            target_personas=req.target_personas,
            desired_formats=req.desired_formats
        )

        initial_state: GraphState = {
            "campaign_id": req.campaign_id,
            "db_id": req.db_id,
            "brief": brief,
            "compliance_rules": compliance_rules,
            "draft_text": "",
            "text_audit": None,
            "locked_master_text": "",
            "enable_localization": req.enable_localization,
            "selected_language": req.selected_language or "English",
            "localized_texts": {},
            "regional_audit": {},
            "visual_assets": [],
            "visual_audit": None,
            "feedback": "",
            "assets": req.assets,  # FIXED: Initialize assets in state
            "current_status": "PROCESSING"
        }

        config = {"configurable": {"thread_id": req.db_id}}

        # FIXED: Catch graph crashes and update UI
        async def run_graph():
            try:
                await graph_app.ainvoke(initial_state, config)
            except Exception as e:
                from app.services.convex_sync import update_convex_campaign
                await update_convex_campaign(req.db_id, {"status": "ERROR", "error": str(e)})

        background_tasks.add_task(run_graph)

        # Immediately return so the UI can transition to the execution loading screen
        return {
            "db_id": req.db_id,
            "status": "PROCESSING"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def handle_gate_resume(db_id: str, feedback: Optional[str], gate_number: Optional[int], background_tasks: BackgroundTasks):
    config = {"configurable": {"thread_id": db_id}}
    state_info = await graph_app.aget_state(config)

    if not state_info.next:
        raise HTTPException(status_code=400, detail="Campaign not in a waiting state")

    if feedback:
        target_node = "node_draft_content" if gate_number == 1 else "node_localize_content"
        await graph_app.aupdate_state(config, {"feedback": feedback}, as_node=target_node)

    # FIXED: Catch graph crashes and update UI
    async def resume_graph():
        try:
            await graph_app.ainvoke(None, config)
        except Exception as e:
            from app.services.convex_sync import update_convex_campaign
            await update_convex_campaign(db_id, {"status": "ERROR", "error": str(e)})

    background_tasks.add_task(resume_graph)

    return {
        "db_id": db_id,
        "status": "RESUMED_PROCESSING"
    }


@router.post("/api/campaign/approve-gate-1")
async def approve_gate_1(req: GateRequest, background_tasks: BackgroundTasks):
    return await handle_gate_resume(req.db_id, None, 1, background_tasks)

@router.post("/api/campaign/approve-gate-2")
async def approve_gate_2(req: GateRequest, background_tasks: BackgroundTasks):
    return await handle_gate_resume(req.db_id, None, 2, background_tasks)

@router.post("/api/campaign/reject-gate")
async def reject_gate(req: GateRequest, background_tasks: BackgroundTasks):
    """Handles 'Regenerate with feedback'"""
    if not req.feedback:
        raise HTTPException(status_code=400, detail="Feedback is required for regeneration")
    return await handle_gate_resume(req.db_id, req.feedback, req.gate_number, background_tasks)

@router.post("/api/campaign/stop")
async def stop_campaign(req: StopRequest):
    try:
        config = {"configurable": {"thread_id": req.db_id}}
        # Update the graph state to forcibly halt processing
        await graph_app.aupdate_state(config, {"current_status": "STOPPED"}, as_node=None)
        return {"status": "success", "message": "Campaign execution stopped."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
