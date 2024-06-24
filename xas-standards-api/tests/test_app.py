from fastapi.testclient import TestClient

from xas_standards_api.app import app


def test_login_redirect():
    client = TestClient(app)
    response = client.get("/login")
    # expect 404 since root is not defined in test
    assert response.status_code == 404
