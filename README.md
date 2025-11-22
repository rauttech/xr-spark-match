# XR Spark Match Mode

WebXR MVP for floating profile cards and gesture-based matching.

## Features
- **Floating Cards**: 3-7 profile cards floating around the user.
- **Hand Gestures**: AirTap, Pinch, Swipe (simulated).
- **Spark Effect**: Visual feedback for high compatibility.
- **Zone Awareness**: Dynamic updates based on user position.

## Architecture

```mermaid
flowchart TB
  subgraph Browser
    A[Main (index.html)]
    B[main.ts]
    C[Scene Manager]
    D[XR Session (WebXR)]
    E[Three.js Renderer]
    F[UI Overlays / HUD]
    G[Gesture Engine]
    H[Card Manager]
    I[Spark Manager]
    J[Match Engine (mock)]
    K[Zone State]
  end
  subgraph DevOps
    L[Vite Dev Server (HTTPS)]
    M[Vitest Unit Tests]
    N[Playwright E2E Tests]
    O[Husky + lint-staged]
    P[GitHub Repo + Actions]
  end
  A --> B --> C
  C --> D --> E
  E --> H
  H --> I
  B --> F
  B --> G --> H
  H --> J
  K --> J
  P --> M
  P --> N
  L --> B
  M -->|unit tests| J
  N -->|browser tests| D
  O --> P
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run Dev Server (HTTPS):
   ```bash
   npm run dev
   ```
   Open the local URL in Meta Quest Browser.

3. Run Tests:
   ```bash
   npm run test:unit
   npm run test:e2e
   ```

## Tech Stack
- TypeScript
- Vite
- Three.js
- WebXR API
- Vitest & Playwright
