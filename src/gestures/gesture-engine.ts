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

  // State for gestures
  private lastHandPosition: THREE.Vector3 | null = null;
  private isPinching: boolean = false;
  private pinchStartTime: number = 0;
  private grabbedObject: THREE.Group | null = null;

  update(frame: XRFrame) {
    const session = frame.session;
    const inputSources = session.inputSources;

    for (const inputSource of inputSources) {
      // 1. Hand Tracking / Controller Raycasting
      if (inputSource.targetRaySpace) {
        const targetRayPose = frame.getPose(
          inputSource.targetRaySpace,
          this.renderer.xr.getReferenceSpace()!,
        );

        if (targetRayPose) {
          const origin = new THREE.Vector3(
            targetRayPose.transform.position.x,
            targetRayPose.transform.position.y,
            targetRayPose.transform.position.z,
          );

          // Check for Swipe (Velocity based)
          if (this.lastHandPosition) {
            const velocity = origin.clone().sub(this.lastHandPosition).divideScalar(0.016); // approx delta time
            if (velocity.length() > 2.0) { // Threshold for swipe
              // Determine direction
              if (Math.abs(velocity.x) > Math.abs(velocity.y)) {
                this.triggerGesture(velocity.x > 0 ? "swipeRight" : "swipeLeft");
              }
            }
          }
          this.lastHandPosition = origin.clone();

          // Raycasting for Hover/Select
          const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(
            new THREE.Quaternion(
              targetRayPose.transform.orientation.x,
              targetRayPose.transform.orientation.y,
              targetRayPose.transform.orientation.z,
              targetRayPose.transform.orientation.w,
            ),
          );

          this.raycaster.set(origin, direction);
          const cards = this.cardManager.getCards();
          const intersects = this.raycaster.intersectObjects(cards, true);

          // Reset hover
          cards.forEach(c => this.cardManager.handleHover(c, false));

          if (intersects.length > 0) {
            let object = intersects[0].object;
            while (object.parent && object.parent.type !== 'Scene') {
              if (object.parent.userData.isCard) {
                const cardGroup = object.parent as THREE.Group;
                this.cardManager.handleHover(cardGroup, true);

                // Simulate Pinch/Grab (Select event usually handles this, but logic here for custom pinch)
                if (session.inputSources[0] && session.inputSources[0].gamepad) {
                  // Check gamepad buttons for trigger/squeeze if available
                  const gamepad = session.inputSources[0].gamepad;
                  if (gamepad.buttons[0].pressed) {
                    if (!this.isPinching) {
                      this.isPinching = true;
                      this.grabbedObject = cardGroup;
                      this.cardManager.handleGrab(cardGroup, true);
                    }
                  } else {
                    if (this.isPinching) {
                      this.isPinching = false;
                      if (this.grabbedObject) {
                        this.cardManager.handleGrab(this.grabbedObject, false);
                        this.grabbedObject = null;
                      }
                    }
                  }
                }

                // Move grabbed object
                if (this.isPinching && this.grabbedObject === cardGroup) {
                  // Simple drag: follow ray tip (approximate)
                  const targetPos = origin.clone().add(direction.multiplyScalar(1.5)); // 1.5m distance
                  // Lerp for smoothness
                  cardGroup.position.lerp(targetPos, 0.2);
                  cardGroup.lookAt(new THREE.Vector3(0, 1.6, 0)); // Always face user
                }
                break;
              }
              object = object.parent;
            }
          } else {
            // Release if lost tracking/intersection while pinching (optional safety)
            if (this.isPinching && this.grabbedObject) {
              // Keep holding if we assume pinch is maintained, or release. 
              // For MVP, let's release if ray misses to avoid stuck objects
              // this.isPinching = false;
              // this.cardManager.handleGrab(this.grabbedObject, false);
              // this.grabbedObject = null;
            }
          }
        }
      }
    }
  }

  triggerGesture(name: string) {
    console.log(`Gesture: ${name}`);
    // Hook into CardManager or other systems
  }
}
