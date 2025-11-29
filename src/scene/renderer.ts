import * as THREE from "three";
import { StatsMonitor } from "../core/stats-monitor";

export class Renderer {
  public renderer: THREE.WebGLRenderer;

  private stats: StatsMonitor;

  constructor(canvas: HTMLCanvasElement) {

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true // Important for passthrough
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.xr.enabled = true;

    this.stats = new StatsMonitor();

    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  private onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render(scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer.render(scene, camera);
    this.stats.update();
  }

  setAnimationLoop(callback: (time: number, frame?: XRFrame) => void) {
    this.renderer.setAnimationLoop((time, frame) => {
      callback(time, frame);
    });
  }
}
