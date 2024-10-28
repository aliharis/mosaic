import { defineConfig } from "drizzle-kit";

console.log(process.env.DATABASE_URL);

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  schema: "./src/db/schema.ts",
});
