from typing import List, Dict, Optional
from pydantic import BaseModel, Field

class CampaignBrief(BaseModel):
    campaign_id: str = Field(..., description="Unique identifier for the campaign")
    initiated_by: str = Field(..., description="User who initiated the campaign")
    creative_objective: str = Field(..., description="Creative objective of the campaign")
    target_regions: List[str] = Field(..., description="Target region IDs")
    target_personas: List[str] = Field(..., description="Target persona IDs")
    desired_formats: List[str] = Field(..., description="List of desired output formats")

class SemanticFact(BaseModel):
    source: str = Field(..., description="Source of the fact")
    fact: str = Field(..., description="The semantic content or fact")

class OrchestratorContext(BaseModel):
    system_prompt: str = Field(..., description="System prompt for the orchestrator")
    semantic_context: List[SemanticFact] = Field(..., description="Contextual facts")
    user_prompt: str = Field(..., description="User prompt for the generation")

class LockedMasterText(BaseModel):
    text: str = Field(..., description="The approved master text")
    character_count: int = Field(..., description="Character count of the master text")

class LocalizedTranslation(BaseModel):
    text: str = Field(..., description="The translated text")

class LockedLocalizedText(BaseModel):
    translations: Dict[str, LocalizedTranslation] = Field(..., description="Translations mapped by locale")
    character_counts: Dict[str, int] = Field(..., description="Character counts mapped by locale")

class ApprovedPublishingPayload(BaseModel):
    campaign_id: str = Field(..., description="Campaign identifier")
    locked_master_text: LockedMasterText = Field(..., description="Approved master text")
    locked_localized_text: LockedLocalizedText = Field(..., description="Approved localized texts")
    visual_assets: Optional[List[str]] = Field(default=None, description="Approved visual asset URLs")

class TelemetryMetrics(BaseModel):
    generation_time_ms: int = Field(..., description="Time taken to generate content in milliseconds")
    token_count: int = Field(..., description="Total tokens used")
    cost: float = Field(..., description="Estimated cost of the generation")

class StrategyInsight(BaseModel):
    insight_key: str = Field(..., description="Key for the insight")
    insight_value: str = Field(..., description="Value or description of the insight")

class StrategyWeights(BaseModel):
    formality: float = Field(..., description="Weight for formality (0.0 to 1.0)")
    creativity: float = Field(..., description="Weight for creativity (0.0 to 1.0)")
