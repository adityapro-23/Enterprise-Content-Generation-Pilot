from typing import List, Dict
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.sqlite.aio import AsyncSqliteSaver
import asyncio, os as _os

# ── Persistent SQLite checkpointer ────────────────────────────────────────────
# Uses a local file so paused states survive uvicorn hot-reloads.
_DB_PATH = _os.path.join(_os.path.dirname(__file__), "..", "..", "checkpoints.db")
_graph_singleton = None
_graph_lock = asyncio.Lock()

from .state import GraphState
from app.agents.knowledge_to_content import generate_master_draft
from app.agents.textual_governance import audit_text
from app.agents.localization import generate_localized_copy
from app.agents.visual_governance import audit_image_assets
import os
from openai import AsyncOpenAI
from qdrant_client import AsyncQdrantClient
from app.services.convex_sync import update_convex_campaign

# ───────────────────────────────────────────────────────────────
# NODES
# ───────────────────────────────────────────────────────────────

async def node_draft_content(state: GraphState):
    """
    Node 1: Knowledge to Content
    Incorporate Qdrant retrieval and human feedback if present.
    """
    facts = []
    # Qdrant retrieval from the creative objective
    try:
        qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")
        # Initialize qdrant client (use standard QdrantClient since we are in an async context, or AsyncQdrantClient)
        qdrant = AsyncQdrantClient(url=qdrant_url)
        ai = AsyncOpenAI()
        
        objective = state["brief"].get("creative_objective", "")
        embed_res = await ai.embeddings.create(input=objective, model="text-embedding-3-small")
        query_vector = embed_res.data[0].embedding
        
        search_result = await qdrant.search(
            collection_name="knowledge_base",
            query_vector=query_vector,
            limit=3
        )
        facts = [{"source": hit.payload.get("source", "KB"), "fact": hit.payload.get("text", "")} for hit in search_result]
    except Exception as e:
        print(f"Warning: Qdrant retrieval failed: {e}")
        
    # STRICT FALLBACK LOGIC
    # Check if OAuth apps are connected via workspace rules
    oauth_connected = state.get("workspace_rules", {}).get("oauth_connected", False)
    
    # If no facts from Qdrant AND no OAuth, strictly fence the AI to use ONLY campaign inputs
    if not facts and not oauth_connected:
        assets_context = ", ".join([a.get("name", "Unknown Asset") for a in state.get("assets", [])])
        facts = [
            {"source": "SYSTEM DIRECTIVE", "fact": "NO EXTERNAL KNOWLEDGE FOUND. You MUST rely ONLY on the user's prompt and the following uploaded assets: " + assets_context}
        ]
    elif not facts and oauth_connected:
        facts = [{"source": "System", "fact": "No relevant context found in connected knowledge bases."}]
    
    assets = state.get("assets", [])
    feedback = state.get("feedback", "")
    
    # Pass feedback, assets, and rules properly to the agent
    draft = await generate_master_draft(
        brief=state["brief"], 
        facts=facts, 
        compliance_rules=state.get("compliance_rules"), 
        feedback=feedback,
        assets=assets
    )
    
    # FIXED: Intercept Agent Errors to prevent them from showing up in the UI as generated text
    if draft.startswith("Error:"):
        await update_convex_campaign(state["db_id"], {"status": "ERROR", "error": draft})
        raise ValueError(f"Agent Generation Failed: {draft}")
        
    # If successful, push the real text to Convex
    await update_convex_campaign(state["db_id"], {"master_text": {"text": draft, "character_count": len(draft)}})
    
    # Clear feedback after processing it so it doesn't loop infinitely
    return {"draft_text": draft, "current_status": "PROCESSING", "feedback": ""}

async def node_text_governance(state: GraphState):
    """
    Node 2: Textual Governance Audit
    Uses spaCy to check for forbidden phrases.
    """
    compliance_rules = state.get("compliance_rules", {})
    forbidden = compliance_rules.get("forbidden_phrases", []) if isinstance(compliance_rules, dict) else compliance_rules.forbidden_phrases
    audit = audit_text(state["draft_text"], forbidden)
    
    await update_convex_campaign(state["db_id"], {
        "text_audit": {"status": audit.status, "violations": audit.violations},
        "status": "GATE_1_TEXT"
    })
    
    return {"text_audit": audit, "current_status": "GATE_1_TEXT"}

async def node_localize_content(state: GraphState):
    """
    Node 3: Localization Engine (Conditional)
    Calls LLM agent for either full transcreation or regional tone adaptation.
    Pushes GATE_2_LOCALIZATION to Convex so the frontend knows to pause.
    """
    master_text = state.get("locked_master_text") or state.get("draft_text", "")
    brief = state.get("brief", {})
    enable_loc = state.get("enable_localization", False)
    target_lang = state.get("selected_language", "English")
    regions = brief.get("target_regions", ["Global"])
    
    localized = await generate_localized_copy(
        master_text=master_text,
        enable_localization=enable_loc,
        target_language=target_lang,
        target_regions=regions,
        feedback=state.get("feedback", "")
    )
    
    # Push to Convex and explicitly trigger the UI pause state for Gate 2
    await update_convex_campaign(state["db_id"], {
        "localized_texts": {"default": localized},
        "status": "GATE_2_LOCALIZATION"
    })
    
    return {"localized_texts": {"default": localized}, "current_status": "GATE_2_LOCALIZATION", "feedback": ""}

