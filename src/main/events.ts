/**
 * This plugin's contribution to `PluginEvents`. `zen link` picks up
 * `events: "./src/main/events.ts"` from `zenbu.plugin.json` and intersects
 * the `Events` type below with every other plugin's contribution into
 * `<app>/types/events.ts`. Renderer code reads the merged type via
 * `useEvents<PluginEvents>()`.
 */
export type Events = {
  ticker: {
    /** Emitted by `TickerService` once per second with the current count. */
    tick: { ts: number; count: number };
  };
};
