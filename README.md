# AI-Attacks Defender Console

Fresh command console for banking and financial-service cybersecurity operations. The interface follows the supplied design: dark navy command surfaces, cyan active-defense glow, rose threat states, glass panels, a threat-assessment shield, protected zones, live intercepts, and automated defense controls.

## GitHub Pages

The frontend is deployed by `.github/workflows/deploy.yml` after a push to `main`. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The public site is:

`https://martin-ouma-dev.github.io/ai-attacks-defender-console/`

The Pages frontend cannot safely host the Cloudflare API token or the protection API. Run that API separately behind an authenticated server and configure the production frontend/API gateway accordingly.

## Run the console

```powershell
npm install
npm run dev
```

Copy `.env.example` to `.env`, set a long local `DASHBOARD_API_TOKEN`, and keep `PROTECTION_MODE=demo` until you add your Cloudflare token. Start the API in a second PowerShell window:

```powershell
python -m pip install -r requirements.txt
.\scripts\start-api.ps1
```

Check it at `http://127.0.0.1:8001/health`. The Vite proxy loads `.env` and forwards the dashboard token server-to-server.

The current UI uses safe, clearly labeled demo telemetry. Replace the data adapter with the authenticated API in `src/01_integration_layer/` before enabling live operations.

## Banking URL registry

Set `VITE_BANKING_URLS` to a comma-separated list of approved HTTPS banking endpoints. No endpoints are enabled by default. The console rejects malformed or non-HTTPS values at render time and clearly reports when no endpoint is protected.

You can also enter an endpoint directly in the dashboard’s **Banking URL to protect** field. The console accepts only HTTPS URLs without embedded credentials, stores the operator list in browser local storage, and immediately calls the authenticated protection API for a live check. This does not bypass the server-side registry or create Cloudflare rules; it verifies the URL against controls already deployed.

This registry alone does **not** protect a bank. For each registered URL, the deployment must bind the hostname to an approved DMZ WAF/API gateway policy that enforces TLS/mTLS, DDoS protection, rate limits, prompt-injection and data-loss inspection, session risk controls/step-up MFA, and immutable SIEM audit forwarding. The frontend is an operator view; the server-side registry and WAF are authoritative. Do not onboard a production URL until those controls are verified with a deployment test.

## Live Cloudflare verification

Run the protection API separately:

```powershell
uvicorn src.server.protection_api:app --host 127.0.0.1 --port 8001
```

For local testing without Cloudflare credentials, set `PROTECTION_MODE=demo`. You can enter any public HTTPS URL and the API will perform a real DNS/public-address/TLS/HTTP reachability check. The result is deliberately labeled `DEMO` and does not claim WAF, DDoS, rate-limit, or banking protection.

For real enforcement, create a Cloudflare API token in the Cloudflare dashboard for the account that owns the zone. Store it only on the protection API server as `CLOUDFLARE_API_TOKEN`; never put it in `VITE_*` variables or browser storage.

Set both `VITE_BANKING_URLS` (display) and `BANKING_URLS` (authoritative server registry), plus `CLOUDFLARE_API_TOKEN` on that server. The token needs read access to the Cloudflare zone, rulesets, and SSL setting. The API checks public DNS resolution, HTTPS reachability, Cloudflare WAF/rate-limit/DDoS ruleset phases, and the zone TLS mode. It does not claim protection when a check is unavailable or incomplete. In production, place the API behind your authenticated operator gateway; never put the Cloudflare token in `VITE_*` variables.

Provisioning is intentionally staged: `POST /api/v1/protection/provision/plan?url=...` is always a dry run. Applying changes requires an explicit confirmation and server-side `PROTECTION_APPLY_ENABLED=true` plus `STAGING_CLOUDFLARE_ZONE_ID`; the default is disabled.

## Security baseline

- Never commit `.env` files or credentials.
- Keep dashboard and telemetry tokens separate and rotate them through a secrets manager.
- Treat model output as advisory; deterministic policy and human approval boundaries must remain authoritative.
- Redact payment data, credentials, session tokens, and raw customer data before logging.
- Deploy the core zone with deny-by-default network policy, mTLS, WAF controls, immutable audit logs, and least-privilege service identities.
