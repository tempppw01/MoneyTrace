from abc import ABC, abstractmethod
from app.domain.models.transaction import Transaction
from app.schemas.transactions import TransactionCreate

class TransactionRepository(ABC):
    @abstractmethod
    def create(self, payload: TransactionCreate) -> Transaction:
        raise NotImplementedError
