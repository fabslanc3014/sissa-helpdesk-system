import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.ts";

const DEFAULT_CONN_STRING = "postgresql://neondb_owner:npg_NTDjCX32SaxB@ep-snowy-glade-aob66f1i.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const connectionString = process.env.DATABASE_URL || DEFAULT_CONN_STRING;

const parseConnectionString = (url: string) => {
  try {
    const matches = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^/:]+)(?::(\d+))?\/([^?]+)/);
    if (!matches) {
      return {
        connectionString: url,
        ssl: { rejectUnauthorized: false }
      };
    }
    const [_, username, password, host, port, database] = matches;
    return {
      user: username,
      password,
      host,
      port: port ? parseInt(port, 10) : 5432,
      database,
      ssl: { rejectUnauthorized: false }
    };
  } catch (e) {
    return {
      connectionString: url,
      ssl: { rejectUnauthorized: false }
    };
  }
};

const poolConfig = parseConnectionString(connectionString);

export const pool = new pg.Pool(poolConfig);

pool.on("error", (err) => {
  console.error("Unexpected error on idle SQL pool client:", err);
});

export const db = drizzle(pool, { schema });
