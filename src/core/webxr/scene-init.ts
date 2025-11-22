import * as THREE from 'three';

export class SceneInit {
    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;

    constructor() {
        this.scene = new THREE.Scene();

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 5, 5);
        this.scene.add(directionalLight);

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
        this.camera.position.set(0, 1.6, 0); // Default user height
    }
}
