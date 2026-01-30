from fastapi import APIRouter
from app.schemas.transactions import TransactionCreate, TransactionRead
from app.domain.services.transaction_service import TransactionService
from app.adapters.db.postgres_adapter import PostgresTransactionRepository

router = APIRouter(tags=["transactions"])

@router.post("/transactions", response_model=TransactionRead)
def create_transaction(payload: TransactionCreate):
    repo = PostgresTransactionRepository()
    service = TransactionService(repo)
    return service.create_transaction(payload)
