import * as THREE from "three";
import { CardManager } from "../scene/card-manager";

export class GestureEngine {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.Camera;
  private cardManager: CardManager;
  private raycaster: THREE.Raycaster;

  constructor(
    renderer: THREE.WebGLRenderer,
    camera: THREE.Camera,
    cardManager: CardManager,
  ) {
    this.renderer = renderer;
    this.camera = camera;
    this.cardManager = cardManager;
    this.raycaster = new THREE.Raycaster();
  }

  update(frame: XRFrame) {
    const session = frame.session;
    const inputSources = session.inputSources;

    for (const inputSource of inputSources) {
      if (inputSource.hand) {
        // Hand tracking logic would go here (pinch detection etc.)
        // For MVP, we'll simulate "AirTap" via select events which are handled by session listeners usually
        // But we can check for pinch pose here if we had full hand joints
      }

      // Simple controller/hand raycasting
      if (inputSource.targetRaySpace) {
        const targetRayPose = frame.getPose(
          inputSource.targetRaySpace,
          this.renderer.xr.getReferenceSpace()!,
        );
        if (targetRayPose) {
          // Raycast logic
          const origin = new THREE.Vector3(
            targetRayPose.transform.position.x,
            targetRayPose.transform.position.y,
            targetRayPose.transform.position.z,
          );
          const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(
            new THREE.Quaternion(
              targetRayPose.transform.orientation.x,
              targetRayPose.transform.orientation.y,
              targetRayPose.transform.orientation.z,
              targetRayPose.transform.orientation.w,
            ),
          );

          this.raycaster.set(origin, direction);

          // Intersect cards
          const cards = this.cardManager.getAllCards();
          const intersects = this.raycaster.intersectObjects(cards, true);

          if (intersects.length > 0) {
            // Highlight card
            const topCard = intersects[0].object.parent; // Group
            if (topCard && topCard.userData.isCard) {
              // Visual feedback
            }
          }
        }
      }
    }
  }

  // Mock gesture triggers for testing
  triggerGesture(name: string, targetId?: string) {
    console.log(`Gesture triggered: ${name}`);
    if (name === "airTap" && targetId) {
      const card = this.cardManager.getCardMesh(targetId);
      if (card) {
        // Expand card or show details
        const profile = this.cardManager.getProfile(targetId);
        if (profile) {
          const el = document.getElementById("reasoning-text");
          if (el) {
            el.innerText = `Selected ${profile.name}: ${profile.role}`;
            document.getElementById("match-reasoning")!.style.display = "block";
          }
        }
      }
    }
  }
}
