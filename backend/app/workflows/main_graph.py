from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

from .state import GraphState
from app.agents.knowledge_to_content import generate_master_draft
from app.agents.textual_governance import audit_text
from app.agents.localization import transcreate_text
from app.agents.visual_governance import audit_image_assets

async def node_draft_content(state: GraphState):
    facts = [] # Semantic facts can be populated before the graph or injected here
    draft = await generate_master_draft(state["brief"], facts, state["compliance_rules"])
    return {"draft_text": draft, "current_status": "DRAFTING"}

def node_text_governance(state: GraphState):
    audit = audit_text(state["draft_text"], state["compliance_rules"].forbidden_phrases)
    locked_text = state["draft_text"] if audit.status == "PASSED" else state.get("locked_master_text", "")
    return {"text_audit": audit, "locked_master_text": locked_text, "current_status": f"TEXT_AUDIT_{audit.status}"}

async def node_localize_content(state: GraphState):
    localized = {}
    master_text = state.get("locked_master_text", "")
    target_regions = state["brief"].target_regions if "brief" in state else []
    
    for region in target_regions:
        text = await transcreate_text(master_text, region)
        localized[region] = text
        
    return {"localized_texts": localized, "current_status": "LOCALIZED"}

def node_visual_governance(state: GraphState):
    assets = state.get("visual_assets", {})
    audit = None
    status = "PASSED"
    
    if assets:
        first_asset = list(assets.values())[0]
        # In a real scenario we extract required_primary_hex from workspace rules
        required_hex = "#FFFFFF" 
        audit = audit_image_assets(first_asset, required_hex)
        status = audit.status
        
    return {"visual_audit": audit, "current_status": f"VISUAL_AUDIT_{status}"}

def route_after_text_audit(state: GraphState):
    if state["text_audit"].status == "FAILED":
        return "node_draft_content"
    return "node_localize_content"

def route_after_visual_audit(state: GraphState):
    if state.get("visual_audit") and state["visual_audit"].status == "FAILED":
        return "node_localize_content"
    return END

builder = StateGraph(GraphState)

builder.add_node("node_draft_content", node_draft_content)
builder.add_node("node_text_governance", node_text_governance)
builder.add_node("node_localize_content", node_localize_content)
builder.add_node("node_visual_governance", node_visual_governance)

builder.add_edge(START, "node_draft_content")
builder.add_edge("node_draft_content", "node_text_governance")

builder.add_conditional_edges("node_text_governance", route_after_text_audit)

builder.add_edge("node_localize_content", "node_visual_governance")

builder.add_conditional_edges("node_visual_governance", route_after_visual_audit)

memory = MemorySaver()
app = builder.compile(
    checkpointer=memory, 
    interrupt_before=["node_localize_content", "node_visual_governance"]
)
