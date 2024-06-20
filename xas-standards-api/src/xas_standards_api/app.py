import os

from fastapi import (
    FastAPI,
)
from fastapi.staticfiles import StaticFiles
from fastapi_pagination import add_pagination
from starlette.responses import RedirectResponse

from .routers import admin, open, protected

dev = False

env_value = os.environ.get("FASTAPI_APP_ENV")

if env_value and env_value == "development":
    print("RUNNING IN DEV MODE")
    dev = True


build_dir = os.environ.get("FRONTEND_BUILD_DIR")

app = FastAPI()

app.include_router(open.router)
app.include_router(protected.router)
app.include_router(admin.router)

add_pagination(app)


@app.get("/login", response_class=RedirectResponse)
async def redirect_home():
    # proxy handles log in so if you reach here go home
    return "/"


if build_dir:
    app.mount("/", StaticFiles(directory="/client/dist", html=True), name="site")
