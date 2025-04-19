from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Database Imports
from database.tables import table_users, table_comments, table_requests, table_request_admin_assignments
from database.database import engine

from config import settings

from routers import routers


# FastAPI app Init
app = FastAPI(
    title="Form Automation",
    openapi_url=f"/api/openapi.json",
    docs_url=f"/api/docs",
    redoc_url=f"/api/redoc",
)


# CORS Middleware
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(routers.router)


# Database Models Creation
table_users.Base.metadata.create_all(bind=engine)
table_comments.Base.metadata.create_all(bind=engine)
table_requests.Base.metadata.create_all(bind=engine)
table_request_admin_assignments.Base.metadata.create_all(bind=engine)


@app.get("/")
def current_status():
    return {"status": "OK"}