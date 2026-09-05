"""Streaming adapter entry point. Payload validation belongs before this boundary."""


def handler(event: dict, _context: object) -> dict:
    if not isinstance(event, dict) or "records" not in event:
        raise ValueError("Expected a records event")
    return {"accepted": len(event["records"])}
