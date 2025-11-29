# XR Spark Match - Meta Quest 3 WebXR

This project is a WebXR application designed for Meta Quest 3, utilizing the Immersive Web SDK for Passthrough and Camera Access features.

## Features

- **WebXR Session**: Immersive AR session with local floor reference space.
- **Passthrough**: Real-world background visibility using the Immersive Web SDK.
- **QR Scanning**: Camera access to scan QR codes and display profile cards.
- **3D UI**: Floating profile cards with interaction support.

## Prerequisites

- Node.js (v20+)
- Meta Quest 3 Headset
- Meta Quest Developer Hub (optional, for debugging)

## Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```

## Development

To start the local development server with SSL support (required for WebXR):

```bash
npm run dev
```

This will start a Vite server. Ensure your computer and Quest 3 are on the same Wi-Fi network. Access the URL displayed in the terminal (e.g., `https://192.168.1.x:5173`) from the Meta Quest Browser.

**Note:** You may need to accept the self-signed certificate warning in the browser.

## Build

To build the project for production:

```bash
npm run build
```

The output will be in the `dist` folder.

## Deployment to Meta Quest

1.  **HTTPS Hosting**: The easiest way is to deploy the `dist` folder to a static host like GitHub Pages, Vercel, or Netlify. Ensure the site is served over HTTPS.
2.  **Meta Quest Browser**: Open the deployed URL in the Meta Quest Browser.
## Meta Quest 3 Device Setup & Settings

To ensure all features (AR, Passthrough, Camera/QR) work correctly, follow these specific settings on your headset:

### 1. Enable Developer Mode
*   Open the **Meta Horizon** app on your phone.
*   Go to **Menu** > **Devices** > Select your Headset.
*   Tap **Headset Settings** > **Developer Mode** > Toggle **On**.
*   Restart your headset.

### 2. Browser Permissions (Critical for QR Scanning)
The Meta Quest Browser needs explicit permission to access the camera.
*   **On First Launch**: When you open the app, you should see a popup: *"Allow [URL] to use your camera?"* -> Click **Allow**.
*   **If you missed the popup / denied it**:
    1.  Put on your headset.
    2.  Go to **Settings** (System Settings).
    3.  Select **Apps** > **Installed Apps**.
    4.  Find **Meta Quest Browser** in the list.
    5.  Select **Permissions**.
    6.  Toggle **Camera** to **ON**.
    7.  Toggle **Spatial Data** to **ON** (if available, for better AR stability).

### 3. WebXR Flags (Optional / Troubleshooting)
If AR mode doesn't start or passthrough is black:
1.  Open Meta Quest Browser.
2.  Type `chrome://flags` in the address bar.
3.  Search for **"WebXR"**.
4.  Ensure **WebXR Incubations** is **Enabled**.
5.  Restart the browser.

### 4. Clear Site Permissions
If you are stuck in a "Denied" state:
1.  In Meta Quest Browser, click the **Lock Icon** (🔒) next to the URL bar.
2.  Click **Permissions**.
3.  Click **Reset Permissions** for this site.
4.  Reload the page and click **Allow** when prompted.

## QR Scanning Best Practices

To ensure optimal QR code scanning on Meta Quest 3:

1.  **Lighting**: Ensure the physical QR code is well-lit. Avoid shadows or glare on the code.
2.  **Distance**: Hold the QR code at a comfortable distance (30-50cm) from the headset.
3.  **Permissions**: Verify that "Browser Camera Access" is enabled in the Quest settings (Settings > Apps > Permissions > Camera).
4.  **Contrast**: Use high-contrast QR codes (black on white) for best results.

## Important Note on Immersive Web SDK

This project uses a mock implementation of the Immersive Web SDK (`@iwsdk/core`) for build purposes.
**To run on device with full functionality:**
1.  Ensure you have the correct `@iwsdk/core` package installed or available in your environment.
2.  Remove the alias in `vite.config.js` if you have the actual package installed.
3.  If you are using a scaffolded project structure from `npm create @iwsdk@latest`, ensure the imports in `src/xr/passthrough.ts` and `src/xr/camera.ts` match your project's SDK location.

## Project Structure

- `src/main.ts`: Entry point.
- `src/xr/xr-session.ts`: Manages WebXR session.
- `src/xr/passthrough.ts`: Handles Passthrough layer.
- `src/xr/camera.ts`: Manages Camera access.
- `src/xr/qr-scanner.ts`: QR code scanning logic.
- `src/xr/ui.ts`: 3D UI elements.
