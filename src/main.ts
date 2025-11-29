import { XRSessionManager } from './xr/xr-session';
import { PassthroughManager } from './xr/passthrough';
import { CameraManager } from './xr/camera';
import { QRScanner } from './xr/qr-scanner';
import { UIManager } from './xr/ui';
import * as THREE from 'three';

async function init() {
  const xrManager = new XRSessionManager();
  const passthroughManager = new PassthroughManager();
  const cameraManager = new CameraManager();
  const qrScanner = new QRScanner(cameraManager);
  const uiManager = new UIManager(xrManager.scene, xrManager.camera, xrManager.renderer);

  // Button to start XR session
  const startButton = document.getElementById('start-xr');
  if (startButton) {
    startButton.addEventListener('click', async () => {
      await xrManager.startSession();
      await passthroughManager.enablePassthrough();

      const cameraGranted = await cameraManager.requestCameraAccess();
      if (cameraGranted) {
        qrScanner.onResult((text) => {
          console.log("Scanned QR:", text);
          // Create a card in front of the user
          const position = new THREE.Vector3(0, 1.5, -1).applyMatrix4(xrManager.camera.matrixWorld);
          uiManager.createProfileCard(`User: ${text}`, position);
        });
        qrScanner.start();
      }
    });
  }

  // Animation loop
  xrManager.setAnimationLoop((_time, _frame) => {
    uiManager.update();
    xrManager.renderer.render(xrManager.scene, xrManager.camera);
  });
}

init();
