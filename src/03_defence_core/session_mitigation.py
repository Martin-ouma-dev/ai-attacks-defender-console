"""Provider-neutral interface for session containment."""


def require_step_up_or_isolate(session_id: str, isolate: bool) -> str:
    if not session_id or len(session_id) > 128:
        raise ValueError("Invalid session identifier")
    return "isolate" if isolate else "step_up_mfa"
