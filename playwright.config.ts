import { PlaywrightTestConfig, devices } from '@playwright/test';
const config: PlaywrightTestConfig = {
    use: {
        headless: false,
        ignoreHTTPSErrors: true,
        launchOptions: {
            slowMo: 500
        }
    },
    projects: [
        {
            name: 'iPhone SE',
            use: { ...devices['iPhone SE'], browserName: 'chromium', isMobile: true }
        },
        {
            name: 'iPad',
            use: { ...devices['iPad (gen 7)'], browserName: 'chromium', isMobile: true }
        },
        {
            name: 'Android',
            use: { browserName: 'chromium', viewport: { width: 1080, height: 1920 } }
        },
        {
            name: 'Mobile (375x667)',
            use: { ...devices['iPhone 7'], browserName: 'chromium', isMobile: true }
        },
        {
            name: 'Mobile (414x736)',
            use: { ...devices['iPhone 8 Plus'], browserName: 'chromium', isMobile: true }
        },
        {
            name: 'Mobile (414x896)',
            use: { ...devices['iPhone XR'], browserName: 'chromium', isMobile: true }
        },
        {
            name: 'Desktop Chrome',
            use: { ...devices['Desktop Chrome'], browserName: 'chromium' },
        },
        {
            name: 'Desktop Firefox',
            use: { ...devices['Desktop Firefox'], browserName: 'firefox' },
        },
        {
            name: 'Desktop Safari',
            use: { ...devices['Desktop Webkit'], browserName: 'webkit' },
        },
        {
            name: "Desktop Edge",
            use: { ...devices['Desktop Edge'], browserName: 'chromium' },
        }
    ],
};
export default config;