import datetime

from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from utils import build_test_database
from xas_standards_api.app import app
from xas_standards_api.auth import get_current_user
from xas_standards_api.database import get_session
from xas_standards_api.models.models import XASStandard


def test_protected_router():
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

        def get_ordinary_user():
            return "user"

        def get_admin_user():
            return "admin"

        session.commit()

        # check non admin user is non admin user
        app.dependency_overrides[get_session] = get_session_override
        app.dependency_overrides[get_current_user] = get_ordinary_user

        client = TestClient(app)

        response = client.get("/api/user/")

        r = response.json()
        assert r["user"] == "user"
        assert not r["admin"]

        # check admin user is admin user
        app.dependency_overrides.clear()
        app.dependency_overrides[get_session] = get_session_override
        app.dependency_overrides[get_current_user] = get_admin_user

        response = client.get("/api/user/")

        r = response.json()

        assert r["user"] == "admin"
        assert r["admin"]

        unique_sample_name = f"Test sample {datetime.datetime.now()}"

        formdata = {
            "element_id": 1,
            "edge_id": 1,
            "beamline_id": 1,
            "sample_name": unique_sample_name,
            "sample_prep": "test",
            "doi": "doi",
            "citation": "citation",
            "comments": "comments",
            "date": str(datetime.datetime.min),
            "licence": "cc_by",
            "sample_comp": "H",
        }

        with open("test.xdi") as fh:
            xditext = fh.read()

        response = client.post(
            "/api/standards", data=formdata, files={"xdi_file": xditext}
        )

        assert response.status_code == 200

        rjson = response.json()

        xass = XASStandard.model_validate(rjson)

        assert xass.sample_name == unique_sample_name

        print(xass.id)

        # not reviewed, should fail
        response = client.get(f"/api/standards/{xass.id}")
        assert response.status_code == 403

        # get and review
        app.dependency_overrides.clear()
        app.dependency_overrides[get_session] = get_session_override
        app.dependency_overrides[get_current_user] = get_admin_user

        review_json = {
            "reviewer_comments": "reviewer",
            "review_status": "approved",
            "standard_id": 3,
        }

        response = client.patch("/api/standards", json=review_json)
        assert response.status_code == 200

        response = client.get(f"/api/standards/{xass.id}")
        assert response.status_code == 200

        # TODO WRITE DATA TO TMPDIR!!!!!!!!!
