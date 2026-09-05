"""Optional Azure OpenAI enrichment for security telemetry.

The model is advisory only. Deterministic detection and defence policy remain
authoritative, and sensitive telemetry is redacted before it leaves the API.
"""

from __future__ import annotations

import json
import os
import re
import importlib.util
from pathlib import Path
import sys
from typing import Any

import httpx


def _load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load security module: {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


_ROOT = Path(__file__).resolve().parents[2]
_detection = _load_module("defender_detection", _ROOT / "src" / "02_detection_engine" / "main.py")
_policy = _load_module("defender_policy", _ROOT / "src" / "03_defence_core" / "engine.py")


SENSITIVE_KEYS = {
    "password",
    "secret",
    "token",
    "authorization",
    "cookie",
    "credit_card",
    "account_number",
    "ssn",
    "private_key",
}
SENSITIVE_PATTERNS = (
    re.compile(r"(?i)\b(?:bearer|basic)\s+[a-z0-9._~+/=-]+"),
    re.compile(r"\b(?:\d[ -]*?){13,19}\b"),
)


def _redact(value: Any, key: str = "") -> Any:
    if key.casefold() in SENSITIVE_KEYS:
        return "[REDACTED]"
    if isinstance(value, dict):
        return {str(item_key): _redact(item_value, str(item_key)) for item_key, item_value in value.items()}
    if isinstance(value, list):
        return [_redact(item) for item in value[:50]]
    if isinstance(value, str):
        redacted = value[:4096]
        for pattern in SENSITIVE_PATTERNS:
            redacted = pattern.sub("[REDACTED]", redacted)
        return redacted
    return value


def _azure_configured() -> bool:
    return all(
        os.getenv(name, "").strip()
        for name in ("AZURE_OPENAI_ENDPOINT", "AZURE_OPENAI_API_KEY", "AZURE_OPENAI_DEPLOYMENT")
    )


async def enrich(payload: dict[str, Any]) -> dict[str, Any]:
    serialized = json.dumps(payload, separators=(",", ":"), default=str)
    deterministic = _detection.assess(serialized)
    decision = _policy.decide(deterministic.score)
    result: dict[str, Any] = {
        "deterministic": {
            "score": deterministic.score,
            "category": deterministic.category,
            "rationale": deterministic.rationale,
        },
        "policy": {"action": decision.action.value, "requires_audit": decision.requires_audit},
        "model": {"provider": "azure-openai", "status": "not_configured", "advisory": None},
    }
    if not _azure_configured():
        return result

    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT", "").rstrip("/")
    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT", "").strip()
    api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-10-21").strip()
    url = f"{endpoint}/openai/deployments/{deployment}/chat/completions"
    headers = {"api-key": os.getenv("AZURE_OPENAI_API_KEY", ""), "Content-Type": "application/json"}
    body = {
        "temperature": 0,
        "max_tokens": 300,
        "response_format": {"type": "json_object"},
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a banking cybersecurity triage assistant. Return JSON with keys "
                    "summary, indicators, confidence. Do not propose changing the enforced policy."
                ),
            },
            {"role": "user", "content": json.dumps({"telemetry": _redact(payload), "deterministic": result["deterministic"]})},
        ],
    }
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            response = await client.post(url, params={"api-version": api_version}, headers=headers, json=body)
            response.raise_for_status()
        content = response.json()["choices"][0]["message"]["content"]
        advisory = json.loads(content) if isinstance(content, str) else content
        result["model"] = {"provider": "azure-openai", "status": "advisory", "advisory": advisory}
        return result
    except (httpx.HTTPError, KeyError, IndexError, TypeError, ValueError) as exc:
        result["model"] = {
            "provider": "azure-openai",
            "status": "unavailable",
            "advisory": None,
            "error": str(exc)[:160],
        }
        return result
