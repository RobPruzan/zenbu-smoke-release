import {
  /**
   * this should be a peer dep and internally we require a range
   */
  z,
  createSchema,
  type InferSchema,
  type InferRoot,
} from "@zenbujs/core/db";

export const schema = createSchema({
  count: z.number().default(0),
  ticks: z
    .array(z.object({ ts: z.number(), count: z.number() }))
    .default([]),
});

export type AppSchema = InferSchema<typeof schema>;
export type SchemaRoot = InferRoot<AppSchema>;
