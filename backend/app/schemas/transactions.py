from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel


class TransactionCreate(BaseModel):
    amount: Decimal
    category: str
    note: str | None = None


class TransactionRead(BaseModel):
    id: str
    amount: Decimal
    category: str
    note: str | None = None
    created_at: datetime
