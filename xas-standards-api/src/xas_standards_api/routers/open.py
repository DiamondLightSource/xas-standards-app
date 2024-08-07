from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi_pagination.cursor import CursorPage
from sqlmodel import Session

from ..crud import (
    get_data,
    get_file,
    get_metadata,
    get_registered_elements,
    get_standard,
    read_standards_page,
)
from ..database import get_session
from ..models.models import ReviewStatus
from ..models.response_models import (
    MetadataResponse,
    XASStandardResponse,
)

router = APIRouter()


@router.get("/api/standards/{id}")
async def read_standard(
    id: int, session: Session = Depends(get_session)
) -> XASStandardResponse:
    return get_standard(session, id)


@router.get("/api/metadata")
def read_metadata(session: Session = Depends(get_session)) -> MetadataResponse:
    return get_metadata(session)


@router.get("/api/standards")
def read_standards(
    session: Session = Depends(get_session),
    element: str | None = None,
) -> CursorPage[XASStandardResponse]:
    return read_standards_page(session, element)


@router.get("/api/data/{id}")
async def read_data(
    id: int, format: Optional[str] = "json", session: Session = Depends(get_session)
):
    standard = get_standard(session, id)

    if standard.review_status != ReviewStatus.approved:
        raise HTTPException(status_code=401, detail="Standard data not available")

    if format == "xdi":
        return get_file(session, id)

    return get_data(session, id)


@router.get("/api/elements/metrics")
async def read_elements(session: Session = Depends(get_session)):
    return get_registered_elements(session)
