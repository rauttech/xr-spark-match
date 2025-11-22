import { describe, it, expect } from 'vitest';
import { MatchEngine } from '../../src/services/match-engine';
import { Profile } from '../../src/services/mock-profiles';

describe('MatchEngine', () => {
    const engine = new MatchEngine();

    it('should calculate compatibility score within range', () => {
        const p1 = { compatibilityScore: 50 } as Profile;
        const p2 = { compatibilityScore: 70 } as Profile;
        const score = engine.calculateCompatibility(p1, p2);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
        expect(score).toBe(60);
    });

    it('should provide reasoning for high scores', () => {
        const p = { compatibilityScore: 90 } as Profile;
        expect(engine.getMatchReasoning(p)).toContain('High synergy');
    });
});
