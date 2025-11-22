import * as THREE from "three";
import { Profile } from "../services/mock-profiles";

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
      opacity: 0.8,
    });
    const plane = new THREE.Mesh(geometry, material);
    group.add(plane);

    // Text (High Resolution Canvas)
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;

    // White background for text area
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 1024, 1024);

    // Text Styling
    ctx.fillStyle = "#1a1a1a"; // Dark grey for better contrast
    ctx.textAlign = "center";

    // Name
    ctx.font = "bold 120px Inter, Arial";
    ctx.fillText(profile.name, 512, 200);

    // Role
    ctx.fillStyle = "#4a4a4a";
    ctx.font = "80px Inter, Arial";
    ctx.fillText(profile.role, 512, 350);

    // Match Score
    ctx.fillStyle = profile.compatibilityScore > 80 ? "#e91e63" : "#2196f3"; // Pink for high match, Blue for others
    ctx.font = "bold 100px Inter, Arial";
    ctx.fillText(`Match: ${profile.compatibilityScore}%`, 512, 550);

    const texture = new THREE.CanvasTexture(canvas);
    // Anisotropy helps texture look sharp at oblique angles
    texture.anisotropy = 16;

    const textGeo = new THREE.PlaneGeometry(0.35, 0.35);
    const textMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });
    const textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.z = 0.01;
    textMesh.position.y = 0.05;
    group.add(textMesh);

    return group;
  }

  static update(group: THREE.Group, time: number) {
    // Idle Animation: Floating sine wave
    const initialY = group.userData.initialY || group.position.y;
    group.userData.initialY = initialY; // Store initial Y if not set

    const floatOffset = Math.sin(time * 2 + group.id) * 0.02;
    group.position.y = initialY + floatOffset;

    // Hover Animation: Scale
    const targetScale = group.userData.isHovered ? 1.1 : 1.0;
    group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  }

  static setHover(group: THREE.Group, isHovered: boolean) {
    if (group.userData.isHovered !== isHovered) {
      group.userData.isHovered = isHovered;
      // Optional: Change border color or opacity here if we had a border mesh
    }
  }
}
