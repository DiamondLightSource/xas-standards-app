import uuid

from fastapi import HTTPException, Query
from fastapi.responses import FileResponse, PlainTextResponse
from fastapi_pagination.cursor import CursorPage
from fastapi_pagination.ext.sqlalchemy import paginate
from larch.io import xdi
from larch.xafs import pre_edge, set_xafsGroup
from sqlmodel import Session, select

from .models.models import (
    Beamline,
    Edge,
    Element,
    LicenceType,
    Person,
    PersonInput,
    ReviewStatus,
    XASStandard,
    XASStandardAdminReviewInput,
    XASStandardData,
    XASStandardDataInput,
    XASStandardInput,
)
from .models.response_models import XASStandardResponse

CursorPage = CursorPage.with_custom_options(
    size=Query(10, ge=1, le=100),
)


pvc_location = "/scratch/xas-standards-pretend-pvc/"


def patch_standard_review(
    review: XASStandardAdminReviewInput, session: Session, user_id: str
):
    statement = select(Person).where(Person.identifier == user_id)
    person = session.exec(statement).first()

    if person is None or not person.admin:
        raise HTTPException(status_code=401, detail=f"No standard with id={user_id}")

    if not person.admin:
        raise HTTPException(status_code=401, detail=f"User {user_id} not admin")
    return update_review(session, review, person.id)


def read_standards_page(
    session: Session,
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


def get_beamline_names(session):
    results = session.exec(select(Beamline.name, Beamline.id)).all()
    return results


def select_all(session, sql_model):
    statement = select(sql_model)
    results = session.exec(statement)
    return results.unique().all()


def get_metadata(session):
    output = {}
    output["elements"] = select_all(session, Element)
    output["edges"] = select_all(session, Edge)
    output["beamlines"] = select_all(session, Beamline)
    output["licences"] = list(LicenceType)

    return output


def get_standard(session, id) -> XASStandard:
    standard = session.get(XASStandard, id)

    if standard:
        if standard.review_status != ReviewStatus.approved:
            raise HTTPException(status_code=403, detail="Standard not available")
        return standard
    else:
        raise HTTPException(status_code=404, detail=f"No standard with id={id}")


def update_review(session, review, reviewer_id):
    standard = session.get(XASStandard, review.standard_id)
    standard.review_status = review.review_status
    standard.reviewer_comments = review.reviewer_comments
    standard.reviewer_id = reviewer_id
    session.add(standard)
    session.commit()
    session.refresh(standard)
    return standard


def get_user(session, user_id):
    statement = select(Person).where(Person.identifier == user_id)
    person = session.exec(statement).first()

    admin = person is not None and person.admin

    return {"user": user_id, "admin": admin}


def select_or_create_person(session, identifier):
    p = PersonInput(identifier=identifier)

    statement = select(Person).where(Person.identifier == p.identifier)
    person = session.exec(statement).first()

    if person is None:
        new_person = Person.model_validate(p)
        session.add(new_person)
        session.commit()
        session.refresh(new_person)
        person = new_person

    return person


def add_new_standard(session, file1, xs_input: XASStandardInput, additional_files):
    tmp_filename = pvc_location + str(uuid.uuid4())

    with open(tmp_filename, "wb") as ntf:
        ntf.write(file1.file.read())

    xdi_data = xdi.read_xdi(tmp_filename)

    set_labels = set(xdi_data.array_labels)

    fluorescence = "mufluor" in set_labels
    transmission = "mutrans" in set_labels
    reference = "murefer" in set_labels
    emission = "mutey" in set_labels

    xsd = XASStandardDataInput(
        fluorescence=fluorescence,
        location=tmp_filename,
        original_filename=file1.filename,
        emission=emission,
        transmission=transmission,
        reference=reference,
    )

    new_standard = XASStandard.model_validate(xs_input)
    new_standard.xas_standard_data = XASStandardData.model_validate(xsd)
    session.add(new_standard)
    session.commit()
    session.refresh(new_standard)

    return new_standard


def get_filepath(session, id):
    standard = session.get(XASStandard, id)
    if not standard:
        raise HTTPException(status_code=404, detail=f"No standard with id={id}")

    standard_data = session.get(XASStandardData, standard.data_id)

    if not standard_data:
        raise HTTPException(
            status_code=404, detail=f"No standard data for standard with id={id}"
        )

    return standard_data.location


def get_file(session, id):
    xdi_location = get_filepath(session, id)
    return FileResponse(xdi_location)


def get_file_as_text(session, id, user_id):
    # only admins can see original file
    is_admin_user(session, user_id)

    xdi_location = get_filepath(session, id)
    with open(xdi_location) as fh:
        file = fh.read()

        return PlainTextResponse(file)


def get_norm(energy, group, type):
    if type in group:
        r = group[type]
        tr = set_xafsGroup(None)
        tr.energy = energy
        tr.mu = r
        pre_edge(tr)
        return tr.flat.tolist()

    return []


def get_data(session, id):
    xdi_location = get_filepath(session, id)

    xdi_data = xdi.read_xdi(xdi_location)

    if "energy" not in xdi_data:
        raise HTTPException(status_code=404, detail=f"No energy in file with id={id}")

    if "mutrans" not in xdi_data and "":
        raise HTTPException(status_code=404, detail=f"No itrans in file with id={id}")

    e = xdi_data["energy"]

    trans_out = get_norm(e, xdi_data, "mutrans")
    fluor_out = get_norm(e, xdi_data, "mufluor")
    ref_out = get_norm(e, xdi_data, "murefer")

    return {
        "energy": e.tolist(),
        "mutrans": trans_out,
        "mufluor": fluor_out,
        "murefer": ref_out,
    }


def get_standards_admin(
    session: Session,
    user_id: str,
):
    is_admin_user(session, user_id)

    statement = select(XASStandard).where(
        XASStandard.review_status == ReviewStatus.pending
    )

    return paginate(session, statement.order_by(XASStandard.id))


def is_admin_user(session: Session, user_id: str):
    statement = select(Person).where(Person.identifier == user_id)
    person = session.exec(statement).first()

    if person is None:
        raise HTTPException(
            status_code=401, detail=f"No person associated with id {user_id}"
        )

    if not person.admin:
        raise HTTPException(status_code=401, detail=f"User {user_id} not admin")

    return True
