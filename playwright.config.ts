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
    // projects: [
    //     {
    //         name: 'chromium',
    //         use: { ...devices['Desktop Chrome'] },
    //     },
    //     {
    //         name: 'firefox',
    //         use: { ...devices['Desktop Firefox'] },
    //     },
    //     {
    //         name: 'webkit',
    //         use: { ...devices['Desktop Safari'] },
    //     },
    //     {
    //         name: "Pixel 4",
    //         use: { browserName: 'chromium', ...devices }
    //     },
    //     {
    //         name: 'iPhone 11',
    //         use: { browserName: 'webkit', ...devices['iPhone 11'] },
    //     },
    // ],
};
export default config;