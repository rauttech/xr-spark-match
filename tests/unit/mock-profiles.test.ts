import { describe, it, expect } from 'vitest';
import { MockProfiles } from '../../src/services/mock-profiles';

describe('MockProfiles', () => {
    it('should generate correct number of profiles', () => {
        const profiles = MockProfiles.generate(5);
        expect(profiles.length).toBe(5);
    });

    it('should have valid properties', () => {
        const profiles = MockProfiles.generate(1);
        const p = profiles[0];
        expect(p.id).toBeDefined();
        expect(p.name).toBeDefined();
        expect(p.compatibilityScore).toBeGreaterThanOrEqual(0);
    });
});
