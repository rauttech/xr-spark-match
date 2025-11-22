# WebXR Emulator Setup Guide

To test WebXR features (like hand tracking and AR sessions) on your desktop browser without a headset, use the **WebXR API Emulator** extension.

## Installation Steps

1. **Open Chrome/Edge**.
2. Go to the **Chrome Web Store**: [WebXR API Emulator](https://chrome.google.com/webstore/detail/webxr-api-emulator/mjddjgeghkdijejnciaefnkjmkafnnje).
3. Click **Add to Chrome**.

## How to Use

1. **Open the DevTools** (F12 or Right-click -> Inspect).
2. Look for the **"WebXR"** tab in the DevTools panel (you might need to click `>>` to see more tabs).
3. **Select a Device**: Choose "Meta Quest 2" or "Samsung Galaxy S8 (AR)" from the list.
4. **Enter AR/VR**:
   - Go to your app (e.g., `https://localhost:3000`).
   - Click "Enter AR Match Mode".
   - The emulator will intercept the request and start a virtual session.
5. **Interact**:
   - Use the on-screen controls to move the headset and controllers.
   - You can simulate controller inputs (trigger, grip) to test interactions.

## Running Tests with Emulator

We have configured a special command to run E2E tests using your installed **Immersive Web Emulator**:

```bash
npm run test:emulator
```

This will:
1. Launch Chrome in **headed mode** (visible UI).
2. Load the **Immersive Web Emulator** extension automatically.
3. Run the tests against the emulator instead of mocking the API.

> **Note**: This requires the extension to be installed at `/Users/deepakraut/Library/Application Support/Google/Chrome/Default/Extensions/cgffilbpcibhmcfbgggfhfolhkfbhmik/1.5.0_0`. If you update the extension, you may need to update the path in `playwright.config.ts`.
