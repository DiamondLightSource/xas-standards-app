import os
import uuid
import difflib

import datetime
from fastapi import HTTPException
from larch.io import xdi
from sqlmodel import select

from .schemas import (
    Beamline,
    Facility,
    Mono,
    Person,
    PersonInput,
    Sample,
    XASStandard,
    XASStandardData,
    XASStandardInput,
    XASStandardDataInput,
    Edge,
    Element,
    LicenceType
)

pvc_location = "/scratch/xas-standards-pretend-pvc/"

def get_beamline_names(session):
    results = session.exec(select(Beamline.name, Beamline.id)).all();
    return results


def get_beamlines(session):
    statement = select(Beamline)
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


def add_new_standard(session, file1, identifier):
    p = PersonInput(identifier=identifier)

    statement = select(Person).where(Person.identifier == p.identifier)
    person = session.exec(statement).first()

    if person is None:
        print("no person")
        new_person = Person.from_orm(p)
        session.add(new_person)
        session.commit()
        session.refresh(new_person)
        person = new_person
    else:
        print(person.id)

    tmp_filename = pvc_location + str(uuid.uuid4())

    with open(tmp_filename, "wb") as ntf:
        filename = ntf.name
        ntf.write(file1.file.read())
        xdi_data = xdi.read_xdi(filename)

        statement = select(Element).where(Element.symbol == xdi_data.element)
        element = session.exec(statement).first()

        if element is None:
            raise HTTPException(status_code=404, detail=f"No element with symbol = {xdi_data.element}")

        statement = select(Edge).where(Edge.name == xdi_data.edge)
        edge = session.exec(statement).first()

        if edge is None:
            raise HTTPException(status_code=404, detail=f"No edge with name = {xdi_data.edge}")
        
        bldict = xdi_data.attrs.get("beamline", {})

        names = get_beamline_names(session)
        #difflib to find closest?

        just_names = [n[0] for n in names]
        match = difflib.get_close_matches(bldict["name"], just_names)

        if not match:
            raise HTTPException(status_code=404, detail=f"No beamline with name = {bldict['name']}")
        
        bl_id = None

        print(f"Input {bldict['name']} matches {match[0]}")

        for name_id in names:
            if match[0] == name_id[0]:
                bl_id = name_id[1]
                break

        if bl_id is None:
            raise HTTPException(status_code=500, detail=f"Could not find beamline id")
        
        xsd = XASStandardDataInput(fluorescence=True,
                                   location=tmp_filename,
                                   original_filename=file1.filename,
                                   reference=True,
                                   transmission=True)

        bl = Beamline(**xdi_data.attrs.get("beamline", {}))
        fac = Facility(**xdi_data.attrs.get("facility", {}))
        samp = Sample(**xdi_data.attrs.get("sample", {}))
        mono = Mono(**xdi_data.attrs.get("mono", {}))

        xs = XASStandardInput(sample_name=samp.name,
                              sample_prep=samp.prep,
                              additional_metadata=None,
                              beamline_id=bl_id,
                              collection_date=None,
                              doi=None,
                              element_z=element.z,
                              edge_id=edge.id,
                              licence=LicenceType.cc_by,
                              mono_dspacing=None,
                              mono_name=None,
                              review_status=None,
                              reviewer_comments=None,
                              submission_date=datetime.datetime.now(),
                              reviewer_id=None,
                              submitter_id=person.id)


    new_standard = XASStandard.from_orm(xs)
    new_standard.xas_standard_data = XASStandardData.from_orm(xsd)
    session.add(new_standard)
    session.commit()
    session.refresh(new_standard)

    # os.rename(tmp_filename, pvc_location + str(new_standard.id) + ".xdi")
        
    # new_standard = xs

    return new_standard


def get_data(session, id):
    standard = session.get(XASStandard, id)
    if not standard:
        raise HTTPException(status_code=404, detail=f"No standard with id={id}")

    xdi_data = xdi.read_xdi(pvc_location + str(standard.id) + ".xdi")

    if "energy" not in xdi_data:
        raise HTTPException(status_code=404, detail=f"No energy in file with id={id}")
    
    if "mutrans" not in xdi_data and "":
        raise HTTPException(status_code=404, detail=f"No itrans in file with id={id}")

    e = xdi_data["energy"]
    i = xdi_data["mutrans"]
    print(xdi_data.array_labels)

    return {"energy": e.tolist(), "itrans": i.tolist()}
