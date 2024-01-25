import os
from contextlib import asynccontextmanager
from typing import Annotated,List

from fastapi import Depends, FastAPI, Form, UploadFile
from fastapi.responses import HTMLResponse
from fastapi_pagination import add_pagination
from fastapi_pagination.cursor import CursorPage
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlmodel import Session, SQLModel, create_engine, select

from .crud import add_new_standard, get_data, get_standard, update_review, get_beamlines
from .schemas import (
    Review,
    XASStandard,
    Element,
    BeamlineResponse,
    XASStandardResponse
)

dev = True
lifespan = None


if dev:
    engine = create_engine(
        "sqlite:///standards.db", connect_args={"check_same_thread": False}, echo=True
    )

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        SQLModel.metadata.create_all(engine)
        yield
else:
    url = os.environ.get("POSTGRESURL")
    engine = create_engine(url)


def get_session():
    with Session(engine) as session:
        yield session


app = FastAPI(lifespan=lifespan)

add_pagination(app)


@app.get("/", response_class=HTMLResponse)
async def root():
    content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Upload</title>
</head>
<body>
  <h1>Upload XDI file</h1>
  <form action="http://localhost:8000/api/standards" method="post" enctype="multipart/form-data">
  <p><input type="file" name="file1">
  <p><label for="Licence">Choose a Licence:</label>
<select name="licence" id="licence">
  <option value="CC BY">CC BY</option>
  <option value="CC BY-SA">CC BY-SA</option>
</select> 
  <p><button type="submit">Submit</button>
</form>
</body>
</html>"""

    return HTMLResponse(content=content, status_code=200)


@app.get("/api/beamlines") 
def read_beamlines(session: Session = Depends(get_session))-> List[BeamlineResponse]:
    bl = get_beamlines(session)
    print(bl[0])
    return bl

@app.get("/api/standards")
def read_standards(session: Session = Depends(get_session), element: str | None = None) -> CursorPage[XASStandardResponse]:


    statement = select(XASStandard)

    if element:
        statement = statement.join(Element, XASStandard.element_z==Element.z).where(Element.symbol == element)

    return paginate(session, statement.order_by(XASStandard.id))


@app.get("/api/standards/{id}")
async def read_standard(
    id: int, session: Session = Depends(get_session)
) -> XASStandard:
    return get_standard(session, id)


@app.post("/api/standards")
def add_standard_file(
    file1: UploadFile,
    licence: Annotated[str, Form()],
    session: Session = Depends(get_session),
) -> XASStandard:
    print(licence)
    return add_new_standard(session, file1, "vdp96513")


@app.patch("/api/standards")
def submit_review(review: Review, session: Session = Depends(get_session)):
    return update_review(session, review)


@app.get("/api/data/{id}")
async def read_data(id: int, session: Session = Depends(get_session)):
    return get_data(session, id)
