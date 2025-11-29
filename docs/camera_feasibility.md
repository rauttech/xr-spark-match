# Camera Feasibility & QR Scanning in WebXR

## Current State (Meta Quest Browser)

### Passthrough
- **Supported**: Yes, via `immersive-ar` session and `local-floor` reference space.
- **Mechanism**: The browser renders the camera feed *behind* the WebGL canvas (if `alpha: true`).
- **Limitation**: The WebGL context does **not** have access to the pixel data of the real world. You cannot "read" the camera feed from the canvas.

### Camera Access (getUserMedia)
- **2D Mode**: Fully supported. You can access the camera, display it in a `<video>` element, and process pixels (e.g., for QR scanning).
- **Immersive Mode**: **Restricted**. When entering an immersive WebXR session, `getUserMedia` streams usually stop or go black for privacy reasons. Meta does not currently allow raw camera access to web pages while in passthrough mode to prevent "spying" (recording user's room).

## Implications for "Spark Match"

1. **QR Scanning**:
   - **Cannot** be done continuously in the background while in AR mode.
   - **Solution**: The user must scan the QR code **before** entering the AR experience, or we must provide a UI button to "Scan New Connection" which temporarily exits AR (or opens a 2D overlay if supported) to perform the scan.

2. **AI / Computer Vision**:
   - Real-time analysis of the environment (e.g., identifying objects/people via CV) is **not possible** with standard WebXR on Quest today.
   - **Alternative**: Use "Spatial Anchors" or "Hit Test" API to interact with the world geometry, but not visual recognition.

## Recommendation for Hackathon

- **Workflow**:
  1. User opens app (2D mode).
  2. User taps "Scan Badge" -> Camera opens -> QR Scanned -> Profile Loaded.
  3. User taps "Enter AR" -> Profile cards float in 3D space.
- **Future**: If Meta enables the "Camera Access" feature policy for WebXR, we can integrate it. For now, separate the "Scanning" phase from the "Interaction" phase.
