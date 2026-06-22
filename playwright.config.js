import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.OQUWAY_E2E_PORT || 4173);
const baseURL = process.env.OQUWAY_E2E_BASE_URL || "http://127.0.0.1:" + port;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: baseURL,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "off"
  },
  webServer: process.env.OQUWAY_E2E_BASE_URL ? undefined : {
    command: "node tests/fixtures/staticServer.js",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 15000,
    env: {
      OQUWAY_E2E_PORT: String(port)
    }
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] }
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] }
    }
  ]
});
