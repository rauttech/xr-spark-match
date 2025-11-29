import { v4 as uuidv4 } from "uuid";

export interface Profile {
  id: string;
  name: string;
  role: string;
  domain: string;
  experienceLevel: string;
  location: string;
  tags: string[];
  compatibilityScore: number; // 0 to 100
  color: string;
}

export class MockProfiles {
  private static names = [
    "Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Hank", "Ivy", "Jack"
  ];
  private static roles = [
    "Designer", "Developer", "Product Manager", "Artist", "Musician", "Data Scientist", "DevOps Engineer"
  ];
  private static domains = [
    "XR/VR", "Web", "Mobile", "AI/ML", "Game Dev", "Cloud", "Blockchain"
  ];
  private static experienceLevels = [
    "Junior", "Mid-level", "Senior", "Lead", "Expert"
  ];
  private static locations = [
    "San Francisco", "New York", "London", "Berlin", "Remote", "Tokyo", "Toronto"
  ];
  private static tags = [
    "React", "Three.js", "UX", "AI", "Music", "Hiking", "Gaming", "Unity", "C#", "Python", "Rust"
  ];

  static generate(count: number): Profile[] {
    const profiles: Profile[] = [];
    for (let i = 0; i < count; i++) {
      profiles.push({
        id: uuidv4(),
        name: this.names[Math.floor(Math.random() * this.names.length)],
        role: this.roles[Math.floor(Math.random() * this.roles.length)],
        domain: this.domains[Math.floor(Math.random() * this.domains.length)],
        experienceLevel: this.experienceLevels[Math.floor(Math.random() * this.experienceLevels.length)],
        location: this.locations[Math.floor(Math.random() * this.locations.length)],
        tags: [
          this.tags[Math.floor(Math.random() * this.tags.length)],
          this.tags[Math.floor(Math.random() * this.tags.length)],
          this.tags[Math.floor(Math.random() * this.tags.length)],
        ],
        compatibilityScore: Math.floor(Math.random() * 100),
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      });
    }
    return profiles;
  }
}
