import uuid

from fastapi import HTTPException
from fastapi.responses import FileResponse
from larch.io import xdi
from larch.xafs import pre_edge, set_xafsGroup
from sqlmodel import select

from .schemas import (
    Beamline,
    Edge,
    Element,
    LicenceType,
    Person,
    PersonInput,
    XASStandard,
    XASStandardData,
    XASStandardDataInput,
    XASStandardInput,
)

pvc_location = "/scratch/xas-standards-pretend-pvc/"


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
