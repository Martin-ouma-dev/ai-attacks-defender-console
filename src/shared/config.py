"""Validated runtime configuration for the defense services."""

from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    api_ingest_token: str
    dashboard_token: str
    audit_sink: str
    environment: str

    @classmethod
    def from_env(cls) -> "Settings":
        ingest = os.getenv("API_INGEST_TOKEN", "")
        dashboard = os.getenv("DASHBOARD_API_TOKEN", "")
        if len(ingest) < 32 or len(dashboard) < 32:
            raise RuntimeError("API tokens must be at least 32 characters and supplied by a secret manager")
        return cls(
            api_ingest_token=ingest,
            dashboard_token=dashboard,
            audit_sink=os.getenv("AUDIT_SINK", "stdout"),
            environment=os.getenv("ENVIRONMENT", "development"),
        )
