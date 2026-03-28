from typing import List, Dict
from pydantic import BaseModel, Field

class Violation(BaseModel):
    type: str = Field(..., description="Type of the violation")
    phrase: str = Field(..., description="The specific phrase causing the violation")
    index: int = Field(..., description="Starting index of the phrase in the text")

class TextualGovernanceAudit(BaseModel):
    agent: str = Field(..., description="Agent that performed the textual audit")
    status: str = Field(..., description="Status of the audit (e.g., PASSED, FAILED)")
    violations: List[Violation] = Field(default_factory=list, description="List of detected violations")
    action: str = Field(..., description="Action taken based on the audit")

class RegionalLQACheck(BaseModel):
    idiom_check: bool = Field(..., description="Whether idioms were checked and validated")
    disclaimer_appended: bool = Field(..., description="Whether the mandatory disclaimer was appended")

class LocaleAudit(BaseModel):
    status: str = Field(..., description="Status of the locale audit (e.g., PASSED, FAILED)")
    text: str = Field(..., description="The audited localized text")
    lqa_checks: RegionalLQACheck = Field(..., description="Results of Language Quality Assurance checks")

class RegionalGovernanceAudit(BaseModel):
    locales: Dict[str, LocaleAudit] = Field(..., description="Mapping of locale codes to their audits")

class VisualChecks(BaseModel):
    hex_variance: float = Field(..., description="Variance from brand primary/secondary hex colors")
    text_overflow: bool = Field(..., description="Whether text overflows its boundaries")
    logo_presence: bool = Field(..., description="Whether the brand logo is correctly present")

class VisualGovernanceAudit(BaseModel):
    agent: str = Field(..., description="Agent that performed the visual audit")
    asset_id: str = Field(..., description="Identifier for the visual asset")
    status: str = Field(..., description="Status of the audit (e.g., PASSED, FAILED)")
    checks: VisualChecks = Field(..., description="Visual checks performed on the asset")

class LangSmithTraceMetrics(BaseModel):
    latency_ms: int = Field(..., description="Latency of the step in milliseconds")
    tokens_used: int = Field(..., description="Tokens consumed during the step")

class ComplianceEvent(BaseModel):
    event_type: str = Field(..., description="Type of compliance event")
    description: str = Field(..., description="Detailed description of the event")
    timestamp: str = Field(..., description="ISO 8601 timestamp of the event")

class LangSmithTraceLog(BaseModel):
    trace_id: str = Field(..., description="Unique trace identifier")
    metrics: LangSmithTraceMetrics = Field(..., description="Trace metrics")
    events: List[ComplianceEvent] = Field(default_factory=list, description="List of compliance events logged")
