import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ZenbuProvider } from "@zenbujs/core/react"
import { App } from "./App"
import "./app.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ZenbuProvider
      fallback={<div style={{ padding: 32, opacity: 0.6 }}>Connecting…</div>}
      errorFallback={(error) => (
        <div style={{ padding: 32, color: "tomato" }}>Connection failed: {error}</div>
      )}
    >
      <App />
    </ZenbuProvider>
  </StrictMode>,
)
