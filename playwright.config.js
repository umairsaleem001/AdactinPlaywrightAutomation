import { defineConfig, devices } from '@playwright/test';
import process from 'node:process';

process.loadEnvFile();

const requiredEnv = name => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export default defineConfig({
  testDir: './tests',

  globalSetup: './Utilities/global-setup.js',
  globalTeardown: './Utilities/global-teardown.js',

  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 4,
  timeout: 60000,

  reporter: [
    ['list'],
    ['allure-playwright'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: requiredEnv('BASE_URL'),
    headless: true,
    trace: 'on-first-retry',
    navigationTimeout: 60000,
    storageState: 'State/state.json',
  },

  projects: [
    {
      name: 'setup',
      testDir: './State',
      testMatch: /auth\.setup\.js$/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: {
          cookies: [],
          origins: [],
        },
      },
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
      dependencies: ['setup'],
    },
    {
      name: 'edge',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'msedge',
      },
      dependencies: ['setup'],
    },
  ],
});