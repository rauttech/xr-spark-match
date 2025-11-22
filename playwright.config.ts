import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'https://localhost:3000',
        trace: 'on-first-retry',
        ignoreHTTPSErrors: true,
        headless: process.env.USE_EMULATOR ? false : true,
        launchOptions: process.env.USE_EMULATOR ? {
            devtools: true,
            args: [
                `--disable-extensions-except=/Users/deepakraut/Library/Application Support/Google/Chrome/Default/Extensions/cgffilbpcibhmcfbgggfhfolhkfbhmik/1.5.0_0`,
                `--load-extension=/Users/deepakraut/Library/Application Support/Google/Chrome/Default/Extensions/cgffilbpcibhmcfbgggfhfolhkfbhmik/1.5.0_0`,
                '--enable-features=WebXR,OpenXR'
            ]
        } : undefined,
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: {
        command: 'npm run dev',
        url: 'https://localhost:3000',
        reuseExistingServer: !process.env.CI,
        ignoreHTTPSErrors: true,
    },
});
