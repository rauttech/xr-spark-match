# XR Spark Match Mode – MVP Presentation

---
## Slide 1 – Title & Agenda
- **Title:** XR Spark Match Mode – MVP Demo
- **One‑liner:** A mixed‑reality networking experience that lets professionals discover and match with each other in AR/VR.
- **Agenda:**
  1. Problem & Vision
  2. System Architecture
  3. Live Demo (features)
  4. Technical Highlights
  5. Next Steps & Q&A

---
## Slide 2 – Problem & Vision
- Traditional networking is limited to 2‑D screens.
- XR offers spatial, immersive connections – “Bumble for XR”.
- **MVP Goal:** Quick, intuitive matchmaking in a shared mixed‑reality space.

---
## Slide 3 – Architecture Overview
- **Tech Stack** (see `docs/ARCHITECTURE.md`):
  - WebXR + Three.js (rendering)
  - Vite (dev/build)
  - TypeScript (type safety)
  - Vitest + Playwright (testing)
- **Component Diagram** (Mermaid in `ARCHITECTURE.md`):
  - `XRSessionManager` – AR/VR session handling
  - `QRScanner` – QR‑code detection (jsQR)
  - `ProfileService` – Mock profile data (domain, experience, location)
  - `CardManager` + `CardUI` – Card creation & rendering
  - `GestureEngine` – Hand/controller gestures
  - `AudioManager` – Sound feedback

---
## Slide 4 – Feature Demo: QR Code Scanning
- **What to show:** Scan a printed or screen QR code.
- **Key points:**
  - Uses `jsQR` library.
  - Triggers profile fetch and card creation instantly.

---
## Slide 5 – Feature Demo: Profile Cards
- **What to show:** Newly spawned card with glass‑like background.
- **Displayed fields:** Name, Role, **Domain**, **Experience**, **Location**, Tags, Match Score.
- **UI polish:** Semi‑transparent background, improved typography, dynamic scaling on hover.

---
## Slide 6 – Feature Demo: Gesture Interaction
- **Hover:** Card highlights + hover sound (`playHoverSound`).
- **Grab & Move:** Drag cards around.
- **Swipe:** Fast hand swipe triggers swipe sound (`playSwipeSound`).

---
## Slide 7 – Feature Demo: Match Spark
- **What to show:** Bring two cards close → visual spark + match sound (`playMatchSound`).
- **Logic:** Proximity detection in `CardManager` with compatibility score display.

---
## Slide 8 – Feature Demo: Pass‑through AR
- **What to show:** Switch to AR mode on a Quest or AR‑capable phone.
- **Key points:**
  - `XRSessionManager` requests `immersive‑ar` first, falls back to `immersive‑vr`.
  - Renderer configured with `alpha:true` for real‑world view.

---
## Slide 9 – Testing & Reliability
- **Unit & E2E Tests:** `npm run test:unit` (all 5 tests pass).
- **Coverage:** Includes new profile fields and UI interactions.
- **Why it matters:** Demonstrates stability before hackathon deadline.

---
## Slide 10 – Technical Highlights
- **Match Criteria:** Added `domain`, `experienceLevel`, `location` to `Profile` & `MockProfiles`.
- **Audio Fallback:** Synthesized beep sounds if assets missing.
- **UI Polish:** Glass‑like card background, high‑resolution canvas, dynamic scaling.
- **AR Pass‑through:** Automatic fallback logic, transparent renderer.
- **Testing:** Vitest + Playwright, 100 % pass.

---
## Slide 11 – Open‑Source & Licensing
- **License:** MIT (`LICENSE`).
- **Author:** Deepak Raghunath Raut (metadata in `package.json` & `README.md`).

---
## Slide 12 – Roadmap
| Short‑term | Mid‑term | Long‑term |
|------------|----------|-----------|
| • Connect to real backend (REST/GraphQL) for live profiles.<br>• Add AI‑driven compatibility scoring. | • Multi‑user session via WebSockets.<br>• Persistence of matches (local DB or cloud). | • Full Unity/Native XR build for higher fidelity.<br>• Integration with professional networks (LinkedIn, etc.). |

---
## Slide 13 – Q&A
- Invite questions on architecture, scalability, or demo specifics.

---
*Prepared for the upcoming hackathon demo.*
