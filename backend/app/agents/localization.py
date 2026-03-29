import os
import logging
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

async def generate_localized_copy(
    master_text: str,
    enable_localization: bool,
    target_language: str,
    target_regions: list,
    feedback: str = ""
) -> str:
    """
    Generate localized copy from the master text.
    - If enable_localization is True: fully translate and culturally transcreate into target_language.
    - If False: keep English but adapt tone/spelling/nuance for the target regions.
    """
    try:
        client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        regions_str = ", ".join(target_regions) if target_regions else "Global"

        if enable_localization:
            sys_prompt = (
                f"You are an expert transcreator. Translate and culturally adapt the following "
                f"master text into {target_language}. Ensure it resonates naturally with the "
                f"{regions_str} market while preserving the vibrant, persuasive tone of the original."
            )
        else:
            sys_prompt = (
                f"You are an expert regional copywriter. DO NOT TRANSLATE. Keep the text in English, "
                f"but adapt the tone, spelling (e.g., UK vs US English), idioms, and cultural nuances "
                f"to perfectly fit the {regions_str} market."
            )

        user_prompt = (
            f"Master Text:\n{master_text}\n\n"
            f"Feedback to incorporate:\n{feedback}\n\n"
            "Generate the adapted copy."
        )

        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": sys_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        logger.error(f"Localization failed: {e}")
        return f"Error: {str(e)}"
