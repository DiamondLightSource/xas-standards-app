
from fastapi import FastAPI
from fastapi_pagination import add_pagination

from .routers import admin, open, protected

app = FastAPI()

app.include_router(open.router)
app.include_router(protected.router)
app.include_router(admin.router)

add_pagination(app)
