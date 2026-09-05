"""Policy engine for threat-score actions."""

from dataclasses import dataclass
from enum import Enum


class Action(str, Enum):
    MONITOR = "monitor"
    RATE_LIMIT = "rate_limit"
    STEP_UP_MFA = "step_up_mfa"
    QUARANTINE = "quarantine"


@dataclass(frozen=True)
class Decision:
    action: Action
    requires_audit: bool = True


def decide(score: int) -> Decision:
    if score >= 5:
        return Decision(Action.QUARANTINE)
    if score == 4:
        return Decision(Action.STEP_UP_MFA)
    if score >= 2:
        return Decision(Action.RATE_LIMIT)
    return Decision(Action.MONITOR)
