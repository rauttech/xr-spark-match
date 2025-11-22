import { Profile } from "./mock-profiles";

export class MatchEngine {
  calculateCompatibility(p1: Profile, p2: Profile): number {
    // Mock logic: average of their base scores + random variance
    const base = (p1.compatibilityScore + p2.compatibilityScore) / 2;
    return Math.min(100, Math.max(0, base)); // Clamp 0-100
  }

  getMatchReasoning(profile: Profile): string {
    if (profile.compatibilityScore > 85)
      return "High synergy in creative fields!";
    if (profile.compatibilityScore > 60)
      return "Good potential for collaboration.";
    return "Diverse skillsets, might be a challenge.";
  }
}
