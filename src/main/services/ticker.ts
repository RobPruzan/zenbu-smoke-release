import { runtime, serviceWithDeps } from "@zenbujs/core/runtime";
import { DbService, RpcService } from "@zenbujs/core/services";

const MAX_TICK_HISTORY = 20;
const INTERVAL_MS = 1000;

export class TickerService extends serviceWithDeps({
  db: DbService,
  rpc: RpcService,
}) {
  static key = "ticker";

  async tick() {
    const ts = Date.now();
    const { db, rpc } = this.ctx;

    let nextCount = 0;
    await db.client.update((root) => {
      const section = root.plugin.app;
      nextCount = (section.count ?? 0) + 1;
      section.count = nextCount;
      const next = [...section.ticks, { ts, count: nextCount }];
      section.ticks =
        next.length > MAX_TICK_HISTORY
          ? next.slice(next.length - MAX_TICK_HISTORY)
          : next;
    });

    rpc.emit.ticker.tick({ ts, count: nextCount });
    return { count: nextCount };
  }
  evaluate() {
    this.setup("interval", () => {
      const handle = setInterval(() => {
        void this.tick();
      }, INTERVAL_MS);
      return () => clearInterval(handle);
    });
  }

  /** RPC: zero the counter and clear history. */
  async reset(): Promise<void> {
    await this.ctx.db.client.update((root) => {
      root.plugin.app.count = 0;
      root.plugin.app.ticks = [];
    });
  }

  /** RPC: cheap read of the current count without subscribing. */
  async getCount(): Promise<number> {
    return this.ctx.db.client.readRoot().plugin.app.count;
  }
}

runtime.register(TickerService, import.meta);
// touched at Thu May  7 07:58:06 PDT 2026
