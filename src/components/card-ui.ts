import * as THREE from "three";
import { getMatchColor } from "../utils/color";
import { Profile } from "../services/mock-profiles";

export class CardUI {
  static createCard(profile: Profile): THREE.Group {
    const group = new THREE.Group();
    group.userData = { profileId: profile.id, isCard: true };

    // Background (Glass-like effect)
    const geometry = new THREE.PlaneGeometry(0.5, 0.7); // Slightly larger
    const material = new THREE.MeshBasicMaterial({
      color: getMatchColor(profile.compatibilityScore),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85, // More opaque for readability
    });
    const plane = new THREE.Mesh(geometry, material);

    // Border
    const borderGeo = new THREE.EdgesGeometry(geometry);
    const borderMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    const border = new THREE.LineSegments(borderGeo, borderMat);
    group.add(border);

    group.add(plane);

    // Text (High Resolution Canvas)
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1400; // Taller canvas
    const ctx = canvas.getContext("2d")!;

    // White background for text area (rounded corners simulated by drawing rect)
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillRect(50, 50, 924, 1300);

    // Text Styling
    ctx.textAlign = "center";

    // Profile Image or Name
    if (profile.imageUrl) {
      const img = new Image();
      img.src = profile.imageUrl;
      // We need to wait for image to load, but since this is synchronous createCard,
      // we might need to handle it. For MVP, we'll assume it loads or use a callback pattern if needed.
      // However, canvas drawImage needs loaded image.
      // A better approach for Three.js texture is to load texture directly.
      // But here we are drawing to canvas.
      // Let's try to draw it if cached, or use a placeholder and update later?
      // For simplicity in this MVP, we will use a Promise-based loader or just standard Three.js TextureLoader for the image plane
      // and overlay it?
      // Actually, let's just draw a circle with the image on the canvas.
      // Since we can't await here easily without changing signature, we'll use a trick:
      // We'll return the group, and update the canvas when image loads.

      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(512, 200, 120, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 392, 80, 240, 240);
        ctx.restore();
        texture.needsUpdate = true;
      };
    } else {
      // Fallback to text initials or just name
      ctx.fillStyle = "#1a1a1a";
      ctx.font = "bold 130px Inter, Arial";
      ctx.fillText(profile.name, 512, 250);
    }

    // Name (below image if image exists)
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 100px Inter, Arial";
    ctx.fillText(profile.name, 512, 380);


    // Role
    ctx.fillStyle = "#4a4a4a";
    ctx.font = "italic 90px Inter, Arial";
    ctx.fillText(profile.role, 512, 400);

    // Separator
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(100, 450);
    ctx.lineTo(924, 450);
    ctx.stroke();

    // Match Score (advanced colour)
    const matchHex = getMatchColor(profile.compatibilityScore);
    ctx.fillStyle = matchHex;
    ctx.font = "bold 110px Inter, Arial";
    ctx.fillText(`Match: ${profile.compatibilityScore}%`, 512, 600);

    // Details: Domain, Experience, Location
    ctx.fillStyle = "#666666";
    ctx.font = "50px Inter, Arial";
    ctx.fillText(`${profile.domain} • ${profile.experienceLevel}`, 512, 700);
    ctx.fillText(`${profile.location}`, 512, 770);

    // Tags
    if (profile.tags && profile.tags.length > 0) {
      ctx.font = "60px Inter, Arial";
      ctx.fillStyle = "#333333";
      let y = 800;
      profile.tags.forEach((tag: string) => {
        ctx.fillText(`#${tag}`, 512, y);
        y += 80;
      });
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;

    const textGeo = new THREE.PlaneGeometry(0.45, 0.61); // Adjusted to fit background
    const textMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });
    const textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.z = 0.01;
    textMesh.position.y = 0.0;
    group.add(textMesh);

    // Close Button (Visual)
    // We'll draw a circle with an 'X' at the top right
    const closeX = 924 - 40;
    const closeY = 50 + 40;
    const closeRadius = 40;

    ctx.fillStyle = "#ff5252";
    ctx.beginPath();
    ctx.arc(closeX, closeY, closeRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(closeX - 15, closeY - 15);
    ctx.lineTo(closeX + 15, closeY + 15);
    ctx.moveTo(closeX + 15, closeY - 15);
    ctx.lineTo(closeX - 15, closeY + 15);
    ctx.stroke();

    // Store close button area in userData for raycasting
    // Normalized coordinates (0-1) relative to the plane
    // Plane is 0.5 x 0.7
    // Canvas is 1024 x 1400
    // Close button center is at (closeX, closeY)
    // We need to map this to UV space (0,0 is bottom-left usually in Three.js UVs, but canvas 0,0 is top-left)
    // UV y = 1 - (y / height)
    // UV x = x / width
    group.userData.closeButtonUV = {
      x: closeX / 1024,
      y: 1 - (closeY / 1400),
      radius: closeRadius / 1024 // Approximate radius in UV space (width-wise)
    };

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
