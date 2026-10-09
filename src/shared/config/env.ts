import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z
    .string({ error: "DATABASE_URL is required" })
    .regex(/^postgres(ql)?:\/\//, "DATABASE_URL must be a postgres:// connection string"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Validates server-side env vars. Called lazily (on first DB access), never at import
 * time, so `next build` works without a database configured.
 */
export function getServerEnv(source: Record<string, string | undefined> = process.env): ServerEnv {
  const result = serverEnvSchema.safeParse(source);
  if (!result.success) {
    const details = result.error.issues.map((issue) => issue.message).join("; ");
    throw new Error(`Invalid server environment: ${details}. Copy .env.example to .env.local.`);
  }
  return result.data;
}
