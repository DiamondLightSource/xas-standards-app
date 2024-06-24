from sqlmodel import Session

from datetime import datetime

from xas_standards_api.models.models import (
    Person,
    Element,
    Edge,
    Facility,
    Beamline,
    XASStandard,
    LicenceType,
    ReviewStatus,
    XASStandardData,
)


def build_test_database(session: Session):
    session.add(Person(id=1, identifier="admin", admin=True))
    session.add(Person(id=2, identifier="user", admin=False))

    session.add(Element(name="Hydrogen", z=1, symbol="H"))
    session.add(Element(name="Helium", z=2, symbol="He"))
    session.add(Element(name="Lithium", z=3, symbol="Li"))
    session.add(Element(name="Beryllium", z=4, symbol="Be"))

    session.add(Edge(name="K", id=1, level="1s"))
    session.add(Edge(name="L3", id=2, level="2p3/2"))

    session.add(
        Facility(
            id=1,
            name="synchrotron",
            notes="a place",
            fullname="a synchrotron",
            city="somewhere",
            region="someplace",
            laboratory="a lab",
            country="somecountry",
        )
    )

    session.add(
        Beamline(
            facility_id=1,
            id=1,
            name="my beamline",
            notes="a beamline",
            xray_source="BM",
        )
    )

    xas_data1 = XASStandardData(
        emission=False,
        transmission=True,
        fluorescence=False,
        reference=False,
        location="./test.xdi",
        original_filename="standard.xdi",
    )
    xas_data2 = XASStandardData(
        emission=False,
        transmission=True,
        fluorescence=False,
        reference=False,
        location="./test.xdi",
        original_filename="standard.xdi",
    )

    session.add(xas_data1)
    session.add(xas_data2)

    session.commit()
    session.refresh(xas_data1)
    session.refresh(xas_data2)

    session.add(
        XASStandard(
            submitter_id=2,
            submission_date=datetime.min,
            collection_date=datetime.min,
            doi="doi",
            citation="citation",
            element_z=1,
            edge_id=1,
            sample_name="sample",
            sample_prep="pellet",
            sample_comp="H",
            beamline_id=1,
            licence=LicenceType.cc_0,
            id=1,
            data_id=xas_data1.id,
            reviewer_id=1,
            reviewer_comments="good",
            review_status=ReviewStatus.approved,
        )
    )

    session.add(
        XASStandard(
            submitter_id=2,
            submission_date=datetime.min,
            collection_date=datetime.min,
            doi="doi",
            citation="citation",
            element_z=1,
            edge_id=1,
            sample_name="sample",
            sample_prep="pellet",
            sample_comp="He",
            beamline_id=1,
            licence=LicenceType.cc_0,
            id=2,
            data_id=xas_data1.id,
            reviewer_id=None,
            reviewer_comments=None,
            review_status=ReviewStatus.pending,
        )
    )

    session.commit()
