import * as THREE from 'three';

export class XRSessionManager {
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private currentSession: XRSession | null = null;

    constructor(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) {
        this.renderer = renderer;
        this.camera = camera;
    }

    async requestSession() {
        if (!navigator.xr) {
            console.error('WebXR not supported');
            return;
        }

        const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
        if (!isSupported) {
            console.warn('immersive-ar not supported, falling back or erroring');
            // In a real app, handle fallback
        }

        const session = await navigator.xr.requestSession('immersive-ar', {
            requiredFeatures: ['local-floor', 'hit-test', 'hand-tracking'],
            optionalFeatures: ['dom-overlay'],
            domOverlay: { root: document.getElementById('overlay')! }
        });

        this.currentSession = session;
        this.renderer.xr.setReferenceSpaceType('local-floor');
        await this.renderer.xr.setSession(session);

        session.addEventListener('end', () => {
            this.currentSession = null;
            document.getElementById('status-text')!.innerText = 'Ended';
            document.getElementById('enter-ar')!.style.display = 'block';
        });
    }
}
