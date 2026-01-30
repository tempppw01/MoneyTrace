from app.domain.models.transaction import Transaction
from app.domain.repositories.transaction_repository import TransactionRepository
from app.schemas.transactions import TransactionCreate

class TransactionService:
    def __init__(self, repo: TransactionRepository):
        self.repo = repo

    def create_transaction(self, payload: TransactionCreate) -> Transaction:
        return self.repo.create(payload)
