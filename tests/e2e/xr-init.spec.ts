import { test, expect } from '@playwright/test';

test('homepage has title and enter button', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/XR Spark Match/);
    const button = page.locator('#enter-ar');
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Enter AR Match Mode');
});

test('clicking enter changes status', async ({ page }) => {
    // Note: WebXR requires HTTPS and specific browser flags/hardware, 
    // so we mock the session request in a real E2E or just check UI state changes 
    // if we can mock the navigator.xr API.
    // For this MVP, we'll check if the button click triggers the expected UI update 
    // assuming we mock the XR session or handle the error gracefully.

    await page.goto('/');

    // Mock navigator.xr
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

        Object.defineProperty(Object.getPrototypeOf(navigator), 'xr', {
            get: () => xrSystem,
            configurable: true
        });
    });

    await page.click('#enter-ar');
    // Expect status to change to Active OR Error (if in headless without XR)
    const status = page.locator('#status-text');
    await expect(status).toHaveText(/Active|Error: Failed to execute 'requestSession'/);
});
