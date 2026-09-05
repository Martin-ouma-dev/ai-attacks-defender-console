"""Privacy-preserving session activity normalization."""

from hashlib import sha256


def subject_fingerprint(subject: str, tenant_salt: str) -> str:
    if not subject or not tenant_salt:
        raise ValueError("subject and tenant salt are required")
    return sha256(f"{tenant_salt}:{subject}".encode()).hexdigest()
