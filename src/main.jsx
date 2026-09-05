import React from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  AlertTriangle,
  ArrowDownToLine,
  Bot,
  Database,
  Globe2,
  LockKeyhole,
  Link2,
  Radar,
  ShieldCheck,
  ShieldEllipsis,
  Siren,
  TerminalSquare,
  UserRoundCog,
} from "lucide-react";
import "./index.css";

const incidents = [
  {
    time: "14:22:05.102",
    type: "PROMPT_INJECTION_DETECTED",
    source: "192.168.1.104",
    severity: "CRITICAL",
    agent: "SENTINEL_ALPHA",
    detail: "Recursive role override pattern blocked before model execution.",
  },
  {
    time: "14:21:58.841",
    type: "ANOMALY_TRAFFIC_SHAPED",
    source: "203.0.113.45",
    severity: "MEDIUM",
    agent: "VANGUARD_02",
    detail: "High-frequency query cadence isolated at the application edge.",
  },
  {
    time: "14:21:42.012",
    type: "DATA_EXFILTRATION_BLOCKED",
    source: "45.33.12.18",
    severity: "HIGH",
    agent: "GUARDIAN_CORE",
    detail: "Sensitive financial record pattern removed from an outgoing response.",
  },
];

const initialConfiguredUrls = (import.meta.env.VITE_BANKING_URLS || "")
  .split(",")
  .map((value) => value.trim())
  .filter((value) => {
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  });

function Metric({ label, value, icon: Icon }) {
  return (
    <div className="rounded-lg border border-slate-700/40 bg-panel2/80 p-4">
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[.16em] text-slate">
        {label}
        <Icon size={15} className="text-electric" />
      </div>
      <div className="mt-2 text-2xl font-bold text-cyan">{value}</div>
    </div>
  );
}

function Severity({ value }) {
  const colors = {
    CRITICAL: "border-threat/30 bg-threat/10 text-threat",
    HIGH: "border-threat/25 bg-threat/10 text-threat",
    MEDIUM: "border-slate-400/30 bg-slate-400/10 text-slate",
  };
  return <span className={`rounded border px-2 py-1 text-[10px] font-bold tracking-widest ${colors[value] || colors.MEDIUM}`}>{value}</span>;
}

