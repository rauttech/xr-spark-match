import { v4 as uuidv4 } from "uuid";

export interface Profile {
  id: string;
  name: string;
  role: string;
  tags: string[];
  compatibilityScore: number; // 0 to 100
  color: string;
}

export class MockProfiles {
  private static names = [
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Eve",
    "Frank",
    "Grace",
  ];
  private static roles = [
    "Designer",
    "Developer",
    "Product Manager",
    "Artist",
    "Musician",
  ];
  private static tags = [
    "React",
    "Three.js",
    "UX",
    "AI",
    "Music",
    "Hiking",
    "Gaming",
  ];

  static generate(count: number): Profile[] {
    const profiles: Profile[] = [];
    for (let i = 0; i < count; i++) {
      profiles.push({
        id: uuidv4(),
        name: this.names[Math.floor(Math.random() * this.names.length)],
        role: this.roles[Math.floor(Math.random() * this.roles.length)],
        tags: [
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
