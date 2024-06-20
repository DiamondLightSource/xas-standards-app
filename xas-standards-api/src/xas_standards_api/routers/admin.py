from fastapi import APIRouter, Depends
from fastapi_pagination.cursor import CursorPage
from sqlmodel import Session

from ..auth import get_current_user
from ..crud import get_file_as_text, get_standards_admin
from ..database import get_session
from ..models.response_models import AdminXASStandardResponse

router = APIRouter()


@router.get("/api/admin/data/{id}")
async def read_admin_data(id: int, session: Session = Depends(get_session)):

    return get_file_as_text(session, id)


@router.get("/api/admin/standards")
def read_standards_admin(
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> CursorPage[AdminXASStandardResponse]:

    return get_standards_admin(session,user_id)
