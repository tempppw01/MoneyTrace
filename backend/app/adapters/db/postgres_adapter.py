from datetime import datetime
import uuid

from app.domain.models.transaction import Transaction
from app.domain.repositories.transaction_repository import TransactionRepository
from app.schemas.transactions import TransactionCreate


class PostgresTransactionRepository(TransactionRepository):
    def create(self, payload: TransactionCreate) -> Transaction:
        return Transaction(
            id=str(uuid.uuid4()),
            amount=payload.amount,
            category=payload.category,
            note=payload.note,
            created_at=datetime.utcnow(),
        )
