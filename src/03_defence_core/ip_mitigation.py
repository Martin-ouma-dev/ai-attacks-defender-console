"""Provider-neutral interface for WAF/IP controls."""


def block_or_rate_limit(ip_address: str, action: str) -> str:
    if action not in {"block", "rate_limit"}:
        raise ValueError("Unsupported IP mitigation action")
    return f"{action}:{ip_address}"
