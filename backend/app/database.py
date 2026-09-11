import os
import sqlite3
from contextlib import contextmanager
from typing import Iterator, Optional

from .config import settings


class CustomerIQDatabase:
    """Thin read-only SQLite database access layer for CustomerIQ."""

    def __init__(self, database_path: Optional[str] = None):
        self.database_path = database_path or settings.database_path
        if not os.path.exists(self.database_path):
            raise FileNotFoundError(f"CustomerIQ database not found at {self.database_path}")

    @contextmanager
    def connect(self) -> Iterator[sqlite3.Connection]:
        conn = sqlite3.connect(f"file:{self.database_path}?mode=ro", uri=True)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
        finally:
            conn.close()

    def fetch_one(self, query: str, params: tuple = ()) -> Optional[sqlite3.Row]:
        with self.connect() as conn:
            cur = conn.execute(query, params)
            row = cur.fetchone()
            return row

    def fetch_all(self, query: str, params: tuple = ()) -> list[sqlite3.Row]:
        with self.connect() as conn:
            cur = conn.execute(query, params)
            return cur.fetchall()


customeriq_db = CustomerIQDatabase()
