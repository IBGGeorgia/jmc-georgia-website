import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 50_000,
  expect: {timeout: 10_000},
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', {open: 'never', outputFolder: 'playwright-report'}]],
  outputDir: 'test-results',
  use: {
    baseURL: process.env.QA_BASE_URL || 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ...devices['Desktop Chrome'],
  },
  webServer: process.env.QA_BASE_URL ? undefined : {
    command: 'npm run start -- -p 3000 -H 127.0.0.1',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
