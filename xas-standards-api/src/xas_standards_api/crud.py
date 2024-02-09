import os
import uuid

from fastapi import HTTPException
from larch.io import xdi
from sqlmodel import select

from larch.xafs import pre_edge,set_xafsGroup

from .schemas import (
    Beamline,
    Person,
    PersonInput,
    XASStandard,
    XASStandardData,
    XASStandardInput,
    XASStandardDataInput
)

pvc_location = "/scratch/xas-standards-pretend-pvc/"

def get_beamline_names(session):
    results = session.exec(select(Beamline.name, Beamline.id)).all();
    return results

def select_all(session, sql_model):
    statement = select(sql_model)
    results = session.exec(statement)
    return results.unique().all()

def get_standard(session, id) -> XASStandard:
    standard = session.get(XASStandard, id)
    if standard:
        return standard
    else:
        raise HTTPException(status_code=404, detail=f"No standard with id={id}")


def update_review(session, review):
    standard = session.get(XASStandard, review.id)
    standard.review_status = review.review_status
    session.add(standard)
    session.commit()
    session.refresh(standard)
    return standard

def select_or_create_person(session, identifier):
    p = PersonInput(identifier=identifier)

    statement = select(Person).where(Person.identifier == p.identifier)
    person = session.exec(statement).first()

    if person is None:
        new_person = Person.from_orm(p)
        session.add(new_person)
        session.commit()
        session.refresh(new_person)
        person = new_person

    return person


def add_new_standard(session, file1, xs_input : XASStandardInput, additional_files):

    tmp_filename = pvc_location + str(uuid.uuid4())

    with open(tmp_filename, "wb") as ntf:
        filename = ntf.name
        ntf.write(file1.file.read())
        xdi_data = xdi.read_xdi(filename)

        set_labels = set(xdi_data.array_labels)

        fluorescence = "mufluro" in set_labels
        transmission = "mutrans" in set_labels
        emission = "mutey" in set_labels

        xsd = XASStandardDataInput(fluorescence=fluorescence,
                                   location=tmp_filename,
                                   original_filename=file1.filename,
                                   emission=emission,
                                   transmission=transmission)

    new_standard = XASStandard.model_validate(xs_input)
    new_standard.xas_standard_data = XASStandardData.model_validate(xsd)
    session.add(new_standard)
    session.commit()
    session.refresh(new_standard)

    return new_standard


def get_data(session, id):
    standard = session.get(XASStandard, id)
    if not standard:
        raise HTTPException(status_code=404, detail=f"No standard with id={id}")
    
    standard_data = session.get(XASStandardData, standard.data_id)

    if not standard_data:
        raise HTTPException(status_code=404, detail=f"No standard data for standard with id={id}")

    xdi_data = xdi.read_xdi(standard_data.location)

    if "energy" not in xdi_data:
        raise HTTPException(status_code=404, detail=f"No energy in file with id={id}")
    
    if "mutrans" not in xdi_data and "":
        raise HTTPException(status_code=404, detail=f"No itrans in file with id={id}")

    e = xdi_data["energy"]
    t = xdi_data["mutrans"]
    r = xdi_data["murefer"]

    tg = set_xafsGroup(None)
    tg.energy = e
    tg.mu = t
    pre_edge(tg)

    tr = set_xafsGroup(None)
    tr.energy = e
    tr.mu = r
    pre_edge(tr)


    return {"energy": e.tolist(), "mutrans": tg.flat.tolist(), "murefer": tr.flat.tolist()}
