import requests
from io import BytesIO
from PIL import Image
from math import sqrt
from app.models.governance import VisualGovernanceAudit, VisualChecks

def hex_to_rgb(hex_color: str) -> tuple:
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def color_distance(rgb1: tuple, rgb2: tuple) -> float:
    return sqrt(sum((a - b) ** 2 for a, b in zip(rgb1, rgb2)))

def audit_image_assets(image_url: str, required_primary_hex: str) -> VisualGovernanceAudit:
    """
    Audit an image asset from a URL to check if the required primary hex is featured.
    """
    try:
        response = requests.get(image_url, timeout=10)
        response.raise_for_status()
        
        img = Image.open(BytesIO(response.content))
        img = img.convert("RGB")
        img = img.resize((50, 50))  # Downsample for faster analysis
        
        required_rgb = hex_to_rgb(required_primary_hex)
        pixels = list(img.getdata())
        
        tolerance = 30.0  # Euclidean distance tolerance for color matching
        match_count = sum(1 for p in pixels if color_distance(p, required_rgb) <= tolerance)
        
        total_pixels = len(pixels)
        match_ratio = match_count / total_pixels
        
        variance = 1.0 - match_ratio
        
        # If at least 2% of the pixels match the primary color, we consider it present
        if match_ratio > 0.02:
            status = "PASSED"
            hex_variance = variance
        else:
            status = "FAILED"
            hex_variance = 1.0

        checks = VisualChecks(
            hex_variance=hex_variance,
            text_overflow=False,  # Placeholder for more complex OCR checks
            logo_presence=True    # Placeholder for logo detection
        )
            
        return VisualGovernanceAudit(
            agent="visual_governance_pillow",
            asset_id=image_url,
            status=status,
            checks=checks
        )

    except Exception as e:
        # Failsafe if image cannot be loaded
        return VisualGovernanceAudit(
            agent="visual_governance_pillow",
            asset_id=image_url,
            status="FAILED",
            checks=VisualChecks(hex_variance=1.0, text_overflow=False, logo_presence=False)
        )
