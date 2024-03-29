import datetime
import os
from typing import Annotated, List, Optional, Union

from fastapi import Depends, FastAPI, File, Form, Query, UploadFile
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi_pagination import add_pagination
from fastapi_pagination.cursor import CursorPage
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlmodel import Session, create_engine, select

from .crud import (
    add_new_standard,
    get_data,
    get_file,
    get_metadata,
    get_standard,
    select_all,
    select_or_create_person,
    update_review,
)
from .schemas import (
    Beamline,
    BeamlineResponse,
    Edge,
    Element,
    LicenceType,
    MetadataResponse,
    Review,
    XASStandard,
    XASStandardAdminResponse,
    XASStandardInput,
    XASStandardResponse,
)

dev = False
lifespan = None


url = os.environ.get("POSTGRESURL")
build_dir = os.environ.get("FRONTEND_BUILD_DIR")

if url:
    engine = create_engine(url)
else:
    print("URL not set - unit tests only")


def get_session():
    with Session(engine) as session:
        yield session


app = FastAPI(lifespan=lifespan)

CursorPage = CursorPage.with_custom_options(
    size=Query(10, ge=1, le=100),
)


add_pagination(app)


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
    admin: bool = False,
    response_model=Union[XASStandardResponse, XASStandardAdminResponse],
) -> CursorPage[XASStandardAdminResponse | XASStandardResponse]:

    statement = select(XASStandard)

    if element:
        statement = statement.join(Element, XASStandard.element_z == Element.z).where(
            Element.symbol == element
        )

    if admin:

        def transformer(x):
            return [XASStandardAdminResponse.model_validate(i) for i in x]

    else:

        def transformer(x):
            return [XASStandardResponse.model_validate(i) for i in x]

    return paginate(
        session, statement.order_by(XASStandard.id), transformer=transformer
    )


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
    session: Session = Depends(get_session),
) -> XASStandard:

    if additional_files:
        print(f"Additional files {len(additional_files)}")

    person = select_or_create_person(session, "test1234")

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
def submit_review(review: Review, session: Session = Depends(get_session)):
    return update_review(session, review)


@app.get("/api/data/{id}")
async def read_data(
    id: int, format: Optional[str] = "json", session: Session = Depends(get_session)
):

    if format == "xdi":
        return get_file(session, id)

    return get_data(session, id)


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
