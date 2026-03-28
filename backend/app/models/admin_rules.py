from typing import List, Dict
from pydantic import BaseModel, Field

class Region(BaseModel):
    id: str = Field(..., description="Unique identifier for the region")
    name: str = Field(..., description="Name of the region")
    locales: List[str] = Field(..., description="List of supported locales in this region")

class Persona(BaseModel):
    id: str = Field(..., description="Unique identifier for the persona")
    name: str = Field(..., description="Name of the persona")

class BrandColors(BaseModel):
    primary_hex: str = Field(..., description="Primary brand color in hex format")
    secondary_hex: str = Field(..., description="Secondary brand color in hex format")

class Typography(BaseModel):
    primary_font: str = Field(..., description="Primary font family")
    secondary_font: str = Field(..., description="Secondary font family")

class BrandAssets(BaseModel):
    logo_urls: List[str] = Field(..., description="List of URLs to the brand's logos")

class BrandGuidelines(BaseModel):
    colors: BrandColors = Field(..., description="Brand colors")
    typography: Typography = Field(..., description="Brand typography")
    assets: BrandAssets = Field(..., description="Brand assets")

class ComplianceRules(BaseModel):
    forbidden_phrases: List[str] = Field(default_factory=list, description="List of forbidden phrases")
    mandatory_disclaimers_by_region: Dict[str, str] = Field(default_factory=dict, description="Mandatory disclaimers mapped by region ID")
    mandatory_disclaimers_by_topic: Dict[str, str] = Field(default_factory=dict, description="Mandatory disclaimers mapped by topic")

class MarketIdentity(BaseModel):
    workspace_id: str = Field(..., description="Identifier for the workspace")
    business_model: str = Field(..., description="Business model, e.g., B2C, B2B")
    approved_regions: List[Region] = Field(..., description="Regions approved for this identity")
    approved_personas: List[Persona] = Field(..., description="Personas approved for this identity")
    brand_guidelines: BrandGuidelines = Field(..., description="Brand guidelines")
    compliance_rules: ComplianceRules = Field(..., description="Compliance rules")
