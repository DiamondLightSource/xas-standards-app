from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from utils import build_test_database
from xas_standards_api.app import app
from xas_standards_api.auth import get_current_user
from xas_standards_api.database import get_session


def test_read_person():
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

        # TODO check post of standard
        # TODO check patch of standard
