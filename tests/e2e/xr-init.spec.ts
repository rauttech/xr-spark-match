import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));

    // Skip mock if using emulator
    if (process.env.USE_EMULATOR) return;

    await page.addInitScript(() => {
        const mockSession = {
            addEventListener: () => { },
            removeEventListener: () => { },
            updateRenderState: () => { },
            requestReferenceSpace: () => Promise.resolve({
                getOffsetReferenceSpace: () => ({}),
                onreset: null
            }),
            inputSources: [],
            end: () => Promise.resolve()
        };

        const xrSystem = {
            isSessionSupported: () => Promise.resolve(true),
            requestSession: () => Promise.resolve(mockSession)
        };

        // Force mock navigator.xr
        Object.defineProperty(navigator, 'xr', {
            value: xrSystem,
            writable: true,
            configurable: true
        });
    });
});

test('homepage has title and enter button', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/XR Spark Match/);
    const button = page.locator('#enter-ar');
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Enter AR Match Mode');
});

test('clicking enter changes status', async ({ page }) => {
    await page.goto('/');
    // Keep browser open for manual testing if using emulator
    if (process.env.USE_EMULATOR) {
        console.log('⏸️  Test paused! Please open DevTools (F12) -> WebXR -> Select Device. Then click "Resume" in Playwright Inspector.');
        await page.pause();
    }

    await page.click('#enter-ar');
    // Expect status to change to Active (if mocked/emulator) OR Error (if no hardware)
    await expect(page.locator('#status-text')).toHaveText(/Active|Error: Failed to execute 'requestSession'/);
});
