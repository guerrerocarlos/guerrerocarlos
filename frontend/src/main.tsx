import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  ArrowUpRight,
  Clock3,
  Code2,
  Globe2,
  RefreshCw,
  Send,
  Server
} from "lucide-react";
import "./styles.css";

type ApiResult = {
  endpoint: string;
  status: number;
  payload: unknown;
};

const apiUrl = (path: string) => new URL(path, window.location.href).toString();

const fetchJson = async (path: string, init?: RequestInit): Promise<ApiResult> => {
  const response = await fetch(apiUrl(path), {
    ...init,
    headers: {
      accept: "application/json",
      ...(init?.headers ?? {})
    }
  });
  const text = await response.text();
  let payload: unknown = text;
  try {
    payload = JSON.parse(text);
  } catch {}
  return {
    endpoint: path,
    status: response.status,
    payload
  };
};

function App() {
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const commands = useMemo(
    () => [
      {
        id: "profile",
        label: "Profile",
        icon: Code2,
        run: () => fetchJson("api/profile")
      },
      {
        id: "projects",
        label: "Projects",
        icon: Globe2,
        run: () => fetchJson("api/projects")
      },
      {
        id: "health",
        label: "Health",
        icon: Activity,
        run: () => fetchJson("api/health")
      },
      {
        id: "message",
        label: "Message",
        icon: Send,
        run: () =>
          fetchJson("api/message", {
            method: "POST",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify({
              message: "Root app deployed from guerrerocarlos/guerrerocarlos",
              path: window.location.pathname
            })
          })
      }
    ],
    []
  );

  const runCommand = async (command: (typeof commands)[number]) => {
    setLoading(command.id);
    setError(null);
    try {
      setResult(await command.run());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request failed.");
    } finally {
      setLoading(null);
    }
  };

  useEffect(() => {
    void runCommand(commands[0]);
  }, [commands]);

  return (
    <main className="shell">
      <section className="identity">
        <div className="portrait" aria-hidden="true">
          <span>CG</span>
          <div className="mesh">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <div>
          <p className="eyebrow">Root W7S app</p>
          <h1>Carlos Guerrero</h1>
          <p className="lede">
            Same-name repository deploy test for serving an app directly from the organization host.
          </p>
        </div>
        <div className="links" aria-label="Quick links">
          <a href="https://github.com/guerrerocarlos/guerrerocarlos">
            <Code2 size={16} />
            Repository
            <ArrowUpRight size={14} />
          </a>
          <a href="https://w7s.cloud">
            <Server size={16} />
            W7S
            <ArrowUpRight size={14} />
          </a>
        </div>
      </section>

      <section className="panel" aria-label="Backend console">
        <div className="panelHeader">
          <div>
            <p className="eyebrow">Hono backend</p>
            <h2>Live API console</h2>
          </div>
          <div className="clock">
            <Clock3 size={15} />
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        <div className="toolbar">
          {commands.map((command) => {
            const Icon = command.icon;
            const busy = loading === command.id;
            return (
              <button
                key={command.id}
                type="button"
                onClick={() => void runCommand(command)}
                disabled={Boolean(loading)}
              >
                {busy ? <RefreshCw className="spin" size={16} /> : <Icon size={16} />}
                <span>{command.label}</span>
              </button>
            );
          })}
        </div>

        <div className="responseMeta">
          <span>{result?.endpoint ?? "api/profile"}</span>
          <strong>{loading ? "loading" : error ? "error" : result ? result.status : "idle"}</strong>
        </div>
        <pre>{error ?? JSON.stringify(result?.payload ?? { status: "Waiting for API response..." }, null, 2)}</pre>
      </section>
    </main>
  );
}

createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
