import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    app_title: str = "CustomerIQ API"
    app_version: str = "0.1.0"
    environment: str = os.getenv("CUSTOMERIQ_ENV", "development")
    database_path: str = os.getenv(
        "CUSTOMERIQ_DB_PATH",
        os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "Sql", "customeriq.db"),
    )
    cors_origins: tuple[str, ...] = tuple(
        os.getenv(
            "CUSTOMERIQ_CORS_ORIGINS",
            "http://127.0.0.1:8080,http://localhost:8080",
        ).split(",")
    )


settings = Settings()
