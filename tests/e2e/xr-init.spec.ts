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
        (navigator as any).xr = {
            isSessionSupported: () => Promise.resolve(true),
            requestSession: () => Promise.resolve({
                addEventListener: () => { },
                inputSources: []
            })
        };
    });

    await page.click('#enter-ar');
    // Expect status to change to Active
    await expect(page.locator('#status-text')).toHaveText('Active');
});
