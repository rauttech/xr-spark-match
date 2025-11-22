import "./styles/main.css";
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

    this.gestureEngine = new GestureEngine(
      this.renderer.renderer,
      this.sceneInit.camera,
      this.cardManager
    );

    // 4. Setup XR Session
    this.xrSession = new XRSessionManager(
      this.renderer.renderer,
      this.sceneInit.camera,
    );

    this.init();
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
