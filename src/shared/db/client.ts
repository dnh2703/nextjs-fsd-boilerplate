import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { getServerEnv } from "@/shared/config";

function createDb() {
  return drizzle(postgres(getServerEnv().DATABASE_URL));
}

export type Db = ReturnType<typeof createDb>;

const globalForDb = globalThis as typeof globalThis & { __db?: Db };

/** Creates the Drizzle client on first use and reuses it (also across dev hot reloads). */
export function getDb(): Db {
  globalForDb.__db ??= createDb();
  return globalForDb.__db;
}
