import * as THREE from 'three';

export class UIManager {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    raycaster: THREE.Raycaster;
    interactiveObjects: THREE.Object3D[] = [];
    controller: THREE.Group | null = null;

    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
        this.scene = scene;
        this.camera = camera;
        this.raycaster = new THREE.Raycaster();

        // Setup controller
        this.controller = renderer.xr.getController(0);
        this.controller.addEventListener('select', this.onSelect.bind(this));
        this.scene.add(this.controller);

        // Add controller model placeholder (line)
        const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)]);
        const line = new THREE.Line(geometry);
        line.name = 'line';
        line.scale.z = 5;
        this.controller.add(line);
    }

    createProfileCard(text: string, position: THREE.Vector3) {
        const geometry = new THREE.PlaneGeometry(0.3, 0.4);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
        const card = new THREE.Mesh(geometry, material);
        card.position.copy(position);
        card.lookAt(this.camera.position); // Face the user

        // Add text (using canvas texture for simplicity)
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = 'black';
            ctx.font = '30px Arial';
            ctx.fillText(text, 20, 50);
        }
        const texture = new THREE.CanvasTexture(canvas);
        const textMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.28), textMaterial);
        textMesh.position.z = 0.01;
        card.add(textMesh);

        this.scene.add(card);
        this.interactiveObjects.push(card);
    }

    onSelect() {
        if (!this.controller) return;

        const tempMatrix = new THREE.Matrix4();
        tempMatrix.identity().extractRotation(this.controller.matrixWorld);

        this.raycaster.ray.origin.setFromMatrixPosition(this.controller.matrixWorld);
        this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

        const intersects = this.raycaster.intersectObjects(this.interactiveObjects);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            console.log('Selected object:', object);
            // Handle interaction (e.g., highlight, move)
            (object as THREE.Mesh).material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        }
    }

    update() {
        // Optional: Hover effects
    }
}
