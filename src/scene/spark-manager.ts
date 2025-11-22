import * as THREE from 'three';

export class SparkManager {
    private scene: THREE.Scene;
    private sparks: THREE.Mesh[] = [];

    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    triggerSpark(pos1: THREE.Vector3, pos2: THREE.Vector3) {
        // Simple visual: Line connecting them
        const midPoint = pos1.clone().add(pos2).multiplyScalar(0.5);

        const geometry = new THREE.SphereGeometry(0.05, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const spark = new THREE.Mesh(geometry, material);
        spark.position.copy(midPoint);

        this.scene.add(spark);
        this.sparks.push(spark);

        // Remove after 1 second
        setTimeout(() => {
            this.scene.remove(spark);
            this.sparks = this.sparks.filter(s => s !== spark);
        }, 1000);
    }

    update(time: number) {
        // Animate sparks
        this.sparks.forEach(s => {
            s.scale.setScalar(1 + Math.sin(time * 0.01) * 0.5);
        });
    }
}