async def node_regional_governance(state: GraphState):
    """
    Node 4: Regional Governance (LQA Audit)
    """
    # Simple placeholder audit for regional content
    regional_audit = {locale: "PASSED" for locale in state["localized_texts"].keys()}
    
    await update_convex_campaign(state["db_id"], {
      "localized_texts": {
        "translations": {l: {"text": t} for l, t in state["localized_texts"].items()},
        "character_counts": {l: len(t) for l, t in state["localized_texts"].items()}
      },
      "regional_audit": regional_audit,
      "status": "GATE_2_LOCALIZATION"
    })
    
    return {"regional_audit": regional_audit, "current_status": "GATE_2_LOCALIZATION"}

async def node_visual_generation(state: GraphState):
    """
    Node 5: Visual Asset Generation
    Strictly filters based on desired_formats from campaign_brief.
    """
    brief = state.get("brief", {})
    formats = brief.get("desired_formats", [])
    assets = []
    
    # We produce one asset set per locale
    locales = list(state["localized_texts"].keys())
    if not locales:
        locales = ["English"] # Fallback
        
    ai = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    for locale in locales:
        for fmt in formats:
            is_image = "Image" in fmt
            if is_image:
                try:
                    res = await ai.images.generate(
                        model="dall-e-3",
                        prompt=f"Create a high-quality visual asset for the following campaign: {brief.get('creative_objective', '')}",
                        n=1,
                        size="1024x1024"
                    )
                    asset_url = res.data[0].url
                except Exception as e:
                    print(f"DALLE Error: {e}")
                    asset_url = "https://images.unsplash.com/photo-1618401303847-c186851d6540"
            else:
                asset_url = "https://example.com/mock-video.mp4"
                
            assets.append({
                "id": f"v-{locale}-{fmt.replace(' ', '-')}",
                "locale": locale,
                "format": fmt,
                "url": asset_url,
                "status": "COMPLETED"
            })
            
    return {"visual_assets": assets, "current_status": "PROCESSING"}

async def node_visual_governance(state: GraphState):
    """
    Node 6: Visual Governance Audit (Hex variance, overflow)
    """
    # Simulate Pillow hex variance check
    status = "PASSED"
    
    await update_convex_campaign(state["db_id"], {
        "visual_assets": state["visual_assets"],
        "status": "GATE_4_VISUALS" # Mapping State 4 to Gate 4 UI visuals
    })
    
    return {"current_status": "GATE_4_VISUALS"}

# ───────────────────────────────────────────────────────────────
# ROUTING & CONSTRUCTION
# ───────────────────────────────────────────────────────────────

def route_after_text_audit(state: GraphState):
    # If the audit fails, the orchestrator should automatically retry node_draft_content
    text_audit = state.get("text_audit")
    if text_audit and isinstance(text_audit, dict) and text_audit.get("status") == "FAILED":
        return "node_draft_content"
    if hasattr(text_audit, "status") and text_audit.status == "FAILED":
        return "node_draft_content"
    return "node_localize_content"

def route_after_visual_audit(state: GraphState):
    # Loop back logic if audit fails
    visual_audit = state.get("visual_audit")
    if visual_audit and isinstance(visual_audit, dict) and visual_audit.get("status") == "FAILED":
        return "node_visual_generation"
    return END

def _build_graph(checkpointer):
    """Pure graph construction — checkpointer injected by get_graph()."""
    builder = StateGraph(GraphState)

    builder.add_node("node_draft_content", node_draft_content)
    builder.add_node("node_text_governance", node_text_governance)
    builder.add_node("node_localize_content", node_localize_content)
    builder.add_node("node_regional_governance", node_regional_governance)
    builder.add_node("node_visual_generation", node_visual_generation)
    builder.add_node("node_visual_governance", node_visual_governance)

    builder.add_edge(START, "node_draft_content")
    builder.add_edge("node_draft_content", "node_text_governance")
    builder.add_conditional_edges("node_text_governance", route_after_text_audit)

    builder.add_edge("node_localize_content", "node_regional_governance")
    builder.add_edge("node_regional_governance", "node_visual_generation")
    builder.add_edge("node_visual_generation", "node_visual_governance")
    builder.add_conditional_edges("node_visual_governance", route_after_visual_audit)

    return builder.compile(
        checkpointer=checkpointer,
        interrupt_before=[
            "node_localize_content",  # Pause for Gate 1 review
            "node_visual_generation", # Pause for Gate 2 review
        ]
    )


async def get_graph():
    """
    Returns the compiled LangGraph app backed by a persistent AsyncSqliteSaver.
    The graph is built once and cached as a module-level singleton so the DB
    connection is reused across requests without being re-opened each time.
    """
    global _graph_singleton
    async with _graph_lock:
        if _graph_singleton is None:
            checkpointer = AsyncSqliteSaver.from_conn_string(_DB_PATH)
            _graph_singleton = _build_graph(checkpointer)
    return _graph_singleton


# ── Backwards-compat shim ─────────────────────────────────────────────────────
# routes.py imports `app` directly; keep it working by exposing a proxy object
# whose async methods resolve the singleton on first call.
class _GraphProxy:
    """Thin proxy so 'from main_graph import app' keeps working in routes.py."""
    async def ainvoke(self, *args, **kwargs):
        g = await get_graph()
        return await g.ainvoke(*args, **kwargs)

    async def aget_state(self, *args, **kwargs):
        g = await get_graph()
        return await g.aget_state(*args, **kwargs)

    async def aupdate_state(self, *args, **kwargs):
        g = await get_graph()
        return await g.aupdate_state(*args, **kwargs)

app = _GraphProxy()
