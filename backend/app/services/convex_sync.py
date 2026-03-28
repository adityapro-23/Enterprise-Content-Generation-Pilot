import os
import logging
import asyncio
from convex import ConvexClient

logger = logging.getLogger(__name__)

CONVEX_URL = os.getenv("CONVEX_URL", "")
# Initialize client once
client = ConvexClient(CONVEX_URL) if CONVEX_URL else None

async def update_convex_campaign(db_id: str, data: dict):
    """
    Sync the LangGraph state to Convex without blocking the event loop.
    """
    if not client:
        logger.warning("CONVEX_URL not set. Skipping sync.")
        return

    try:
        payload = {"id": db_id, **data}
        # FIXED: Run the synchronous Convex client in a background thread
        await asyncio.to_thread(client.mutation, "campaigns:updateStatus", payload)
    except Exception as e:
        logger.error(f"Failed to sync with Convex: {e}")
