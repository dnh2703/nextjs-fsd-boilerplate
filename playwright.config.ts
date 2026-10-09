import { defineConfig, devices } from "@playwright/test";

// Requires a running, migrated database: `bun run db:up && bun run db:migrate`.
// Port 3100 (not 3000) so E2E never reuses some other local dev server by accident.
const PORT = 3100;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `bun run build && PORT=${PORT} bun run start`,
    url: `http://localhost:${PORT}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
