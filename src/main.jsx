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
  LayoutDashboard,
  Radar,
  ScrollText,
  ShieldCheck,
  Siren,
  Settings,
  TerminalSquare,
  UserRoundCog,
  UsersRound,
  Vault,
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
    <div className="metric-row border-l border-slate/20 pl-3">
      <div className="split text-[10px] font-mono uppercase tracking-[.12em] text-slate">
        {label}
        <Icon size={14} className="text-electric" />
      </div>
      <div className="font-mono text-xl font-semibold text-cyan">{value}</div>
    </div>
  );
}

function Severity({ value }) {
  const colors = {
    CRITICAL: "border-threat/30 bg-threat/10 text-threat",
    HIGH: "border-threat/25 bg-threat/10 text-threat",
    MEDIUM: "border-slate-400/30 bg-slate-400/10 text-slate",
  };
  return <span className={`border px-2 py-1 text-[10px] font-bold tracking-widest ${colors[value] || colors.MEDIUM}`}>{value}</span>;
}

function InternalPage({ title, eyebrow, children }) {
  return (
    <section className="animate-in">
      <div className="eyebrow">{eyebrow}</div>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h1>
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
    <div className="grid gap-4 md:grid-cols-3">{agents.map(([name, role, status, health]) => <article className="panel p-5 transition-all duration-200 ease-in-out hover:-translate-y-0.5" key={name}><div className="flex items-start justify-between"><Bot className="text-electric" size={22} /><span className="rounded-full border border-electric/20 bg-electric/5 px-2 py-1 font-mono text-[10px] tracking-widest text-cyan">{status}</span></div><h2 className="mt-5 font-mono text-sm font-bold text-white">{name}</h2><p className="mt-2 text-xs text-slate/70">{role}</p><div className="mt-6 h-1 rounded bg-panel2"><div className="h-full rounded bg-electric" style={{ width: health }} /></div><div className="mt-2 flex justify-between font-mono text-[10px] text-slate/60"><span>HEALTH</span><span>{health}</span></div></article>)}</div>
  </InternalPage>;
}

function LogsPage() {
  return <InternalPage title="Security logs" eyebrow="Immutable audit ledger / core financial zone">
    <div className="panel divide-y divide-slate-800 overflow-hidden">{incidents.concat(incidents).map((incident, index) => <div className="grid gap-3 p-4 transition-all duration-200 ease-in-out hover:bg-white/[.03] md:grid-cols-[150px_1fr_100px] md:items-center" key={`${incident.time}-${index}`}><span className="font-mono text-[11px] text-slate/60">{incident.time}</span><div><div className="font-mono text-xs font-bold text-cyan">{incident.type}</div><div className="mt-1 text-xs text-slate/70">{incident.detail}</div></div><Severity value={incident.severity} /></div>)}</div>
  </InternalPage>;
}

function SettingsPage({ autoDefense, setAutoDefense, configuredUrls }) {
  return <InternalPage title="Defence settings" eyebrow="Policy controls / least privilege">
    <div className="grid gap-4 md:grid-cols-2"><div className="panel p-5"><h2 className="font-semibold text-white">Response controls</h2><label className="mt-5 flex items-center justify-between border-b border-slate/20 py-4 text-sm transition-colors duration-200 hover:text-white"><span>Autonomous defence</span><input type="checkbox" checked={autoDefense} onChange={(event) => setAutoDefense(event.target.checked)} className="h-4 w-4 accent-electric" /></label><label className="flex items-center justify-between border-b border-slate/20 py-4 text-sm transition-colors duration-200 hover:text-white"><span>Step-up MFA on high risk</span><input type="checkbox" defaultChecked className="h-4 w-4 accent-electric" /></label><label className="flex items-center justify-between py-4 text-sm transition-colors duration-200 hover:text-white"><span>Immutable audit forwarding</span><input type="checkbox" defaultChecked className="h-4 w-4 accent-electric" /></label></div><div className="panel p-5"><h2 className="font-semibold text-white">Approved banking URLs</h2>{configuredUrls.length > 0 ? configuredUrls.map((url) => <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate/20 bg-panel2/70 p-3 font-mono text-xs text-cyan transition-all duration-200 ease-in-out hover:border-electric/30" key={url}><Link2 size={14} />{url}</div>) : <p className="mt-4 rounded-lg border border-threat/25 bg-threat/10 p-3 text-xs text-threat">No approved banking endpoints configured. Protection is not active.</p>}<p className="mt-5 text-xs text-slate/60">URL changes require a deployment-controlled registry update and WAF review.</p></div></div>
  </InternalPage>;
}

function UrlProtectionPage({ configuredUrls, urlInput, setUrlInput, addUrl, liveProtection, checkProtection, checkingProtection }) {
  return <InternalPage title="URL protection registry" eyebrow="Public internet & DMZ / monitored banking URLs">
    <section className="panel p-4">
      <div className="split">
        <p className="max-w-2xl text-xs text-slate/75">Only explicitly registered HTTPS endpoints are eligible for edge enforcement. The console does not claim protection for unregistered URLs.</p>
        <span className={`shrink-0 border px-3 py-2 font-mono text-[10px] font-bold tracking-widest ${configuredUrls.length ? "border-electric/20 bg-electric/10 text-cyan" : "border-threat/25 bg-threat/10 text-threat"}`}>{configuredUrls.length ? `${configuredUrls.length} ENDPOINTS ENFORCED` : "NO ENDPOINTS ENFORCED"}</span>
      </div>
      <form onSubmit={addUrl} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="banking-url" className="sr-only">Banking URL to protect</label>
        <input id="banking-url" value={urlInput} onChange={(event) => setUrlInput(event.target.value)} placeholder="https://secure.yourbank.com" className="min-w-0 flex-1 rounded border border-slate-600 bg-ink/70 px-3 py-3 font-mono text-xs text-white outline-none placeholder:text-slate/50 focus:border-electric" />
        <button type="submit" className="rounded border border-electric/40 bg-electric/10 px-4 py-3 font-mono text-[10px] font-bold tracking-widest text-cyan hover:bg-electric/20">ADD &amp; VERIFY URL</button>
      </form>
      <div className="stack mt-4">
        {liveProtection?.status === "protected" ? <div className="border border-electric/25 bg-electric/10 p-3 font-mono text-xs text-cyan">LIVE VERIFIED: HTTPS reachable and Cloudflare WAF, rate limiting, DDoS, and TLS controls are present.</div> : liveProtection?.status === "demo" ? <div className="border border-slate-400/30 bg-slate-400/10 p-3 font-mono text-xs text-slate">DEMO MODE: HTTPS reachability was checked. No WAF, DDoS, rate-limit, or banking protection was verified.</div> : <div className="border border-threat/25 bg-threat/10 p-3 font-mono text-xs text-threat">{liveProtection?.status === "incomplete" ? "LIVE CHECK: endpoint reachable, but one or more Cloudflare controls are incomplete." : liveProtection?.status === "unavailable" ? `LIVE CHECK UNAVAILABLE: ${liveProtection.error}` : "LIVE protection has not been verified. Configure the protection API and Cloudflare credentials."}</div>}
        {configuredUrls.length ? configuredUrls.map((url) => {
          const live = liveProtection?.endpoints?.find((item) => item.url === url);
          const isDemo = live?.enforcement?.status === "demo";
          const isVerified = live?.enforcement?.status === "verified" && live.status === "reachable";
          return <div className="stack gap-3 border border-slate-700/40 bg-panel2/70 px-3 py-3" key={url}><div className="split"><span className="truncate font-mono text-xs text-cyan">{url}</span><span className={`shrink-0 font-mono text-[10px] tracking-widest ${isVerified ? "text-electric" : isDemo ? "text-slate" : "text-threat"}`}>{isVerified ? "VERIFIED" : isDemo ? "DEMO" : "UNVERIFIED"}</span></div><div className="grid grid-cols-2 gap-2 text-[10px] font-mono uppercase tracking-widest text-slate/70 sm:grid-cols-5"><span>WAF {live?.enforcement?.controls?.waf ? "OK" : "—"}</span><span>Rate {live?.enforcement?.controls?.rate_limit ? "OK" : "—"}</span><span>DDoS {live?.enforcement?.controls?.ddos ? "OK" : "—"}</span><span>TLS {live?.enforcement?.controls?.tls_edge ? "OK" : live?.tls ? "REACHABLE" : "—"}</span><span>HTTP {live?.http_status || "—"}</span></div></div>;
        }) : <div className="border border-threat/25 bg-threat/10 p-4 text-xs text-threat">Configure BANKING_URLS and connect the DMZ WAF/API gateway before onboarding a real banking endpoint.</div>}
        <button onClick={checkProtection} disabled={checkingProtection} className="self-start rounded border border-electric/30 px-3 py-2 font-mono text-[10px] font-bold tracking-widest text-cyan hover:bg-electric/10 disabled:opacity-50">{checkingProtection ? "CHECKING LIVE CONTROLS..." : "CHECK LIVE PROTECTION"}</button>
      </div>
    </section>
  </InternalPage>;
}

function ResponsePosturePage({ autoDefense, setAutoDefense }) {
  return <InternalPage title="Response posture" eyebrow="Automated defence core / containment controls">
    <section className="panel p-4">
      <div className="split"><div><p className="text-xs text-slate/75">High-confidence events are contained at IP, session, and system levels.</p></div><label className="row cursor-pointer border border-electric/20 bg-electric/5 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-cyan"><input type="checkbox" checked={autoDefense} onChange={(event) => setAutoDefense(event.target.checked)} className="h-4 w-4 accent-electric" /> Autonomous defence</label></div>
      <div className="compact-grid mt-4"><div className="stack gap-2 border-l border-electric/30 pl-3"><Activity size={16} className="text-electric" /><div className="font-mono text-xs font-bold text-white">IP-level mitigation</div><div className="text-xs text-slate/70">Block traffic and rate-limit at WAF.</div></div><div className="stack gap-2 border-l border-electric/30 pl-3"><UserRoundCog size={16} className="text-electric" /><div className="font-mono text-xs font-bold text-white">Session-level mitigation</div><div className="text-xs text-slate/70">Isolate user and force step-up MFA.</div></div><div className="stack gap-2 border-l border-electric/30 pl-3"><Database size={16} className="text-electric" /><div className="font-mono text-xs font-bold text-white">System-level actions</div><div className="text-xs text-slate/70">SIEM event and compliance audit log.</div></div></div>
    </section>
  </InternalPage>;
}

function App() {
  const [active, setActive] = React.useState("Dashboard");
  const [commandOpen, setCommandOpen] = React.useState(false);
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
  React.useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
      if (event.key === "Escape") setCommandOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
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
    <div className="console-shell">
      <header className="console-header px-4 md:px-6">
        <div className="header-stack">
          <div className="row justify-center">
            <ShieldCheck size={18} className="text-electric" />
            <div className="brand-label text-sm font-semibold tracking-tight text-white">AI-ATTACKS DEFENDER CONSOLE</div>
          </div>
          <button className="command-bar" onClick={() => setCommandOpen(true)} aria-label="Open command palette"><TerminalSquare size={14} /> <span className="command-label">Run command...</span><kbd>⌘K</kbd></button>
        </div>
        <div className="header-status row hidden font-mono text-[10px] uppercase tracking-widest text-slate md:flex"><span className="status-dot" /> Protected zones operational <button className="border-0 bg-transparent p-1 text-slate hover:text-white" aria-label="Notifications"><Siren size={16} /></button></div>
      </header>

      <div className="console-body">
      <nav className="console-sidebar p-4">
        <div className="eyebrow px-2">Command navigation</div>
        <div className="stack gap-1">
        {["Dashboard", "Agents", "Logs", "URL Protection", "Response Posture", "Settings"].map((item) => {
          const Icon = item === "Dashboard" ? LayoutDashboard : item === "Agents" ? UsersRound : item === "Logs" ? ScrollText : item === "URL Protection" ? Link2 : item === "Response Posture" ? Activity : Settings;
          return <button key={item} onClick={() => setActive(item)} className={`row w-full border-0 px-2 py-2 text-left font-mono text-[10px] uppercase tracking-widest ${active === item ? "bg-electric/10 text-cyan" : "bg-transparent text-slate/70 hover:bg-white/[.04] hover:text-white"}`}><Icon size={15} /><span>{item}</span></button>;
        })}
        </div>
        <div className="mt-auto hidden border-t border-slate/20 pt-4 md:block"><div className="eyebrow">Fabric status</div><div className="row mt-2 text-xs font-semibold text-white"><span className="status-dot" />Operational</div><div className="mt-2 font-mono text-[9px] text-slate/50">3 zones · 248 agents</div></div>
      </nav>
      <main className="content-stage">
      <div className="content-wrap">
        {active === "Dashboard" ? <>
        <section className="dashboard-heading split mb-4 border-b border-slate/20 pb-3">
          <div><div className="eyebrow">Operations / overview</div><h1 className="mt-1 text-xl font-semibold text-white">Security posture</h1></div>
          <div className="row font-mono text-[10px] uppercase tracking-widest text-cyan"><span className="status-dot" /> Defense fabric online</div>
        </section>

        <div className="compact-grid">
          <section className="panel stack p-4">
            <div className="split"><div className="eyebrow">Threat assessment</div><span className="status-dot" /></div>
            <div className="row"><Vault size={18} className="text-electric" /><span className="font-mono text-lg font-semibold tracking-widest text-cyan">SAFE</span><span className="text-xs text-slate">System protected · 99.98% uptime</span></div>
            <div className="row pt-2"><Metric label="Blocked" value="1.2M" icon={ShieldCheck} /><Metric label="Agents" value="248" icon={Bot} /><Metric label="Risk" value="0.08" icon={Radar} /></div>
          </section>

          <section className="panel flex min-h-[300px] flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-slate/20 bg-electric/5 px-6 py-4"><h2 className="flex items-center gap-2 font-semibold tracking-tight text-white"><TerminalSquare size={18} className="text-electric" /> Live intercepts</h2><span className="rounded-full border border-electric/20 bg-electric/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-cyan">Intercepting</span></div>
            <div className="flex-1 divide-y divide-electric/10 overflow-auto">
              {incidents.map((incident) => <article key={incident.time} className="p-4 transition hover:bg-electric/[.03]"><div className="flex items-center justify-between gap-3"><span className="font-mono text-[11px] text-slate/70">{incident.time}</span><Severity value={incident.severity} /></div><div className="mt-2 flex gap-3"><AlertTriangle size={16} className="mt-0.5 shrink-0 text-electric" /><div className="min-w-0"><div className="font-mono text-xs font-bold text-cyan">{incident.type}</div><div className="mt-1 font-mono text-[11px] text-slate/70">ORIGIN: {incident.source} · AGENT: {incident.agent}</div><p className="mt-2 text-xs text-slate/80">{incident.detail}</p></div></div></article>)}
            </div>
            <div className="flex items-center justify-between border-t border-slate/20 bg-ink/40 px-5 py-3"><span className="font-mono text-[10px] uppercase tracking-widest text-slate/70">3 events in retention window</span><button className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest text-cyan transition-all duration-200 ease-in-out hover:text-white"><ArrowDownToLine size={14} /> Export JSON</button></div>
          </section>
        </div>

        <section className="compact-grid">
          {[["PUBLIC INTERNET & DMZ", Globe2, "IP capture · Geo/reputation · WAF / DDoS"], ["SECURE APPLICATION ZONE", Database, "API gateways · Transaction feeds · Session analytics"], ["CORE FINANCIAL ZONE", LockKeyhole, "Isolated services · SIEM compliance · Containment"]].map(([title, Icon, text]) => <div className="panel p-6" key={title}><div className="flex items-start gap-4"><div className="rounded-xl bg-electric/10 p-3 text-electric"><Icon size={20} /></div><div><div className="font-mono text-[10px] font-bold tracking-widest text-cyan">{title}</div><div className="mt-2 text-xs leading-5 text-slate/75">{text}</div></div></div><div className="mt-6 h-1 overflow-hidden rounded bg-panel2"><div className="h-full w-[96%] rounded bg-electric shadow-glow" /></div><div className="mt-2 flex justify-between font-mono text-[10px] text-slate/60"><span>HEALTHY</span><span>96%</span></div></div>)}
        </section>

        </> : active === "Agents" ? <AgentsPage /> : active === "Logs" ? <LogsPage /> : active === "URL Protection" ? <UrlProtectionPage configuredUrls={configuredUrls} urlInput={urlInput} setUrlInput={setUrlInput} addUrl={addUrl} liveProtection={liveProtection} checkProtection={checkProtection} checkingProtection={checkingProtection} /> : active === "Response Posture" ? <ResponsePosturePage autoDefense={autoDefense} setAutoDefense={setAutoDefense} /> : <SettingsPage autoDefense={autoDefense} setAutoDefense={setAutoDefense} configuredUrls={configuredUrls} />}
      </div>
      </main>
      </div>
      {commandOpen && <div className="command-overlay" onClick={() => setCommandOpen(false)}>
        <div className="command-menu" onClick={(event) => event.stopPropagation()}>
          <div className="split border-b border-slate/20 p-3"><span className="mono text-xs text-white">Command palette</span><kbd className="mono text-[10px] text-slate">ESC</kbd></div>
          <div className="stack gap-0 p-2">
            {["Dashboard", "Agents", "Logs", "URL Protection", "Response Posture", "Settings"].map((item) => <button key={item} onClick={() => { setActive(item); setCommandOpen(false); }} className="row border-0 bg-transparent px-3 py-3 text-left text-sm text-slate hover:bg-electric/10 hover:text-white"><span className="mono w-20 text-[10px] text-slate/60">GO TO</span>{item}</button>)}
          </div>
        </div>
      </div>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
