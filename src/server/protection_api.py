"""Authenticated live protection verification API."""

from __future__ import annotations

import ipaddress
import os
import socket
from urllib.parse import urlparse

import httpx
from dotenv import load_dotenv
from fastapi import Body, Depends, FastAPI, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.server.azure_advisor import enrich

load_dotenv()

app = FastAPI(title="AI-Attacks Defender Protection API", docs_url=None, redoc_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[item.strip() for item in os.getenv("CORS_ORIGINS", "").split(",") if item.strip()],
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization"],
)


class TelemetryEvent(BaseModel):
    event_type: str = Field(min_length=1, max_length=128)
    payload: dict = Field(default_factory=dict)


def authenticate(authorization: str | None = Header(default=None)) -> None:
    expected = os.getenv("DASHBOARD_API_TOKEN", "")
    if not expected or authorization != f"Bearer {expected}":
        raise HTTPException(status_code=401, detail="Invalid dashboard token")


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "mode": os.getenv("PROTECTION_MODE", "live"),
        "cloudflare_configured": bool(os.getenv("CLOUDFLARE_API_TOKEN")),
        "azure_openai_configured": all(
            os.getenv(name, "").strip()
            for name in ("AZURE_OPENAI_ENDPOINT", "AZURE_OPENAI_API_KEY", "AZURE_OPENAI_DEPLOYMENT")
        ),
    }


@app.post("/api/v1/telemetry/analyze")
async def analyze_telemetry(event: TelemetryEvent = Body(...), _: None = Depends(authenticate)):
    """Return deterministic enforcement plus optional Azure OpenAI advisory context."""
    return await enrich({"event_type": event.event_type, "payload": event.payload})


def public_addresses(hostname: str) -> list[str]:
    addresses = {result[4][0] for result in socket.getaddrinfo(hostname, 443, type=socket.SOCK_STREAM)}
    if not addresses or any(
        ipaddress.ip_address(address).is_private
        or ipaddress.ip_address(address).is_loopback
        or ipaddress.ip_address(address).is_link_local
        or ipaddress.ip_address(address).is_reserved
        for address in addresses
    ):
        raise ValueError("Endpoint resolves to a non-public address")
    return sorted(addresses)


async def probe_url(url: str) -> dict:
    parsed = urlparse(url)
    if parsed.scheme != "https" or parsed.username or parsed.password or parsed.port not in (None, 443):
        return {"url": url, "status": "not_verified", "reason": "HTTPS endpoint with standard port required"}
    if not parsed.hostname:
        return {"url": url, "status": "not_verified", "reason": "Missing hostname"}
    try:
        public_addresses(parsed.hostname)
        async with httpx.AsyncClient(timeout=5, follow_redirects=False) as client:
            response = await client.get(url, headers={"User-Agent": "AI-Attacks-Defender-HealthCheck/1.0"})
        return {
            "url": url,
            "status": "reachable",
            "http_status": response.status_code,
            "tls": True,
            "redirect": response.headers.get("location") if response.is_redirect else None,
        }
    except (socket.gaierror, ValueError, httpx.HTTPError) as exc:
        return {"url": url, "status": "unreachable", "reason": str(exc)[:160]}


async def cloudflare_controls(hostname: str) -> dict:
    token = os.getenv("CLOUDFLARE_API_TOKEN", "")
    if not token:
        if os.getenv("PROTECTION_MODE", "live") == "demo":
            return {"provider": "demo", "status": "demo", "controls": {}}
        return {"provider": "cloudflare", "status": "not_configured", "controls": {}}
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    async with httpx.AsyncClient(timeout=8) as client:
        zones = await client.get(
            "https://api.cloudflare.com/client/v4/zones",
            params={"name": hostname},
            headers=headers,
        )
        zones.raise_for_status()
        zone_results = zones.json().get("result", [])
        if not zone_results:
            return {"provider": "cloudflare", "status": "zone_not_found", "controls": {}}
        zone_id = zone_results[0]["id"]
        rulesets = await client.get(
            f"https://api.cloudflare.com/client/v4/zones/{zone_id}/rulesets",
            headers=headers,
        )
        rulesets.raise_for_status()
        phases = {item.get("phase") for item in rulesets.json().get("result", [])}
        ssl = await client.get(
            f"https://api.cloudflare.com/client/v4/zones/{zone_id}/settings/ssl",
            headers=headers,
        )
        ssl.raise_for_status()
        ssl_mode = ssl.json().get("result", {}).get("value")
        controls = {
            "waf": "http_request_firewall_custom" in phases,
            "rate_limit": "http_ratelimit" in phases,
            "ddos": "ddos_l7" in phases,
            "tls_edge": ssl_mode in {"full", "full_strict", "strict"},
        }
        return {
            "provider": "cloudflare",
            "status": "verified" if all(controls.values()) else "incomplete",
            "zone_id": zone_id,
            "controls": controls,
        }


async def verify(urls: list[str]) -> dict:
    endpoints = []
    for url in urls:
        probe = await probe_url(url)
        hostname = urlparse(url).hostname
        enforcement = await cloudflare_controls(hostname) if hostname else {"status": "not_verified", "controls": {}}
        endpoints.append({**probe, "enforcement": enforcement})
    active = all(item["status"] == "reachable" and item["enforcement"]["status"] == "verified" for item in endpoints)
    demo = all(item["enforcement"]["status"] == "demo" for item in endpoints)
    return {"status": "protected" if active else "demo" if demo else "incomplete", "endpoints": endpoints}


@app.get("/api/v1/protection/status")
async def protection_status(url: str | None = Query(default=None, max_length=2048), _: None = Depends(authenticate)):
    configured = [item.strip() for item in os.getenv("BANKING_URLS", "").split(",") if item.strip()]
    urls = [url.strip()] if url else configured
    return {"status": "not_configured", "endpoints": []} if not urls else await verify(urls)


@app.post("/api/v1/protection/provision/plan")
async def provision_plan(url: str = Query(..., min_length=10, max_length=2048), _: None = Depends(authenticate)):
    parsed = urlparse(url)
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
        raise HTTPException(status_code=422, detail="Only HTTPS URLs without embedded credentials are accepted")
    return {
        "mode": "dry_run",
        "url": url,
        "provider": "cloudflare",
        "current": await cloudflare_controls(parsed.hostname),
        "planned_controls": ["tls_full_strict", "managed_waf", "rate_limit_sensitive_paths", "layer7_ddos", "security_event_logging"],
        "requires_apply_approval": True,
    }


@app.post("/api/v1/protection/provision/apply")
async def provision_apply(url: str = Query(..., min_length=10, max_length=2048), confirm: bool = Query(default=False), _: None = Depends(authenticate)):
    if not confirm:
        raise HTTPException(status_code=400, detail="Explicit confirm=true is required")
    if os.getenv("PROTECTION_APPLY_ENABLED") != "true":
        raise HTTPException(status_code=409, detail="Provisioning is disabled; complete staging approval first")
    if not os.getenv("STAGING_CLOUDFLARE_ZONE_ID"):
        raise HTTPException(status_code=409, detail="STAGING_CLOUDFLARE_ZONE_ID is not configured")
    raise HTTPException(status_code=501, detail="Approved staging ruleset adapter is not configured; no provider changes were made")
