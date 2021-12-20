import { PlaywrightTestConfig, devices } from '@playwright/test';
const config: PlaywrightTestConfig = {
    use: {
        headless: false,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        launchOptions: {
            slowMo: 500
        }
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'], browserName: 'chromium' },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'], browserName: 'firefox' },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Webkit'], browserName: 'webkit' },
        },
        // {
        //     name: "Pixel 4",
        //     use: { browserName: 'chromium', ...devices }
        // },
        // {
        //     name: 'iPhone 11',
        //     use: { browserName: 'webkit', ...devices['iPhone 11'] },
        // },
    ],
};
export default config;