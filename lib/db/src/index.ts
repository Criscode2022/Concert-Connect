import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

type Database = ReturnType<typeof drizzle<typeof schema>>;

let pool: pg.Pool | undefined;
let dbInstance: Database | undefined;

function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL must be set. Add the Neon pooled connection string in Vercel project settings.",
    );
  }
  return url;
}

export function getDb(): Database {
  if (!dbInstance) {
    pool = new Pool({
      connectionString: requireDatabaseUrl(),
      max: 5,
    });
    dbInstance = drizzle(pool, { schema });
  }
  return dbInstance;
}

export const db = new Proxy({} as Database, {
  get(_target, prop) {
    const instance = getDb();
    const value = Reflect.get(instance, prop, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export { pool };
export * from "./schema";
