from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from xas_standards_api.app import app
from xas_standards_api.auth import get_current_user
from xas_standards_api.database import get_session
from xas_standards_api.models.models import Beamline, Edge, Element, Facility, Person
from xas_standards_api.models.response_models import MetadataResponse

client = TestClient(app)


def test_read_item():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:

        session.add(Element(name="Hydrogen", z=1, symbol="H"))
        session.add(Edge(name="K", id=1, level="sp"))
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
        session.commit()

        def get_session_override():
            return session

        app.dependency_overrides[get_session] = get_session_override

        client = TestClient(app)

        response = client.get("/api/metadata/")
        app.dependency_overrides.clear()

        print(response)

        mr = MetadataResponse.model_validate(response.json())

        assert response.status_code == 200
        assert mr.elements[0].symbol == "H"
        assert mr.edges[0].name == "K"
        assert mr.beamlines[0].name == "my beamline"
        assert mr.beamlines[0].facility.name == "synchrotron"


def test_read_person():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:

        session.add(Person(id=1, identifier="abc123", admin=False))

        session.commit()

        def get_session_override():
            return session

        def get_current_user_override():
            return "abc123"

        app.dependency_overrides[get_session] = get_session_override
        app.dependency_overrides[get_current_user] = get_current_user_override

        client = TestClient(app)

        response = client.get("/api/user/")
        app.dependency_overrides.clear()

        r = response.json()

        assert r["user"] == "abc123"
        assert not r["admin"]
