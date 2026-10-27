import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  // Todo test:e2e testa o build atual: gera out/ e serve como o GitHub Pages faria.
  webServer: {
    command: `npm run build && npx serve out -l ${PORT} --config ../serve.json`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: false,
    timeout: 300_000,
  },
});
