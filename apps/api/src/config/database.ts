import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { schemaWithRelations } from "../db/schema";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema: schemaWithRelations });