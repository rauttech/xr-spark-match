import { Profile } from "../services/mock-profiles";

export class PersistenceManager {
    private static STORAGE_KEY = "xr_spark_matches";

    static saveMatches(matches: Profile[]) {
        try {
            const data = JSON.stringify(matches);
            localStorage.setItem(this.STORAGE_KEY, data);
            console.log("Matches saved.");
        } catch (e) {
            console.error("Failed to save matches", e);
        }
    }

    static loadMatches(): Profile[] {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) {
                return JSON.parse(data) as Profile[];
            }
        } catch (e) {
            console.error("Failed to load matches", e);
        }
        return [];
    }

    static clearMatches() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}
