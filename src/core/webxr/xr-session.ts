import * as THREE from "three";

export class XRSessionManager {
  private renderer: THREE.WebGLRenderer;


  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;

  }

  async requestSession() {
    if (!navigator.xr) {
      console.error('WebXR not supported');
      const status = document.getElementById('status-text');
      if (status) status.innerText = 'WebXR not supported';
      return;
    }

    let sessionMode: XRSessionMode = "immersive-ar";
    const isArSupported = await navigator.xr.isSessionSupported("immersive-ar");
    if (!isArSupported) {
      console.warn("immersive-ar not supported, falling back to immersive-vr");
      const isVrSupported = await navigator.xr.isSessionSupported("immersive-vr");
      if (!isVrSupported) {
        const status = document.getElementById('status-text');
        if (status) status.innerText = 'WebXR not supported';
        return;
      }
      sessionMode = "immersive-vr";
    }

    const session = await navigator.xr.requestSession(sessionMode, {
      requiredFeatures: ["local-floor", "hit-test"],
      optionalFeatures: ["hand-tracking", "dom-overlay"],
      domOverlay: { root: document.getElementById("overlay")! },
    });


    this.renderer.xr.setReferenceSpaceType("local-floor");
    await this.renderer.xr.setSession(session);

    const status = document.getElementById("status-text");
    if (status) status.innerText = "Active";

    session.addEventListener("end", () => {

      document.getElementById("status-text")!.innerText = "Ended";
      document.getElementById("enter-ar")!.style.display = "block";
    });
  }
}
