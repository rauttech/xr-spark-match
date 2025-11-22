import * as THREE from 'three';
import { Profile } from '../services/mock-profiles';

export class CardUI {
    static createCard(profile: Profile): THREE.Group {
        const group = new THREE.Group();
        group.userData = { profileId: profile.id, isCard: true };

        // Background
        const geometry = new THREE.PlaneGeometry(0.4, 0.6);
        const material = new THREE.MeshBasicMaterial({
            color: profile.color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        const plane = new THREE.Mesh(geometry, material);
        group.add(plane);

        // Text (Simulated with canvas texture for MVP)
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText(profile.name, 20, 50);
        ctx.font = '20px Arial';
        ctx.fillText(profile.role, 20, 90);
        ctx.fillText(`Match: ${profile.compatibilityScore}%`, 20, 130);

        const texture = new THREE.CanvasTexture(canvas);
        const textGeo = new THREE.PlaneGeometry(0.3, 0.3);
        const textMat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const textMesh = new THREE.Mesh(textGeo, textMat);
        textMesh.position.z = 0.01;
        textMesh.position.y = 0.05;
        group.add(textMesh);

        return group;
    }
}
