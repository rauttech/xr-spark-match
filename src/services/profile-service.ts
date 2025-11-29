// ProfileService – fetches profile data from backend API

export interface Profile {
    id: string;
    name: string;
    avatarUrl: string;
    tags: string[];
    // Additional fields can be added as needed
}

export class ProfileService {
    static async getProfile(id: string): Promise<Profile> {
        const response = await fetch(`/api/profile/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch profile with id ${id}`);
        }
        const data = await response.json();
        return data as Profile;
    }
}
