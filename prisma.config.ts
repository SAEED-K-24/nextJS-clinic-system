import { defineConfig } from "prisma/config";

try {
  // Load .env.local for Prisma CLI in Next.js projects
  const { config } = await import("dotenv");
  config({ path: ".env.local" });
} catch {}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
