import { MockProfiles, Profile } from "./mock-profiles";

export type { Profile };

export class ProfileService {
    static async getProfile(id: string): Promise<Profile> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const profile = MockProfiles.getById(id);
        if (profile) {
            return profile;
        }

        // If not found in specific profiles, generate a random one (fallback)
        // In a real app, this would throw 404
        console.warn(`Profile ${id} not found in specific list, generating random.`);
        return MockProfiles.generate(1)[0];
    }
}
