import * as THREE from 'three';

export class XRSessionManager {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    session: XRSession | null = null;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.xr.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    async startSession() {
        if (this.session) return;

        const sessionInit = { requiredFeatures: ['local-floor', 'hit-test'] };
        try {
            // @ts-ignore
            const session = await navigator.xr?.requestSession('immersive-ar', sessionInit);
            if (session) {
                this.session = session;
                this.renderer.xr.setSession(session);
                session.addEventListener('end', this.onSessionEnded.bind(this));
                console.log('XR Session started');
            }
        } catch (e) {
            console.error('Failed to start XR session:', e);
        }
    }

    onSessionEnded() {
        this.session = null;
        console.log('XR Session ended');
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setAnimationLoop(callback: XRFrameRequestCallback) {
        this.renderer.setAnimationLoop(callback);
    }
}
