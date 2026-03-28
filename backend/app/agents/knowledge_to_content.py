import os
import logging
from openai import AsyncOpenAI
from langsmith import traceable

logger = logging.getLogger(__name__)

@traceable(name="generate_master_draft")
async def generate_master_draft(brief, facts, compliance_rules, feedback: str = "", assets: list = None) -> str:
    """
    Generate master draft with dynamic persona, region context, user assets, and HITL feedback.
    """
    try:
        client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        persona = ", ".join(brief.target_personas) if brief.target_personas else "General Audience"
        regions = ", ".join(brief.target_regions) if brief.target_regions else "Global"
        
        system_prompt = (
            f"You are an expert copywriter targeting {persona} in {regions}. "
            "Write vibrant, engaging, and highly persuasive content. "
            f"You MUST absolutely AVOID using: {', '.join(compliance_rules.forbidden_phrases) if compliance_rules and compliance_rules.forbidden_phrases else 'None'}. "
            "Align strictly with the creative objective."
        )
        
        # FIXED: Using .get() for dictionaries instead of getattr()
        facts_text = "\n".join([f"- {f.get('source', 'Context')}: {f.get('fact', '')}" for f in facts]) if facts else "No internal facts available."
        assets_text = "\n".join([f"- Asset: {a.get('name', 'File')}" for a in assets]) if assets else "No assets provided."
        
        user_prompt = (
            f"Creative Objective: {brief.creative_objective}\n\n"
            f"Semantic Context (from Qdrant):\n{facts_text}\n\n"
            f"User Uploaded Assets:\n{assets_text}\n\n"
            f"Human-in-the-Loop Feedback to incorporate:\n{feedback}\n\n"
            "Generate the master draft copy."
        )
        
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Error generating master draft: {e}")
        return f"Error: {str(e)}"
