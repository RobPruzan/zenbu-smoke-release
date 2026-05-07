import { defineDbConfig } from "@zenbujs/core/db";

export default defineDbConfig({
  schema: "./src/main/schema.ts",
  out: "./db",
});
