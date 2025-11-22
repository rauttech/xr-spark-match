import * as THREE from "three";

export enum Zone {
  A = "A",
  B = "B",
  C = "C",
}

export class ZoneState {
  public currentZone: Zone = Zone.A;
  private lastZone: Zone = Zone.A;

  update(userPosition: THREE.Vector3) {
    this.lastZone = this.currentZone;

    // Simple zonal logic based on X position
    if (userPosition.x < -2) {
      this.currentZone = Zone.B;
    } else if (userPosition.x > 2) {
      this.currentZone = Zone.C;
    } else {
      this.currentZone = Zone.A;
    }
  }

  hasChangedZone(): boolean {
    return this.currentZone !== this.lastZone;
  }
}
