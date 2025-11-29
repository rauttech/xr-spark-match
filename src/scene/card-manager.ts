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

    this.spawnCards(); // Spawn background profiles
  }

  spawnCards() {
    // Generate enough random profiles to ensure we have 5 background cards after filtering
    // We request 10, filter out specific ones, and take the first 5.
    const allProfiles = MockProfiles.generate(10);
    const backgroundProfiles = allProfiles
      .filter(p => !["deepak-raut", "marlaina-love", "serena-li"].includes(p.id))
      .slice(0, 5);

    backgroundProfiles.forEach((profile, index) => {
      const card = CardUI.createCard(profile);

      // Position in a semi-circle but further back
      const angle = (index - 2) * 0.6; // Adjusted spread
      const radius = 2.5; // Slightly closer than 3.0 for better visibility
      card.position.set(
        Math.sin(angle) * radius,
        1.6, // Eye level
        -Math.cos(angle) * radius - 0.5
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

  handleClose(card: THREE.Group) {
    // Hide the card
    card.visible = false;

    // Reset position to hidden location just in case
    card.position.set(0, 10, 5);

    // Play sound
    this.audioManager.playHoverSound(); // Use hover sound as 'close' feedback for now
    console.log(`Closed card for profile: ${card.userData.profileId}`);
  }

  /**
   * Add a new profile card based on a fetched Profile.
   * For MVP we map the Profile to the mock profile shape expected by CardUI.
   */
  preloadProfiles(profiles: Profile[]) {
    profiles.forEach((profile) => {
      // Check if already exists to avoid duplicates
      if (this.cards.find(c => c.userData.profileId === profile.id)) return;

      const card = CardUI.createCard(profile);
      // Position hidden in background (behind user and slightly up)
      card.position.set(
        (Math.random() - 0.5) * 4, // Random spread X
        10, // High up (hidden)
        5 // Behind user
      );
      card.visible = false; // Initially invisible

      this.scene.add(card);
      this.cards.push(card);
    });
  }

  /**
   * Add a new profile card based on a fetched Profile.
   * If the card was preloaded, reveal it and move it to front.
   */
  addProfileCard(profile: Profile) {
    const existingCard = this.cards.find(c => c.userData.profileId === profile.id);

    if (existingCard) {
      // Reveal existing card
      existingCard.visible = true;
      // Animate to front (simple teleport for MVP, could be lerp)
      existingCard.position.set(0, 1.6, -1.5); // Right in front
      existingCard.lookAt(0, 1.6, 0);

      // Play sound
      this.audioManager.playMatchSound();
      return;
    }

    // Fallback for non-preloaded profiles
    const card = CardUI.createCard(profile);
    // Position the new card in front of the user at a default location
    card.position.set(0, 1.6, -1.5);
    this.scene.add(card);
    this.cards.push(card);
    this.audioManager.playMatchSound();
  }

  getCards() {
    return this.cards;
  }
}
