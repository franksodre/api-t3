import { env } from "@env";
import { config } from "dotenv";
import { Config, defineConfig } from "drizzle-kit";

config({ path: ".env" });

export default defineConfig({
  schema: "./src/db/schemas/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URI!,
  },
}) satisfies Config
