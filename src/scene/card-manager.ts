import * as THREE from "three";
import { Profile } from "../services/mock-profiles";
import { MatchEngine } from "../services/match-engine";
import { SparkManager } from "./spark-manager";
import { CardUI } from "../components/card-ui";

export class CardManager {
  private scene: THREE.Scene;
  private cards: Map<string, THREE.Group> = new Map();
  private profiles: Map<string, Profile> = new Map();
  private matchEngine: MatchEngine;
  private sparkManager: SparkManager;

  constructor(
    scene: THREE.Scene,
    matchEngine: MatchEngine,
    sparkManager: SparkManager,
  ) {
    this.scene = scene;
    this.matchEngine = matchEngine;
    this.sparkManager = sparkManager;
  }

  initializeCards(profiles: Profile[]) {
    // Clear existing
    this.cards.forEach((c) => this.scene.remove(c));
    this.cards.clear();
    this.profiles.clear();

    profiles.forEach((profile, index) => {
      const card = CardUI.createCard(profile);

      // Position in a circle around user
      const angle = (index / profiles.length) * Math.PI * 2;
      const radius = 2; // 2 meters
      card.position.set(
        Math.cos(angle) * radius,
        1.6,
        Math.sin(angle) * radius,
      );
      card.lookAt(0, 1.6, 0); // Look at user

      this.scene.add(card);
      this.cards.set(profile.id, card);
      this.profiles.set(profile.id, profile);
    });
  }

  update(time: number, camera: THREE.Camera) {
    // Float animation
    this.cards.forEach((card, id) => {
      card.position.y =
        1.6 +
        Math.sin(time * 0.001 + parseFloat(id.charCodeAt(0).toString())) * 0.1;
    });

    this.checkProximityForSparks();
  }

  private checkProximityForSparks() {
    const cardArray = Array.from(this.cards.values());
    const ids = Array.from(this.cards.keys());

    for (let i = 0; i < cardArray.length; i++) {
      for (let j = i + 1; j < cardArray.length; j++) {
        const c1 = cardArray[i];
        const c2 = cardArray[j];
        const dist = c1.position.distanceTo(c2.position);

        if (dist < 0.8) {
          const p1 = this.profiles.get(ids[i])!;
          const p2 = this.profiles.get(ids[j])!;
          const score = this.matchEngine.calculateCompatibility(p1, p2);

          if (score > 85) {
            this.sparkManager.triggerSpark(c1.position, c2.position);
          }
        }
      }
    }
  }

  getCardMesh(id: string) {
    return this.cards.get(id);
  }

  getAllCards() {
    return Array.from(this.cards.values());
  }

  getProfile(id: string) {
    return this.profiles.get(id);
  }
}
