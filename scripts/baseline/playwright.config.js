import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './test/specs', testMatch: '**/*.{e2e,spec,test}.{js,ts}',
  fullyParallel: false, workers: 1, retries: 0, timeout: 20000,
  expect: { timeout: 5000 }, reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4174', browserName: 'chromium',
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure', screenshot: 'only-on-failure', actionTimeout: 5000 },
  projects: [{ name: 'desktop-chromium' }],
  webServer: {
    command: 'npm --prefix ../demo-bank-app run dev -- --hostname 127.0.0.1 --port 4174',
    url: 'http://127.0.0.1:4174/api/bank',
    reuseExistingServer: !process.env.CI, timeout: 120000,
  },
});
