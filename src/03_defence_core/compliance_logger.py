"""Structured audit event boundary; never log raw credentials or payment data."""

from datetime import datetime, timezone
import json
import logging

logger = logging.getLogger("defender.audit")


def record(event_type: str, subject: str, action: str) -> None:
    logger.info(json.dumps({
        "event_type": event_type,
        "subject": subject[:128],
        "action": action,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }))
