import { useEffect, useState } from "react";
import { useDb, useRpc, useEvents } from "@zenbujs/core/react";

function Titlebar() {
  return (
    <div
      style={{
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 12px 0 72px",
        // @ts-expect-error webkit property
        WebkitAppRegion: "drag",
        flexShrink: 0,
      }}
    />
  );
}

function Counter() {
  const count = useDb((root) => root.plugin.app.count ?? 0);
  return (
    <section style={{ marginTop: 16 }}>
      <h2 style={{ margin: "0 0 4px 0" }}>Counter (DB)</h2>
      <div style={{ fontSize: 48, fontVariantNumeric: "tabular-nums" }}>
        {count}
      </div>
      <small style={{ opacity: 0.6 }}>
        Persisted to the local DB; survives reloads.
      </small>
    </section>
  );
}

function History() {
  const ticks = useDb((root) => root.plugin.app.ticks ?? []);
  return (
    <section style={{ marginTop: 24 }}>
      <h2 style={{ margin: "0 0 4px 0" }}>Recent ticks (DB)</h2>
      <ol
        style={{
          maxHeight: 220,
          overflow: "auto",
          margin: 0,
          paddingLeft: 20,
          fontFamily: "ui-monospace, Menlo, monospace",
          fontSize: 12,
        }}
      >
        {ticks
          .slice()
          .reverse()
          .map((t) => (
            <li key={`${t.ts}-${t.count}`}>
              #{t.count.toString().padStart(4, "0")} ·{" "}
              {new Date(t.ts).toLocaleTimeString()}
            </li>
          ))}
      </ol>
    </section>
  );
}

function LiveEventsFeed() {
  const events = useEvents();
  const [recent, setRecent] = useState<Array<{ ts: number; count: number }>>(
    [],
  );

  useEffect(() => {
    return events.ticker.tick.subscribe((data) => {
      setRecent((prev) => [data, ...prev].slice(0, 5));
    });
  }, [events]);

  return (
    <section style={{ marginTop: 24 }}>
      <h2 style={{ margin: "0 0 4px 0" }}>
        Live tick events (RPC events channel)
      </h2>
      <ul
        style={{
          margin: 0,
          paddingLeft: 20,
          fontFamily: "ui-monospace, Menlo, monospace",
          fontSize: 12,
        }}
      >
        {recent.map((t) => (
          <li key={`${t.ts}-${t.count}`}>
            tick #{t.count} · {new Date(t.ts).toISOString().slice(11, 23)}
          </li>
        ))}
        {recent.length === 0 && <li style={{ opacity: 0.4 }}>(waiting…)</li>}
      </ul>
    </section>
  );
}

function Controls() {
  const rpc = useRpc();
  const [busy, setBusy] = useState(false);

  return (
    <section style={{ marginTop: 24, display: "flex", gap: 8 }}>
      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await rpc.ticker.reset();
          } finally {
            setBusy(false);
          }
        }}
      >
        Reset
      </button>
      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            const { count } = await rpc.ticker.tick();
            console.log(count);
          } finally {
            setBusy(false);
          }
        }}
      >
        Tick now
      </button>
    </section>
  );
}

export function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        color: "var(--foreground, #e5e5e5)",
      }}
    >
      <Titlebar />
      <main
        style={{
          flex: 1,
          padding: "0 32px 32px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <h1>Zenbu smoke</h1>
        <p style={{ color: "var(--muted-foreground, #999)", marginTop: 8 }}>
          Demoing typed DB · RPC events · RPC calls. Edit{" "}
          <code>src/renderer/App.tsx</code>.
        </p>
        <Counter />
        <History />
        <LiveEventsFeed />
        <Controls />
      </main>
    </div>
  );
}
