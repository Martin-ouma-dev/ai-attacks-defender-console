"""Deterministic-first threat assessment orchestration.

Model-assisted signals can enrich an event, but cannot override policy controls.
"""

from dataclasses import dataclass
import re


@dataclass(frozen=True)
class DetectionResult:
    score: int
    category: str
    rationale: str


def assess(payload: str) -> DetectionResult:
    normalized = payload.casefold()
    if re.search(r"\b(drop\s+table|union\s+select|or\s+1\s*=\s*1)\b", normalized):
        return DetectionResult(5, "database-injection", "Database manipulation signature detected")
    if "ignore previous instructions" in normalized or "reveal system prompt" in normalized:
        return DetectionResult(5, "prompt-injection", "Instruction hierarchy override pattern detected")
    if re.search(r"\b(password|secret|private key|seed phrase)\b", normalized):
        return DetectionResult(4, "credential-exfiltration", "Sensitive credential request pattern detected")
    return DetectionResult(1, "baseline", "No high-confidence malicious signature detected")
