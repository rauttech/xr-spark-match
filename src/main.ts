import './styles/main.css';
import { XRSessionManager } from './core/webxr/xr-session';
import { SceneInit } from './core/webxr/scene-init';
import { Renderer } from './scene/renderer';
import { CardManager } from './scene/card-manager';
import { GestureEngine } from './gestures/gesture-engine';
import { MatchEngine } from './services/match-engine';
import { MockProfiles } from './services/mock-profiles';
import { SparkManager } from './scene/spark-manager';
import { ZoneState } from './state/zone-state';

class App {
    private xrSession: XRSessionManager;
    private sceneInit: SceneInit;
    private renderer: Renderer;
    private cardManager: CardManager;
    private gestureEngine: GestureEngine;
    private sparkManager: SparkManager;
    private matchEngine: MatchEngine;
    private zoneState: ZoneState;

    constructor() {
        this.sceneInit = new SceneInit();
        this.renderer = new Renderer(this.sceneInit.scene, this.sceneInit.camera);
        this.xrSession = new XRSessionManager(this.renderer.renderer, this.sceneInit.camera);

        this.matchEngine = new MatchEngine();
        this.zoneState = new ZoneState();
        this.sparkManager = new SparkManager(this.sceneInit.scene);
        this.cardManager = new CardManager(this.sceneInit.scene, this.matchEngine, this.sparkManager);
        this.gestureEngine = new GestureEngine(this.renderer.renderer, this.sceneInit.camera, this.cardManager);

        this.init();
    }

    private init() {
        const enterButton = document.getElementById('enter-ar');
        if (enterButton) {
            enterButton.addEventListener('click', () => this.startSession());
        }

        // Start update loop
        this.renderer.setAnimationLoop((time: number, frame?: XRFrame) => {
            this.update(time, frame);
        });
    }

    private async startSession() {
        await this.xrSession.requestSession();
        document.getElementById('status-text')!.innerText = 'Active';
        document.getElementById('enter-ar')!.style.display = 'none';

        // Initial population
        const profiles = MockProfiles.generate(5);
        this.cardManager.initializeCards(profiles);
    }

    private update(time: number, frame?: XRFrame) {
        if (!frame) return;

        this.gestureEngine.update(frame);
        this.cardManager.update(time, this.sceneInit.camera);
        this.sparkManager.update(time);
        this.zoneState.update(this.sceneInit.camera.position);

        // Check for zone changes to regenerate profiles if needed
        if (this.zoneState.hasChangedZone()) {
            // Logic to add/remove cards based on zone could go here
            console.log('Zone changed:', this.zoneState.currentZone);
        }
    }
}

new App();
