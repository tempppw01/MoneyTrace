from fastapi import FastAPI
from app.api.controllers.health import router as health_router
from app.api.controllers.transactions import router as transactions_router

app = FastAPI(title="MoneyTrace API", version="0.1.0")

app.include_router(health_router, prefix="/api")
app.include_router(transactions_router, prefix="/api")
