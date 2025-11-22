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

## Prerequisites

Before running the app, you must have **Node.js** installed.
1. Download and install from [nodejs.org](https://nodejs.org/).
2. Verify installation in your terminal: `node -v` and `npm -v`.

## Quick Start

We've included a helper script to get you started easily:

```bash
./setup_and_run.sh
```

## Manual Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run Dev Server (HTTPS)**:
   ```bash
   npm run dev
   ```
   - The terminal will show a Local and Network URL.
   - **On Quest**: Open the **Network** URL (e.g., `https://192.168.1.x:3000`).
   - Accept the "Unsafe Certificate" warning (since we use a self-signed cert for dev).

3. **Run Tests**:
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
