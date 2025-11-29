// Author: Deepak Raut
import "./styles/main.css";
import { QRScanner } from "./components/qr-scanner";
import { ProfileService } from "./services/profile-service";
import { XRSessionManager } from "./core/webxr/xr-session";
import { SceneInit } from "./core/webxr/scene-init";
import { Renderer } from "./scene/renderer";
import { CardManager } from "./scene/card-manager";
import { GestureEngine } from "./gestures/gesture-engine";
import { ZoneState } from "./state/zone-state";

class App {
  private xrSession: XRSessionManager;
  private sceneInit: SceneInit;
  private renderer: Renderer;
  private cardManager: CardManager;
  private gestureEngine: GestureEngine;
  private zoneState: ZoneState;


  constructor() {
    // 1. Setup DOM and Canvas
    const appDiv = document.getElementById("app");
    const canvas = document.createElement("canvas");
    appDiv?.appendChild(canvas);

    // 2. Initialize Core Systems
    this.sceneInit = new SceneInit();
    this.renderer = new Renderer(canvas);

    // 3. Initialize Managers
    this.zoneState = new ZoneState();
    this.cardManager = new CardManager(
      this.sceneInit.scene,
      this.sceneInit.audioManager
    );

    // Load Audio
    this.sceneInit.audioManager.load('spark', '/audio/spark.wav');
    this.sceneInit.audioManager.load('hover', '/audio/hover.wav');

    this.gestureEngine = new GestureEngine(
      this.renderer.renderer,
      this.cardManager,
      this.sceneInit.audioManager
    );

    // 4. Setup XR Session
    this.xrSession = new XRSessionManager(
      this.renderer.renderer
    );

    this.init();
    // Initialize QR scanner
    new QRScanner(async (data: string) => {
      try {
        const profile = await ProfileService.getProfile(data);
        // Add the scanned profile as a new card (or reveal if hidden)
        this.cardManager.addProfileCard(profile);
      } catch (e) {
        console.error('Failed to fetch profile for QR data', e);
      }
    });

    // Preload specific profiles (Deepak, Marlaina, Serena) in hidden state
    this.preloadSpecificProfiles();
  }

  private async preloadSpecificProfiles() {
    // IDs of the specific profiles we want to hide in background
    const ids = ["deepak-raut", "marlaina-love", "serena-li"];
    const profiles = [];

    for (const id of ids) {
      try {
        // We use MockProfiles directly here to avoid the simulated delay of ProfileService for preloading
        // or we can use ProfileService if we want to test that path.
        // Let's use ProfileService but parallelize
        const p = await ProfileService.getProfile(id);
        profiles.push(p);
      } catch (e) {
        console.warn(`Failed to preload profile ${id}`);
      }
    }

    if (profiles.length > 0) {
      this.cardManager.preloadProfiles(profiles);
      console.log(`Preloaded ${profiles.length} profiles in background.`);
    }
  }

  private init() {
    const enterButton = document.getElementById("enter-ar");
    if (enterButton) {
      enterButton.addEventListener("click", () => this.startSession());
    }

    // Start update loop
    this.renderer.setAnimationLoop((time: number, frame?: XRFrame) => {
      this.update(time, frame);
    });
  }

  private async startSession() {
    try {
      await this.xrSession.requestSession();
      // Status update is handled in XRSessionManager now
      document.getElementById("enter-ar")!.style.display = "none";
    } catch (e: any) {
      console.error("Failed to start session:", e);
      document.getElementById("status-text")!.innerText = "Error: " + e.message;
    }
  }

  private update(time: number, frame?: XRFrame) {
    // Render Scene
    this.renderer.render(this.sceneInit.scene, this.sceneInit.camera);

    if (!frame) return;

    // Update Systems
    this.gestureEngine.update(frame);
    this.cardManager.update(time);

    // Simple Zone Logic (Mock)
    const userPos = this.sceneInit.camera.position;
    if (userPos.x > 2) this.zoneState.setZone("Tech Booth");
    else if (userPos.x < -2) this.zoneState.setZone("Social Lounge");
    else this.zoneState.setZone("Lobby");
  }
}

new App();
