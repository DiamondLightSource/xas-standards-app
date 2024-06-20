import datetime
from typing import Annotated, Optional

from fastapi import (
    APIRouter,
    Depends,
    Form,
    UploadFile,
)
from sqlmodel import Session

from ..auth import get_current_user
from ..crud import (
    add_new_standard,
    get_user,
    patch_standard_review,
    select_or_create_person,
)
from ..database import get_session
from ..models.models import XASStandard, XASStandardAdminReviewInput, XASStandardInput

router = APIRouter()


@router.get("/api/user")
async def check(
    session: Session = Depends(get_session), user_id: str = Depends(get_current_user)
):

    return get_user(session, user_id)


@router.post("/api/standards")
def add_standard_file(
    xdi_file: UploadFile,
    element_id: Annotated[str, Form()],
    edge_id: Annotated[str, Form()],
    beamline_id: Annotated[int, Form()],
    sample_name: Annotated[str, Form()],
    sample_prep: Annotated[str, Form()],
    doi: Annotated[str, Form()],
    citation: Annotated[str, Form()],
    comments: Annotated[str, Form()],
    date: Annotated[str, Form()],
    licence: Annotated[str, Form()],
    additional_files: Optional[list[UploadFile]] = Form(None),
    sample_comp: Optional[str] = Form(None),
    user_id: str = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> XASStandard:

    if additional_files:
        print(f"Additional files {len(additional_files)}")

    person = select_or_create_person(session, user_id)

    form_input = XASStandardInput(
        submitter_id=person.id,
        beamline_id=beamline_id,
        doi=doi,
        element_z=element_id,
        edge_id=edge_id,
        sample_name=sample_name,
        sample_prep=sample_prep,
        submitter_comments=comments,
        citation=citation,
        licence=licence,
        collection_date=date,
        submission_date=datetime.datetime.now(),
        sample_comp=sample_comp,
    )

    return add_new_standard(session, xdi_file, form_input, additional_files)


@router.patch("/api/standards")
def submit_review(
    review: XASStandardAdminReviewInput,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
):

    return patch_standard_review(review, session, user_id)
