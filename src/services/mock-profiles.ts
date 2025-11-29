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
  imageUrl?: string;
}

export class MockProfiles {
  private static specificProfiles: Profile[] = [
    {
      id: "deepak-raut",
      name: "Deepak Raut",
      role: "DevOps & XR-AI Automation",
      domain: "DevOps/XR",
      experienceLevel: "Expert",
      location: "Remote",
      tags: ["Azure", "AWS", "Python", "Docker", "K8s", "Meta XR", "AI"],
      compatibilityScore: 98,
      color: "#FF7A00", // Orange
      imageUrl: "/assets/profiles/deepak.jpg"
    },
    {
      id: "marlaina-love",
      name: "Marlaina Love",
      role: "Creative XR Technologist",
      domain: "XR/Spatial",
      experienceLevel: "Lead",
      location: "Remote",
      tags: ["Web3", "Spatial Computing", "Meta XR", "AI", "Storytelling"],
      compatibilityScore: 96,
      color: "#FFE100", // Yellow
      imageUrl: "/assets/profiles/marlaina.jpg"
    },
    {
      id: "serena-li",
      name: "Serena Li",
      role: "Backend & Cloud Engineer",
      domain: "Backend/Cloud",
      experienceLevel: "Senior",
      location: "Remote",
      tags: ["Python", "Flask", "AWS", "Scalability", "Security", "XR Backend"],
      compatibilityScore: 95,
      color: "#A8FF5A", // Light Green
    }
  ];

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
    const profiles: Profile[] = [...this.specificProfiles];

    if (count <= profiles.length) {
      return profiles.slice(0, count);
    }

    const profilesToGenerate = count - profiles.length;
    for (let i = 0; i < profilesToGenerate; i++) {
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

  static getById(id: string): Profile | undefined {
    return this.specificProfiles.find(p => p.id === id);
  }
}
