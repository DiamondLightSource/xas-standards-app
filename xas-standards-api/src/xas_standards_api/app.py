import datetime
import os
from typing import Annotated, List, Optional

import requests
from fastapi import (
    Depends,
    FastAPI,
    File,
    Form,
    HTTPException,
    Query,
    UploadFile,
    status,
)
from fastapi.responses import HTMLResponse
from fastapi.security.http import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.staticfiles import StaticFiles
from fastapi_pagination import add_pagination
from fastapi_pagination.cursor import CursorPage
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlmodel import Session, create_engine, select
from starlette.responses import RedirectResponse

from .crud import (
    add_new_standard,
    get_data,
    get_file,
    get_file_as_text,
    get_metadata,
    get_standard,
    select_all,
    select_or_create_person,
    update_review,
)
from .schemas import (
    AdminXASStandardResponse,
    Beamline,
    BeamlineResponse,
    Edge,
    Element,
    LicenceType,
    MetadataResponse,
    Person,
    ReviewStatus,
    XASStandard,
    XASStandardAdminReviewInput,
    XASStandardInput,
    XASStandardResponse,
)

dev = False

env_value = os.environ.get("FASTAPI_APP_ENV")

if env_value and env_value == "development":
    print("RUNNING IN DEV MODE")
    dev = True

get_bearer_token = HTTPBearer(auto_error=True)

url = os.environ.get("POSTGRESURL")
build_dir = os.environ.get("FRONTEND_BUILD_DIR")
oidc_user_info_endpoint = os.environ.get("OIDC_USER_INFO_ENDPOINT")


if url:
    engine = create_engine(url)
else:
    print("URL not set - unit tests only")


def get_session():
    with Session(engine) as session:
        yield session


app = FastAPI()

CursorPage = CursorPage.with_custom_options(
    size=Query(10, ge=1, le=100),
)

add_pagination(app)


@app.get("/login", response_class=RedirectResponse)
async def redirect_home():
    # proxy handles log in so if you reach here go home
    return "/"


async def get_current_user(
    auth: HTTPAuthorizationCredentials = Depends(get_bearer_token),
):

    if auth is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user token",
        )

    if dev:
        return auth.credentials

    if oidc_user_info_endpoint is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User info endpoint error",
        )

    response = requests.get(
        url=oidc_user_info_endpoint,
        headers={"Authorization": f"Bearer {auth.credentials}"},
    )

    if response.status_code == 401:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user token",
        )

    return response.json()["id"]


@app.get("/api/user")
async def check(
    session: Session = Depends(get_session), user_id: str = Depends(get_current_user)
):

    statement = select(Person).where(Person.identifier == user_id)
    person = session.exec(statement).first()

    admin = person is not None and person.admin

    return {"user": user_id, "admin": admin}


@app.get("/api/metadata")
def read_metadata(session: Session = Depends(get_session)) -> MetadataResponse:
    return get_metadata(session)


@app.get("/api/licences")
def read_licences(session: Session = Depends(get_session)) -> List[LicenceType]:
    return list(LicenceType)


@app.get("/api/beamlines")
def read_beamlines(session: Session = Depends(get_session)) -> List[BeamlineResponse]:
    bl = select_all(session, Beamline)
    return bl


@app.get("/api/elements")
def read_elements(session: Session = Depends(get_session)) -> List[Element]:
    e = select_all(session, Element)
    return e


@app.get("/api/edges")
def read_edges(session: Session = Depends(get_session)) -> List[Edge]:
    e = select_all(session, Edge)
    return e


@app.get("/api/standards")
def read_standards(
    session: Session = Depends(get_session),
    element: str | None = None,
) -> CursorPage[XASStandardResponse]:

    statement = select(XASStandard).where(
        XASStandard.review_status == ReviewStatus.approved
    )

    if element:
        statement = statement.join(Element, XASStandard.element_z == Element.z).where(
            Element.symbol == element
        )

    return paginate(
        session,
        statement.order_by(XASStandard.id),
    )


@app.get("/api/admin/standards")
def read_standards_admin(
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
) -> CursorPage[AdminXASStandardResponse]:

    statement = select(Person).where(Person.identifier == user_id)
    person = session.exec(statement).first()

    if person is None or not person.admin:
        raise HTTPException(status_code=401, detail=f"No standard with id={user_id}")

    if not person.admin:
        raise HTTPException(status_code=401, detail=f"User {user_id} not admin")

    statement = select(XASStandard).where(
        XASStandard.review_status == ReviewStatus.pending
    )

    return paginate(session, statement.order_by(XASStandard.id))


@app.get("/api/standards/{id}")
async def read_standard(
    id: int, session: Session = Depends(get_session)
) -> XASStandardResponse:
    return get_standard(session, id)


@app.post("/api/standards")
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


@app.patch("/api/standards")
def submit_review(
    review: XASStandardAdminReviewInput,
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user),
):

    statement = select(Person).where(Person.identifier == user_id)
    person = session.exec(statement).first()

    if person is None or not person.admin:
        raise HTTPException(status_code=401, detail=f"No standard with id={user_id}")

    if not person.admin:
        raise HTTPException(status_code=401, detail=f"User {user_id} not admin")
    return update_review(session, review, person.id)


@app.get("/api/data/{id}")
async def read_data(
    id: int, format: Optional[str] = "json", session: Session = Depends(get_session)
):

    if format == "xdi":
        return get_file(session, id)

    return get_data(session, id)

@app.get("/api/admin/data/{id}")
async def read_admin_data(
    id: int, session: Session = Depends(get_session)
):

    return get_file_as_text(session, id)

@app.post("/uploadfiles/")
async def create_upload_files(
    files: Annotated[
        list[UploadFile], File(description="Multiple files as UploadFile")
    ],
):
    return {"filenames": [file.filename for file in files]}


@app.get("/test")
async def main():
    content = """
<body>
<form action="/uploadfiles/" enctype="multipart/form-data" method="post">
<input name="files" type="file" multiple>
<input type="submit">
</form>
</body>
    """
    return HTMLResponse(content=content)


if build_dir:
    app.mount("/", StaticFiles(directory="/client/dist", html=True), name="site")
