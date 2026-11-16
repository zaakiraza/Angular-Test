import os
from collections.abc import Generator
from pathlib import Path

from sqlalchemy import URL, create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.db.base import Base

DEFAULT_DATABASE_PATH = Path(__file__).resolve().parents[2] / "todo.db"
database_url = os.getenv("DATABASE_URL")
if database_url:
    engine = create_engine(
        database_url,
        connect_args={"check_same_thread": False} if database_url.startswith("sqlite") else {},
    )
else:
    engine = create_engine(
        URL.create("sqlite", database=str(DEFAULT_DATABASE_PATH)),
        connect_args={"check_same_thread": False},
    )

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def create_db_tables() -> None:
    from app.models import task  # noqa: F401

    Base.metadata.create_all(bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
