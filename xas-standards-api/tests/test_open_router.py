from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

import xas_standards_api.crud
from utils import build_test_database
from xas_standards_api.app import app
from xas_standards_api.database import get_session
from xas_standards_api.models.response_models import (
    MetadataResponse,
    XASStandardResponse,
)


def test_read_metadata(tmpdir):

    xas_standards_api.crud.pvc_location = str(tmpdir)

    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        build_test_database(session)

        def get_session_override():
            return session

        client = TestClient(app)
        app.dependency_overrides[get_session] = get_session_override

        response = client.get("/api/metadata/")

        print(response)

        mr = MetadataResponse.model_validate(response.json())

        assert response.status_code == 200
        assert mr.elements[0].symbol == "H"
        assert mr.edges[0].name == "K"
        assert mr.beamlines[0].name == "my beamline"
        assert mr.beamlines[0].facility.name == "synchrotron"

        response = client.get("/api/standards/")

        rjson = response.json()

        assert "items" in rjson
        assert len(rjson["items"]) == 1

        assert "submitter" not in rjson["items"][0]

        xassr = XASStandardResponse.model_validate(rjson["items"][0])

        assert xassr.id == 1

        # check can get data from open endpoint
        response = client.get("/api/data/1")
        assert response.status_code == 200

        rjson = response.json()

        assert "mutrans" in rjson

        # check cant get unreviewed data from open endpoint
        response = client.get("/api/data/2")
        assert response.status_code == 403

        # check cant get id that doesnt exist
        response = client.get("/api/data/3")
        assert response.status_code == 404

        response = client.get("/api/standards/1")
        assert response.status_code == 200

        response = client.get("/api/standards/2")
        assert response.status_code == 403

        response = client.get("/api/standards/3")
        assert response.status_code == 404
