import spacy
from app.models.governance import TextualGovernanceAudit, Violation

# Load the English model globally
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def audit_text(draft_text: str, forbidden_phrases: list[str]) -> TextualGovernanceAudit:
    """
    Scan the draft_text using spaCy to detect any forbidden phrases.
    """
    doc = nlp(draft_text)
    lower_text = draft_text.lower()
    
    violations = []
    
    for phrase in forbidden_phrases:
        phrase_lower = phrase.lower()
        start_idx = lower_text.find(phrase_lower)
        while start_idx != -1:
            violations.append(
                Violation(
                    type="forbidden_phrase",
                    phrase=phrase,
                    index=start_idx
                )
            )
            # Find next occurrence
            start_idx = lower_text.find(phrase_lower, start_idx + len(phrase_lower))
            
    if violations:
        return TextualGovernanceAudit(
            agent="textual_governance_spacy",
            status="FAILED",
            violations=violations,
            action="ROUTE_TO_REVISION"
        )
        
    return TextualGovernanceAudit(
        agent="textual_governance_spacy",
        status="PASSED",
        violations=[],
        action="APPROVE"
    )
