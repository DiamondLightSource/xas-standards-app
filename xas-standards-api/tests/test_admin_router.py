from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from utils import build_test_database
from xas_standards_api.app import app
from xas_standards_api.auth import get_current_user
from xas_standards_api.database import get_session
from xas_standards_api.models.response_models import AdminXASStandardResponse


def test_admin_read_permissions():
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

        client = TestClient(app)

        # first try with ordinary user
        app.dependency_overrides[get_session] = get_session_override
        app.dependency_overrides[get_current_user] = get_ordinary_user

        response = client.get("/api/admin/standards")

        assert response.status_code == 401

        # check cant get data
        response = client.get("/api/admin/data/2")
        assert response.status_code == 401

        # check cant get data from open endpoint
        response = client.get("/api/data/2")
        assert response.status_code == 401

        # now try admin user
        app.dependency_overrides.clear()
        app.dependency_overrides[get_session] = get_session_override
        app.dependency_overrides[get_current_user] = get_admin_user

        response = client.get("/api/admin/standards")
        r = response.json()

        # check response is paginated, containing 1 item
        assert "items" in r
        assert len(r["items"]) == 1

        # check its correct response and contains the submitter identifier
        axassr = AdminXASStandardResponse.model_validate(r["items"][0])
        assert axassr.submitter.identifier == "user"

        # check can get data
        response = client.get("/api/admin/data/2")

        assert response.text.startswith("# XDI")
