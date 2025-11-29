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
graph TD
    App[Main App] --> XR[XRSessionManager]
    App --> Scene[SceneInit]
    App --> Render[Renderer]
    
    Scene --> Audio[AudioManager]
    Scene --> Cards[CardManager]
    
    Cards --> Spark[SparkManager]
    Cards --> UI[CardUI]
    Cards --> State[Persistence/ZoneState]
    
    App --> Gestures[GestureEngine]
    Gestures --> Cards
    
    Services[Services] --> Match[MatchEngine]
    Services --> Profiles[MockProfiles]
    Cards --> Services
```

## 🛠 Setup & Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server** (HTTPS enabled for WebXR)
   ```bash
   npm run dev
   ```
   Access at `https://localhost:5173` (accept self-signed cert).

3. **Run Tests**
   ```bash
   npm run test:unit   # Vitest
   npm run test:e2e    # Playwright
   npm run test:emulator # Playwright with Immersive Web Emulator
   ```

## 🕶 Meta Quest Preview
1. Ensure your Quest and PC are on the same network.
2. Run `npm run dev -- --host`.
3. Open Meta Quest Browser and navigate to the displayed IP address (e.g., `https://192.168.1.x:5173`).
4. Click "Enter AR Match Mode".
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

## License & Author
**Author**: Deepak Raghunath Raut
**License**: MIT
