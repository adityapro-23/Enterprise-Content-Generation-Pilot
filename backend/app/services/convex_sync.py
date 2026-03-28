import os
import logging
from convex import ConvexClient

logger = logging.getLogger(__name__)

CONVEX_URL = os.getenv("CONVEX_URL", "")
# Initialize client once at module load
client = ConvexClient(CONVEX_URL) if CONVEX_URL else None

async def update_convex_campaign(db_id: str, data: dict):
    """
    Sync the LangGraph state to the Convex database using the official Python client.
    """
    if not client:
        logger.warning("CONVEX_URL not set. Skipping sync.")
        return

    try:
        logger.info(f"Syncing to Convex [{db_id}]: {list(data.keys())}")
        # The frontend mutation expects 'id' instead of 'db_id'
        payload = {"id": db_id, **data}
        client.mutation("campaigns:updateStatus", payload)
    except Exception as e:
        logger.error(f"Failed to sync with Convex: {e}")
