"""Server-side allowlist for approved banking endpoints.

This is the authoritative boundary for WAF/API routing. The frontend registry is
display-only and must never be used as an access-control decision.
"""

from urllib.parse import urlparse


def validate_banking_url(value: str, approved_hosts: set[str]) -> str:
    parsed = urlparse(value)
    if parsed.scheme != "https" or parsed.username or parsed.password:
        raise ValueError("Banking endpoints must use HTTPS without embedded credentials")
    if parsed.port not in (None, 443):
        raise ValueError("Non-standard endpoint ports are not permitted")
    hostname = (parsed.hostname or "").lower().rstrip(".")
    if not hostname or hostname not in {host.lower().rstrip(".") for host in approved_hosts}:
        raise ValueError("Endpoint is not in the approved banking host registry")
    return parsed.geturl()
