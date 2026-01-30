import os

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.api.controllers.health import router as health_router
from app.api.controllers.transactions import router as transactions_router

app = FastAPI(title="MoneyTrace API", version="0.1.0")

app.include_router(health_router, prefix="/api")
app.include_router(transactions_router, prefix="/api")

frontend_dist = os.getenv("FRONTEND_DIST")
if frontend_dist and os.path.isdir(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")
