from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal


@dataclass
class Transaction:
    id: str
    amount: Decimal
    category: str
    note: str | None
    created_at: datetime