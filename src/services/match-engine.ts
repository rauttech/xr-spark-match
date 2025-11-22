import { Profile } from "./mock-profiles";

export class MatchEngine {
  static calculateScore(p1: Profile, p2: Profile): number {
    // Simple tag matching
    const sharedTags = p1.tags.filter((tag) => p2.tags.includes(tag));
    const score = Math.round((sharedTags.length / Math.max(p1.tags.length, 1)) * 100);
    return Math.min(100, score);
  }

  static generateReasoning(p1: Profile, p2: Profile): string {
    const sharedTags = p1.tags.filter((tag) => p2.tags.includes(tag));
    if (sharedTags.length === 0) {
      return "No obvious common interests yet.";
    }
    if (sharedTags.length === 1) {
      return `Both interested in ${sharedTags[0]}.`;
    }
    return `Strong match! Both like ${sharedTags.join(" and ")}.`;
  }

  getMatchReasoning(profile: Profile): string {
    if (profile.compatibilityScore > 85)
      return "High compatibility based on shared interests.";
    if (profile.compatibilityScore > 50) return "Potential match.";
    return "Low compatibility.";
  }
}