function InternalPage({ title, eyebrow, children }) {
  return (
    <section>
      <div className="eyebrow">{eyebrow}</div>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">{title}</h1>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function AgentsPage() {
  const agents = [
    ["SENTINEL_ALPHA", "Prompt shield", "ACTIVE", "94%"],
    ["VANGUARD_02", "Behavioral biometrics", "ACTIVE", "88%"],
    ["GUARDIAN_CORE", "Deepfake and media integrity", "ISOLATED", "72%"],
  ];
  return <InternalPage title="Defence agents" eyebrow="Agent orchestration / secure application zone">
    <div className="grid gap-4 md:grid-cols-3">{agents.map(([name, role, status, health]) => <article className="panel p-5" key={name}><div className="flex items-start justify-between"><Bot className="text-electric" size={22} /><span className="font-mono text-[10px] tracking-widest text-cyan">{status}</span></div><h2 className="mt-5 font-mono text-sm font-bold text-white">{name}</h2><p className="mt-2 text-xs text-slate/70">{role}</p><div className="mt-6 h-1 rounded bg-panel2"><div className="h-full rounded bg-electric" style={{ width: health }} /></div><div className="mt-2 flex justify-between font-mono text-[10px] text-slate/60"><span>HEALTH</span><span>{health}</span></div></article>)}</div>
  </InternalPage>;
}

function LogsPage() {
  return <InternalPage title="Security logs" eyebrow="Immutable audit ledger / core financial zone">
    <div className="panel divide-y divide-electric/10">{incidents.concat(incidents).map((incident, index) => <div className="grid gap-2 p-4 md:grid-cols-[150px_1fr_100px]" key={`${incident.time}-${index}`}><span className="font-mono text-[11px] text-slate/60">{incident.time}</span><div><div className="font-mono text-xs font-bold text-cyan">{incident.type}</div><div className="mt-1 text-xs text-slate/70">{incident.detail}</div></div><Severity value={incident.severity} /></div>)}</div>
  </InternalPage>;
}

function SettingsPage({ autoDefense, setAutoDefense, configuredUrls }) {
  return <InternalPage title="Defence settings" eyebrow="Policy controls / least privilege">
    <div className="grid gap-4 md:grid-cols-2"><div className="panel p-5"><h2 className="font-semibold text-white">Response controls</h2><label className="mt-5 flex items-center justify-between border-b border-electric/10 py-4 text-sm"><span>Autonomous defence</span><input type="checkbox" checked={autoDefense} onChange={(event) => setAutoDefense(event.target.checked)} className="h-4 w-4 accent-electric" /></label><label className="flex items-center justify-between border-b border-electric/10 py-4 text-sm"><span>Step-up MFA on high risk</span><input type="checkbox" defaultChecked className="h-4 w-4 accent-electric" /></label><label className="flex items-center justify-between py-4 text-sm"><span>Immutable audit forwarding</span><input type="checkbox" defaultChecked className="h-4 w-4 accent-electric" /></label></div><div className="panel p-5"><h2 className="font-semibold text-white">Approved banking URLs</h2>{configuredUrls.length > 0 ? configuredUrls.map((url) => <div className="mt-4 flex items-center gap-2 rounded border border-electric/15 bg-panel2/70 p-3 font-mono text-xs text-cyan" key={url}><Link2 size={14} />{url}</div>) : <p className="mt-4 rounded border border-threat/25 bg-threat/10 p-3 text-xs text-threat">No approved banking endpoints configured. Protection is not active.</p>}<p className="mt-5 text-xs text-slate/60">URL changes require a deployment-controlled registry update and WAF review.</p></div></div>
  </InternalPage>;
}

function App() {
  const [active, setActive] = React.useState("Dashboard");
  const [autoDefense, setAutoDefense] = React.useState(true);
  const [configuredUrls, setConfiguredUrls] = React.useState(() => {
    try {
      const saved = localStorage.getItem("defender-approved-urls");
      return saved === null ? initialConfiguredUrls : JSON.parse(saved);
    } catch {
      return initialConfiguredUrls;
    }
  });
  const [urlInput, setUrlInput] = React.useState("");
  const [liveProtection, setLiveProtection] = React.useState(null);
  const [checkingProtection, setCheckingProtection] = React.useState(false);
  const checkProtection = React.useCallback(async (targetUrl = "") => {
    setCheckingProtection(true);
    try {
      const query = targetUrl.trim() ? `?url=${encodeURIComponent(targetUrl.trim())}` : "";
      const response = await fetch(`/api/v1/protection/status${query}`, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`Protection API returned ${response.status}`);
      const result = await response.json();
      setLiveProtection(targetUrl.trim() ? result : result);
    } catch (error) {
      setLiveProtection({ status: "unavailable", error: error.message });
    } finally {
      setCheckingProtection(false);
    }
  }, []);
  React.useEffect(() => {
    localStorage.setItem("defender-approved-urls", JSON.stringify(configuredUrls));
  }, [configuredUrls]);
  const addUrl = (event) => {
    event.preventDefault();
    try {
      const parsed = new URL(urlInput.trim());
      if (parsed.protocol !== "https:" || parsed.username || parsed.password || !parsed.hostname) {
        throw new Error("Use a public HTTPS URL without embedded credentials.");
      }
      const normalized = parsed.origin;
      if (!configuredUrls.includes(normalized)) setConfiguredUrls((current) => [...current, normalized]);
      setUrlInput("");
      checkProtection(normalized);
    } catch (error) {
      setLiveProtection({ status: "unavailable", error: error.message });
    }
  };
  return (
    <div className="min-h-screen bg-ink text-slate">
      <header className="fixed inset-x-0 top-0 z-20 h-16 border-b border-electric/20 bg-ink/90 px-4 shadow-glow backdrop-blur-xl md:px-8">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg border border-electric/70 text-electric shadow-glow"><ShieldCheck size={21} /></div>
            <div>
              <div className="text-sm font-extrabold tracking-tight text-cyan md:text-base">AI-ATTACKS DEFENDER</div>
              <div className="font-mono text-[9px] tracking-[.18em] text-slate/70">FINANCIAL SERVICES COMMAND</div>
            </div>
          </div>
          <div className="hidden items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-slate md:flex"><span className="h-2 w-2 animate-pulse rounded-full bg-electric" /> All protected zones operational</div>
          <button className="rounded-full border border-electric/20 p-2 text-electric transition hover:bg-electric/10" aria-label="Notifications"><Siren size={17} /></button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-24 md:px-8">
        {active !== "Dashboard" && <div className="mb-7" />}
        {active === "Dashboard" ? <>
        <section className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><div className="eyebrow">Cyber Sentinel Alpha / Hybrid defense model</div><h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">AI-Attacks Defender Console</h1><p className="mt-2 max-w-2xl text-sm text-slate">Continuous detection and containment for adversarial prompts, identity abuse, deepfakes, and anomalous transaction behavior.</p></div>
          <div className="rounded border border-electric/25 bg-electric/10 px-3 py-2 font-mono text-[10px] font-bold tracking-widest text-cyan">● DEFENSE FABRIC ONLINE</div>
        </section>

        <div className="grid gap-4 lg:grid-cols-12">
          <section className="panel relative overflow-hidden p-6 lg:col-span-5">
            <div className="scanline" />
            <div className="eyebrow text-center">Threat assessment score</div>
            <div className="mx-auto my-7 grid h-52 w-52 place-items-center rounded-full border border-electric/40 shadow-[0_0_0_18px_rgba(56,189,248,.05),0_0_45px_rgba(56,189,248,.28)]">
              <div className="grid h-40 w-40 place-items-center rounded-full border border-dashed border-electric/30"><div className="text-center"><ShieldEllipsis size={52} className="mx-auto text-electric" /><div className="mt-2 font-mono text-lg font-bold tracking-[.2em] text-cyan">SAFE</div></div></div>
            </div>
            <h2 className="text-center text-xl font-semibold text-white">System Protected</h2>
            <p className="mt-1 text-center font-mono text-[10px] uppercase tracking-widest text-slate/70">Zone isolation ready · 99.98% uptime</p>
            <div className="mt-6 grid grid-cols-3 gap-2"><Metric label="Blocked" value="1.2M" icon={ShieldCheck} /><Metric label="Agents" value="248" icon={Bot} /><Metric label="Risk" value="0.08" icon={Radar} /></div>
          </section>

          <section className="panel flex min-h-[430px] flex-col lg:col-span-7">
            <div className="flex items-center justify-between border-b border-electric/15 bg-electric/5 px-5 py-4"><h2 className="flex items-center gap-2 font-semibold text-white"><TerminalSquare size={18} className="text-electric" /> Live intercepts</h2><span className="rounded-full bg-electric/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-cyan">Intercepting</span></div>
            <div className="flex-1 divide-y divide-electric/10 overflow-auto">
              {incidents.map((incident) => <article key={incident.time} className="p-4 transition hover:bg-electric/[.03]"><div className="flex items-center justify-between gap-3"><span className="font-mono text-[11px] text-slate/70">{incident.time}</span><Severity value={incident.severity} /></div><div className="mt-2 flex gap-3"><AlertTriangle size={16} className="mt-0.5 shrink-0 text-electric" /><div className="min-w-0"><div className="font-mono text-xs font-bold text-cyan">{incident.type}</div><div className="mt-1 font-mono text-[11px] text-slate/70">ORIGIN: {incident.source} · AGENT: {incident.agent}</div><p className="mt-2 text-xs text-slate/80">{incident.detail}</p></div></div></article>)}
            </div>
            <div className="flex items-center justify-between border-t border-electric/15 bg-ink/40 px-5 py-3"><span className="font-mono text-[10px] uppercase tracking-widest text-slate/70">3 events in retention window</span><button className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest text-cyan hover:text-white"><ArrowDownToLine size={14} /> Export JSON</button></div>
          </section>
        </div>

        <section className="mt-4 grid gap-4 md:grid-cols-3">
          {[["PUBLIC INTERNET & DMZ", Globe2, "IP capture · Geo/reputation · WAF / DDoS"], ["SECURE APPLICATION ZONE", Database, "API gateways · Transaction feeds · Session analytics"], ["CORE FINANCIAL ZONE", LockKeyhole, "Isolated services · SIEM compliance · Containment"]].map(([title, Icon, text]) => <div className="panel p-5" key={title}><div className="flex items-center gap-3"><div className="rounded-lg bg-electric/10 p-2 text-electric"><Icon size={20} /></div><div><div className="font-mono text-[10px] font-bold tracking-widest text-cyan">{title}</div><div className="mt-1 text-xs text-slate/75">{text}</div></div></div><div className="mt-5 h-1 overflow-hidden rounded bg-panel2"><div className="h-full w-[96%] rounded bg-electric shadow-glow" /></div><div className="mt-2 flex justify-between font-mono text-[10px] text-slate/60"><span>HEALTHY</span><span>96%</span></div></div>)}
        </section>

        <section className="panel mt-4 p-5">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <div className="eyebrow">Public internet &amp; DMZ / monitored banking URLs</div>
              <h2 className="mt-1 flex items-center gap-2 text-lg font-semibold text-white"><Link2 size={18} className="text-electric" /> URL protection registry</h2>
              <p className="mt-1 text-xs text-slate/75">Only explicitly registered HTTPS endpoints are eligible for edge enforcement. The console does not claim protection for unregistered URLs.</p>
            </div>
            <span className={`rounded border px-3 py-2 font-mono text-[10px] font-bold tracking-widest ${configuredUrls.length ? "border-electric/20 bg-electric/10 text-cyan" : "border-threat/25 bg-threat/10 text-threat"}`}>{configuredUrls.length ? `${configuredUrls.length} ENDPOINTS ENFORCED` : "NO ENDPOINTS ENFORCED"}</span>
          </div>
          <form onSubmit={addUrl} className="mt-4 flex flex-col gap-2 sm:flex-row">
            <label htmlFor="banking-url" className="sr-only">Banking URL to protect</label>
            <input id="banking-url" value={urlInput} onChange={(event) => setUrlInput(event.target.value)} placeholder="https://secure.yourbank.com" className="min-w-0 flex-1 rounded border border-slate-600 bg-ink/70 px-3 py-3 font-mono text-xs text-white outline-none placeholder:text-slate/50 focus:border-electric" />
            <button type="submit" className="rounded border border-electric/40 bg-electric/10 px-4 py-3 font-mono text-[10px] font-bold tracking-widest text-cyan hover:bg-electric/20">ADD &amp; VERIFY URL</button>
          </form>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {liveProtection?.status === "protected" ? <div className="mb-3 rounded border border-electric/25 bg-electric/10 p-3 font-mono text-xs text-cyan">LIVE VERIFIED: HTTPS reachable and Cloudflare WAF, rate limiting, DDoS, and TLS controls are present.</div> : liveProtection?.status === "demo" ? <div className="mb-3 rounded border border-slate-400/30 bg-slate-400/10 p-3 font-mono text-xs text-slate">DEMO MODE: HTTPS reachability was checked. No WAF, DDoS, rate-limit, or banking protection was verified.</div> : <div className="mb-3 rounded border border-threat/25 bg-threat/10 p-3 font-mono text-xs text-threat">{liveProtection?.status === "incomplete" ? "LIVE CHECK: endpoint reachable, but one or more Cloudflare controls are incomplete." : liveProtection?.status === "unavailable" ? `LIVE CHECK UNAVAILABLE: ${liveProtection.error}` : "LIVE protection has not been verified. Configure the protection API and Cloudflare credentials."}</div>}
            {configuredUrls.length ? configuredUrls.map((url) => {
              const live = liveProtection?.endpoints?.find((item) => item.url === url);
              const isDemo = live?.enforcement?.status === "demo";
              const isVerified = live?.enforcement?.status === "verified" && live.status === "reachable";
              return <div className="flex flex-col gap-3 rounded border border-slate-700/40 bg-panel2/70 px-3 py-3" key={url}><div className="flex items-center justify-between gap-3"><span className="truncate font-mono text-xs text-cyan">{url}</span><span className={`ml-3 shrink-0 font-mono text-[10px] tracking-widest ${isVerified ? "text-electric" : isDemo ? "text-slate" : "text-threat"}`}>{isVerified ? "VERIFIED" : isDemo ? "DEMO" : "UNVERIFIED"}</span></div><div className="grid grid-cols-2 gap-2 text-[10px] font-mono uppercase tracking-widest text-slate/70 sm:grid-cols-5"><span>WAF {live?.enforcement?.controls?.waf ? "OK" : "—"}</span><span>Rate {live?.enforcement?.controls?.rate_limit ? "OK" : "—"}</span><span>DDoS {live?.enforcement?.controls?.ddos ? "OK" : "—"}</span><span>TLS {live?.enforcement?.controls?.tls_edge ? "OK" : live?.tls ? "REACHABLE" : "—"}</span><span>HTTP {live?.http_status || "—"}</span></div></div>;
            }) : <div className="rounded border border-threat/25 bg-threat/10 p-4 text-xs text-threat">Configure BANKING_URLS and connect the DMZ WAF/API gateway before onboarding a real banking endpoint.</div>}
            <button onClick={checkProtection} disabled={checkingProtection} className="mt-3 rounded border border-electric/30 px-3 py-2 font-mono text-[10px] font-bold tracking-widest text-cyan hover:bg-electric/10 disabled:opacity-50">{checkingProtection ? "CHECKING LIVE CONTROLS..." : "CHECK LIVE PROTECTION"}</button>
          </div>
        </section>

        <section className="panel mt-4 p-5"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-center"><div><div className="eyebrow">Automated defence core</div><h2 className="mt-1 text-lg font-semibold text-white">Response posture</h2><p className="mt-1 text-xs text-slate/75">High-confidence events are contained at IP, session, and system levels.</p></div><label className="flex cursor-pointer items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-cyan"><input type="checkbox" checked={autoDefense} onChange={(event) => setAutoDefense(event.target.checked)} className="h-4 w-4 accent-electric" /> Autonomous defence</label></div><div className="mt-5 grid gap-3 md:grid-cols-3"><div className="rounded border border-electric/15 bg-panel2/60 p-4"><Activity size={17} className="text-electric" /><div className="mt-3 font-mono text-xs font-bold text-white">IP-level mitigation</div><div className="mt-1 text-xs text-slate/70">Block traffic and rate-limit at WAF.</div></div><div className="rounded border border-electric/15 bg-panel2/60 p-4"><UserRoundCog size={17} className="text-electric" /><div className="mt-3 font-mono text-xs font-bold text-white">Session-level mitigation</div><div className="mt-1 text-xs text-slate/70">Isolate user and force step-up MFA.</div></div><div className="rounded border border-electric/15 bg-panel2/60 p-4"><Database size={17} className="text-electric" /><div className="mt-3 font-mono text-xs font-bold text-white">System-level actions</div><div className="mt-1 text-xs text-slate/70">SIEM event and compliance audit log.</div></div></div></section>
        </> : active === "Agents" ? <AgentsPage /> : active === "Logs" ? <LogsPage /> : <SettingsPage autoDefense={autoDefense} setAutoDefense={setAutoDefense} configuredUrls={configuredUrls} />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-center gap-10 border-t border-electric/25 bg-panel/95 px-4 py-3 backdrop-blur-xl md:gap-20">
        {["Dashboard", "Agents", "Logs", "Settings"].map((item) => <button key={item} onClick={() => setActive(item)} className={`font-mono text-[10px] uppercase tracking-widest transition ${active === item ? "text-cyan [text-shadow:0_0_8px_rgba(56,189,248,.7)]" : "text-slate/70 hover:text-cyan"}`}><span className="block text-center text-base">{item === "Dashboard" ? "◉" : item === "Agents" ? "◈" : item === "Logs" ? "▤" : "⚙"}</span>{item}</button>)}
      </nav>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
