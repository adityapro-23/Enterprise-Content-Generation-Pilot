import os
import logging
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

async def generate_master_draft(brief, facts, compliance_rules) -> str:
    """
    Generate master draft for B2C Consumer Tech (PulseFit Pro context).
    """
    try:
        client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        # Construct system prompt
        system_prompt = (
            "You are an expert B2C Consumer Tech copywriter for PulseFit Pro. "
            "Write vibrant, engaging, and highly persuasive content for a global audience. "
            "Maintain a dynamic and energetic tone suited for a premium fitness tracker. "
            f"You MUST absolutely AVOID using the following forbidden phrases: {', '.join(compliance_rules.forbidden_phrases)}. "
            "Ensure the final text aligns with the creative objective provided."
        )
        
        facts_text = "\n".join([f"- {f.source}: {f.fact}" for f in facts])
        user_prompt = (
            f"Creative Objective: {brief.creative_objective}\n\n"
            f"Key Semantic Facts:\n{facts_text}\n\n"
            "Please generate the master draft based on the above objective and facts."
        )
        
        response = await client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Error generating master draft: {e}")
        return f"Error generation failed: {str(e)}"
