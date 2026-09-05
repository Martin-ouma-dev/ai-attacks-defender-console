# AI-Attacks Defender Console

Fresh command console for banking and financial-service cybersecurity operations. The interface follows the supplied design: dark navy command surfaces, cyan active-defense glow, rose threat states, glass panels, a threat-assessment shield, protected zones, live intercepts, and automated defense controls.

## GitHub Pages

The frontend is deployed by `.github/workflows/deploy.yml` after a push to `main`. In repository settings, set **Pages -> Build and deployment -> Source** to **GitHub Actions**. The public site is:

`https://martin-ouma-dev.github.io/ai-attacks-defender-console/`

The Pages frontend cannot safely host the Cloudflare API token or protection API. Run that API separately behind an authenticated server.

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

## Banking URL registry

Set `VITE_BANKING_URLS` for display and `BANKING_URLS` as the authoritative server registry. No endpoints are enabled by default. You can enter an HTTPS endpoint in the dashboard; it is checked for public DNS, HTTPS reachability, and deployed Cloudflare controls. The frontend does not create protection rules.

## Live Cloudflare verification

For local testing without Cloudflare credentials, set `PROTECTION_MODE=demo`. Results are deliberately labeled `DEMO` and do not claim WAF, DDoS, rate-limit, or banking protection.

For real verification, create a least-privilege Cloudflare API token for the account owning the zone and store it only on the protection API server as `CLOUDFLARE_API_TOKEN`. Never put it in `VITE_*` variables or browser storage.

Provisioning is staged: `POST /api/v1/protection/provision/plan?url=...` is always a dry run. Applying changes requires explicit confirmation plus server-side staging approval flags.

## Azure OpenAI advisory analysis

The authenticated `POST /api/v1/telemetry/analyze` endpoint accepts a bounded telemetry event and always runs deterministic detection and defence policy first. If `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`, and `AZURE_OPENAI_DEPLOYMENT` are configured on the API server, Azure OpenAI returns an additional advisory summary. The model cannot change quarantine, MFA, rate-limit, or monitoring decisions. Sensitive fields and credential-like values are redacted before the request, and the API reports `not_configured` or `unavailable` instead of silently claiming AI coverage.

## Security baseline

- Never commit `.env` files or credentials.
- Keep dashboard and telemetry tokens separate and rotate them through a secrets manager.
- Treat model output as advisory; deterministic policy and human approval boundaries remain authoritative.
- Redact payment data, credentials, session tokens, and raw customer data before logging.
- Deploy the core zone with deny-by-default network policy, mTLS, WAF controls, immutable audit logs, and least-privilege service identities.
