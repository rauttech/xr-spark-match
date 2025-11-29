import * as THREE from "three";
import { Profile } from "../services/profile-service";
import { MockProfiles } from "../services/mock-profiles";
import { CardUI } from "../components/card-ui";
import { SparkManager } from "./spark-manager";
import { AudioManager } from "../audio/audio-manager";
import { PersistenceManager } from "../state/persistence";


export class CardManager {
  private scene: THREE.Scene;
  private cards: THREE.Group[] = [];
  private sparkManager: SparkManager;
  private audioManager: AudioManager;


  constructor(scene: THREE.Scene, audioManager: AudioManager) {
    this.scene = scene;
    this.audioManager = audioManager;
    this.sparkManager = new SparkManager(scene);


    // Load saved matches if any (for MVP just logging count)
    const saved = PersistenceManager.loadMatches();
    if (saved.length > 0) {
      console.log(`Loaded ${saved.length} saved matches.`);
    }

    this.spawnCards();
  }

  spawnCards() {
    const profiles = MockProfiles.generate(5);
    profiles.forEach((profile, index) => {
      const card = CardUI.createCard(profile);

      // Position in a semi-circle
      const angle = (index - 2) * 0.5;
      const radius = 1.5;
      card.position.set(
        Math.sin(angle) * radius,
        1.6, // Eye level
        -Math.cos(angle) * radius
      );

      card.lookAt(0, 1.6, 0);
      this.scene.add(card);
      this.cards.push(card);
    });
  }

  update(time: number) {
    this.cards.forEach(card => {
      CardUI.update(card, time);
    });
    this.sparkManager.update(time);
    this.checkProximity();
  }

  checkProximity() {
    // Simple O(N^2) check for MVP
    for (let i = 0; i < this.cards.length; i++) {
      for (let j = i + 1; j < this.cards.length; j++) {
        const c1 = this.cards[i];
        const c2 = this.cards[j];
        const dist = c1.position.distanceTo(c2.position);

        if (dist < 0.5) {
          // Trigger spark if close
          this.sparkManager.triggerSpark(c1.position, c2.position);
          // Play sound (debounced in real app, simple for MVP)
          if (Math.random() > 0.95) { // Reduce frequency
            this.audioManager.playMatchSound();
          }
        }
      }
    }
  }

  // Called by GestureEngine
  handleHover(card: THREE.Group, isHovered: boolean) {
    const wasHovered = card.userData.isHovered;
    CardUI.setHover(card, isHovered);
    if (isHovered && !wasHovered) {
      this.audioManager.playHoverSound();
    }
  }

  handleGrab(card: THREE.Group, isGrabbed: boolean) {
    card.userData.isGrabbed = isGrabbed;
    if (isGrabbed) {
      // Visual feedback for grab (e.g. shrink slightly or glow)
      card.scale.set(0.9, 0.9, 0.9);
    } else {
      card.scale.set(1, 1, 1);
    }
  }

  /**
   * Add a new profile card based on a fetched Profile.
   * For MVP we map the Profile to the mock profile shape expected by CardUI.
   */
  addProfileCard(profile: Profile) {
    const mockProfile = {
      id: profile.id,
      name: profile.name,
      role: "Attendee",
      tags: profile.tags,
      compatibilityScore: 80,
      color: "hsl(200,70%,50%)",
    } as any; // cast to any to satisfy CardUI type
    const card = CardUI.createCard(mockProfile);
    // Position the new card in front of the user at a default location
    card.position.set(0, 1.6, -2);
    this.scene.add(card);
    this.cards.push(card);
  }

  getCards() {
    return this.cards;
  }
}
