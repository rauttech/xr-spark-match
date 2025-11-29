# 🥽 Verification Guide: Testing on Meta Quest 3

Follow these steps to verify **XR Spark Match** live on your headset.

## ✅ Prerequisites

1.  **Developer Mode Enabled**:
    *   Open **Meta Horizon App** on phone > Menu > Devices > Headset Settings > Developer Mode > **ON**.
2.  **Same Wi-Fi Network**:
    *   Ensure your **Computer** and **Quest 3** are connected to the **exact same Wi-Fi network**.

## 🚀 Step 1: Start the Local Server

On your computer, run:

```bash
npm run dev
```

*   You may be prompted for your **sudo password** (to generate SSL certs).
*   Look for the **Network URL** in the output. It will look like:
    > `➜  Network:   https://192.168.1.5:5173/`

## 🌐 Step 2: Open in Meta Quest Browser

1.  Put on your **Meta Quest 3**.
2.  Open **Meta Quest Browser**.
3.  Type the **Network URL** from Step 1 into the browser's address bar exactly (including `https://`).
    *   *Tip: You can copy the link on your computer and use the Meta Horizon app to "Share to Headset" if typing is difficult.*

## 🔒 Step 3: Handle Security Warnings

Since we are using a self-signed certificate for local development:
1.  You will likely see a warning: **"Your connection is not private"**.
2.  Click **Advanced**.
3.  Click **Proceed to [IP Address] (unsafe)**.

## 📸 Step 4: Grant Permissions (CRITICAL)

1.  **Camera Permission**:
    *   The browser should ask: *"Allow [URL] to use your camera?"*
    *   **CLICK ALLOW**.
    *   *If you deny this, QR scanning will not work.*
2.  **XR Session**:
    *   Click the blue **"Start AR Session"** button on the page.
    *   If prompted to "Enter Immersive Mode" or allow "VR/AR", confirm it.

## 🧪 Step 5: Verify Functionality

1.  **Passthrough Check**:
    *   You should see your physical room (Passthrough) with digital elements overlayed.
    *   The background should **NOT** be black.
2.  **QR Scanning**:
    *   Hold a QR code (use the one in `public/qr-codes.html` or any text QR code) about **30-50cm** in front of your face.
    *   Ensure the room is **well-lit**.
    *   **Success**: A floating 3D card should appear displaying the QR code's text.

## ❓ Troubleshooting

**"I see a black screen instead of my room"**
*   Check `chrome://flags` in the Quest Browser and ensure **WebXR Incubations** is enabled.
*   Ensure you are in "Immersive AR" mode, not VR.

**"The camera isn't scanning"**
*   Check permissions: Click the **Lock Icon (🔒)** in the URL bar > **Permissions** > **Reset Permissions**. Reload and Allow Camera.
*   Ensure you are using the **Back Camera** (the code automatically selects `facingMode: 'environment'`).

**"I can't connect to the server"**
*   Check your computer's firewall. You may need to allow Node.js/Vite to accept incoming connections.
*   Verify both devices are on the same Wi-Fi (e.g., not one on Guest and one on Main).
