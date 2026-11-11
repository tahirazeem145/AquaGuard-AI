import re
from fastapi import HTTPException, status
from backend.app.core.config import settings

def validate_image_upload(content_type: str, file_size: int) -> None:
    """Validate uploaded image MIME type and file size."""
    if content_type not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type '{content_type}'. Allowed: {', '.join(settings.ALLOWED_IMAGE_TYPES)}"
        )
    if file_size > settings.MAX_IMAGE_SIZE_BYTES:
        max_mb = settings.MAX_IMAGE_SIZE_BYTES // (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image size exceeds the {max_mb} MB limit."
        )

def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent path traversal attacks."""
    clean_name = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', filename)
    return clean_name.lstrip('.')

