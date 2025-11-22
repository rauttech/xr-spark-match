export type ZoneType = "Lobby" | "Tech Booth" | "Social Lounge" | "Stage";

export class ZoneState {
  private currentZone: ZoneType = "Lobby";
  private listeners: ((zone: ZoneType) => void)[] = [];

  setZone(zone: ZoneType) {
    if (this.currentZone !== zone) {
      this.currentZone = zone;
      console.log(`Entered Zone: ${zone}`);
      this.notifyListeners();
    }
  }

  getZone(): ZoneType {
    return this.currentZone;
  }

  addListener(callback: (zone: ZoneType) => void) {
    this.listeners.push(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb(this.currentZone));
  }
}
