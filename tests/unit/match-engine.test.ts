import { describe, it, expect } from 'vitest';
import { MatchEngine } from '../../src/services/match-engine';

describe('MatchEngine', () => {
    const engine = new MatchEngine();

    it('should calculate compatibility score within range', () => {
        const p1 = { tags: ['A', 'B'] } as any;
        const p2 = { tags: ['B', 'C'] } as any;
        const score = MatchEngine.calculateScore(p1, p2);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
        expect(score).toBe(50); // 1 shared out of 2 max = 50%
    });

    it('should provide reasoning for high scores', () => {
        const p1 = { tags: ['A', 'B'] } as any;
        const p2 = { tags: ['A', 'B'] } as any;
        const reasoning = MatchEngine.generateReasoning(p1, p2);
        expect(reasoning).toContain('Strong match');
    });
});
