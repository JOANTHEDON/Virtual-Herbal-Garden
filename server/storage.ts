import { 
  users, 
  plants, 
  userBookmarks, 
  userNotes, 
  virtualTours,
  type User, 
  type InsertUser, 
  type Plant, 
  type InsertPlant,
  type UserBookmark,
  type InsertBookmark,
  type UserNote,
  type InsertNote,
  type VirtualTour,
  type InsertTour
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations for authentication
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Plant operations
  getPlants(): Promise<Plant[]>;
  getPlant(id: number): Promise<Plant | undefined>;
  searchPlants(query: string): Promise<Plant[]>;
  getPlantsByCategory(category: string): Promise<Plant[]>;
  getPlantsByRegion(region: string): Promise<Plant[]>;
  createPlant(plant: InsertPlant): Promise<Plant>;

  // Bookmark operations
  getUserBookmarks(userId: string): Promise<Plant[]>;
  addBookmark(bookmark: InsertBookmark): Promise<UserBookmark>;
  removeBookmark(userId: string, plantId: number): Promise<boolean>;

  // Notes operations
  getUserNotes(userId: string): Promise<UserNote[]>;
  getPlantNotes(userId: string, plantId: number): Promise<UserNote[]>;
  addNote(note: InsertNote): Promise<UserNote>;
  updateNote(id: number, note: string): Promise<UserNote | undefined>;
  deleteNote(id: number): Promise<boolean>;

  // Virtual tours
  getVirtualTours(): Promise<VirtualTour[]>;
  getVirtualTour(id: number): Promise<VirtualTour | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private plants: Map<number, Plant>;
  private bookmarks: Map<number, UserBookmark>;
  private notes: Map<number, UserNote>;
  private tours: Map<number, VirtualTour>;
  private currentUserId: number;
  private currentPlantId: number;
  private currentBookmarkId: number;
  private currentNoteId: number;
  private currentTourId: number;

  constructor() {
    this.users = new Map();
    this.plants = new Map();
    this.bookmarks = new Map();
    this.notes = new Map();
    this.tours = new Map();
    this.currentUserId = 1;
    this.currentPlantId = 1;
    this.currentBookmarkId = 1;
    this.currentNoteId = 1;
    this.currentTourId = 1;
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample plants data
    const samplePlants: InsertPlant[] = [
      {
        commonName: "Turmeric",
        botanicalName: "Curcuma longa",
        region: "South Asia",
        habitat: "Native to South Asia, thrives in tropical climates with well-drained soil.",
        medicinalUses: "Anti-inflammatory, antioxidant, joint health, immunity booster, digestive aid.",
        cultivation: "Plant rhizomes in warm, humid conditions. Requires 7-10 months to mature.",
        primaryUse: "Powerful anti-inflammatory and antioxidant properties for joint health and immunity.",
        category: "Anti-inflammatory",
        imageUrl: "https://pixabay.com/get/g147565bfb2b01fc3de6ef211cdcba9867f0a5a41a48d3aa52ce24f3905741d7d1255c2a6e378bf4994a55ecb4562aa1415862675157ded8bca663eb8b912bd1c_1280.jpg",
        modelUrl: "/models/turmeric_1752659858842.glb",
        preparationMethods: ["Fresh root juice", "Dried powder", "Turmeric paste", "Golden milk"],
        ayushSystem: "Ayurveda",
        isPopular: true
      },
      {
        commonName: "Neem",
        botanicalName: "Azadirachta indica",
        region: "India",
        habitat: "Native to India and Myanmar, grows in tropical and semi-tropical regions.",
        medicinalUses: "Natural antibacterial and antifungal properties for skin health and pest control.",
        cultivation: "Fast-growing tree, drought resistant, grows in various soil types.",
        primaryUse: "Natural antibacterial and antifungal properties for skin health and pest control.",
        category: "Antibacterial",
        imageUrl: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        modelUrl: "/models/neem_tree_1752659894030.glb",
        preparationMethods: ["Neem oil", "Leaf paste", "Decoction", "Powder"],
        ayushSystem: "Ayurveda",
        isPopular: true
      },
      {
        commonName: "Ashwagandha",
        botanicalName: "Withania somnifera",
        region: "India",
        habitat: "Dry regions of India, particularly in Rajasthan, Punjab, Haryana, and Gujarat.",
        medicinalUses: "Powerful adaptogen for stress relief, energy enhancement and immune support.",
        cultivation: "Grows in dry and sub-tropical regions, requires well-drained soil.",
        primaryUse: "Powerful adaptogen for stress relief, energy enhancement and immune support.",
        category: "Adaptogen",
        imageUrl: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        modelUrl: "/models/ashwagandha_1752659931972.glb",
        preparationMethods: ["Root powder", "Capsules", "Churna", "Herbal tea"],
        ayushSystem: "Ayurveda",
        isPopular: true
      },
      {
        commonName: "Ginger",
        botanicalName: "Zingiber officinale",
        region: "Southeast Asia",
        habitat: "Tropical regions with warm, humid climate and rich, well-drained soil.",
        medicinalUses: "Excellent for digestion, nausea relief and anti-inflammatory benefits.",
        cultivation: "Grown from rhizomes in warm, humid conditions with partial shade.",
        primaryUse: "Excellent for digestion, nausea relief and anti-inflammatory benefits.",
        category: "Digestive",
        imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        modelUrl: "/models/ginger_rhizome_1752659969242.glb",
        preparationMethods: ["Fresh ginger tea", "Dried powder", "Ginger paste", "Essential oil"],
        ayushSystem: "Ayurveda",
        isPopular: true
      },
      {
        commonName: "Aloe Vera",
        botanicalName: "Aloe barbadensis",
        region: "Africa",
        habitat: "Arid and semi-arid regions, requires minimal water and good drainage.",
        medicinalUses: "Soothing gel for skin healing, burns treatment and digestive health.",
        cultivation: "Succulent plant that grows in sandy, well-draining soil with minimal water.",
        primaryUse: "Soothing gel for skin healing, burns treatment and digestive health.",
        category: "Healing",
        imageUrl: "https://pixabay.com/get/gabbc91ed0a38a59fd4b7bd722b2ae23d2ce18e7ccc633f0c35c6df7c647eb3bbd42b36f4db08ff4d754e22df0d86c46f01d458e0a850aa104dacc8fec588a741_1280.jpg",
        modelUrl: "/models/aloe_vera_1752659996190.glb",
        preparationMethods: ["Fresh gel", "Aloe juice", "Topical cream", "Powder"],
        ayushSystem: "Unani",
        isPopular: true
      },
      {
        commonName: "Brahmi",
        botanicalName: "Bacopa monnieri",
        region: "India",
        habitat: "Wetlands and muddy shores throughout India and other tropical regions.",
        medicinalUses: "Enhances memory, cognitive function and supports mental clarity.",
        cultivation: "Grows in wetlands, requires constant moisture and warm climate.",
        primaryUse: "Enhances memory, cognitive function and supports mental clarity.",
        category: "Brain Health",
        imageUrl: "https://pixabay.com/get/gbcc44e869cf6e7bad599f2acf497234dd32130cbbf39586fc2733b211f675560e43bf44b40751ade50897a4a4acfa358727b28592bfbaccfcc6a3478c53e5326_1280.jpg",
        modelUrl: "/models/brahmi_1752660022307.glb",
        preparationMethods: ["Brahmi oil", "Powder", "Fresh juice", "Herbal tea"],
        ayushSystem: "Ayurveda",
        isPopular: true
      },
      {
        commonName: "Tulsi",
        botanicalName: "Ocimum sanctum",
        region: "India",
        habitat: "Native to tropical regions of India, grows in various soil types.",
        medicinalUses: "Holy basil for respiratory health, stress relief and spiritual well-being.",
        cultivation: "Easy to grow herb, requires warm climate and regular watering.",
        primaryUse: "Holy basil for respiratory health, stress relief and spiritual well-being.",
        category: "Sacred",
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        modelUrl: "/models/tulsi_basil_1752660043152.glb",
        preparationMethods: ["Tulsi tea", "Fresh leaves", "Essential oil", "Powder"],
        ayushSystem: "Ayurveda",
        isPopular: true
      },
      {
        commonName: "Amla",
        botanicalName: "Phyllanthus emblica",
        region: "India",
        habitat: "Deciduous forests of tropical and subtropical India.",
        medicinalUses: "Rich in Vitamin C, supports immunity, hair health and digestion.",
        cultivation: "Hardy tree that grows in various climates, requires minimal care.",
        primaryUse: "Rich in Vitamin C, supports immunity, hair health and digestion.",
        category: "Vitamin C",
        imageUrl: "https://pixabay.com/get/g78684d8987a94d92dfb731df6973d48107c17c0b0e6588ce7c206a797193ef46b06755d38e7366e502fcb886c8dd43c0356b68e3ab156bb689a68a4e1512fc5a_1280.jpg",
        modelUrl: "/models/amla_tree_1752660069472.glb",
        preparationMethods: ["Fresh fruit", "Amla juice", "Powder", "Pickles"],
        ayushSystem: "Ayurveda",
        isPopular: true
      }
    ];

    samplePlants.forEach(plant => this.createPlant(plant));

    // Initialize virtual tours
    const sampleTours: InsertTour[] = [
      {
        title: "Top 10 Immunity Herbs",
        description: "Explore powerful herbs that boost natural immunity and strengthen your body's defenses.",
        imageUrl: "https://pixabay.com/get/gb2d3275d26b80acb8fd03ba5aa93348caf54656eab8473ba1b00d1ce4816b006e6fc3f6eb749f6128ed566ff101c84056428196db2112c94a984d4da2f621923_1280.jpg",
        plantCount: 12,
        duration: "15 min tour",
        category: "Immunity",
        plantIds: [1, 2, 3, 6, 7, 8]
      },
      {
        title: "Skin Healing Plants",
        description: "Discover natural remedies for healthy, glowing skin from traditional Ayurvedic medicine.",
        imageUrl: "https://images.unsplash.com/photo-1622737133809-d95047b9e673?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        plantCount: 8,
        duration: "10 min tour",
        category: "Skin Care",
        plantIds: [2, 5, 7]
      },
      {
        title: "Digestive Aids Tour",
        description: "Learn about herbs that promote healthy digestion and gut wellness in traditional medicine.",
        imageUrl: "https://pixabay.com/get/g9dc5f9fc617e442fb01e19e7e8d22adedbeb77d1738b03cf68e56d991dcf8fa19223803bbdaee6044e2f4ef5920dedec4794ffd0cf4945e4439a2768b8a55e3b_1280.jpg",
        plantCount: 10,
        duration: "12 min tour",
        category: "Digestion",
        plantIds: [1, 4, 8]
      }
    ];

    sampleTours.forEach(tour => {
      const id = this.currentTourId++;
      this.tours.set(id, { ...tour, id, plantIds: tour.plantIds || null });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Plant operations
  async getPlants(): Promise<Plant[]> {
    return Array.from(this.plants.values());
  }

  async getPlant(id: number): Promise<Plant | undefined> {
    return this.plants.get(id);
  }

  async searchPlants(query: string): Promise<Plant[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.plants.values()).filter(plant =>
      plant.commonName.toLowerCase().includes(lowerQuery) ||
      plant.botanicalName.toLowerCase().includes(lowerQuery) ||
      plant.medicinalUses.toLowerCase().includes(lowerQuery) ||
      plant.region.toLowerCase().includes(lowerQuery) ||
      plant.category.toLowerCase().includes(lowerQuery)
    );
  }

  async getPlantsByCategory(category: string): Promise<Plant[]> {
    return Array.from(this.plants.values()).filter(plant =>
      plant.category.toLowerCase() === category.toLowerCase()
    );
  }

  async getPlantsByRegion(region: string): Promise<Plant[]> {
    return Array.from(this.plants.values()).filter(plant =>
      plant.region.toLowerCase().includes(region.toLowerCase())
    );
  }

  async createPlant(insertPlant: InsertPlant): Promise<Plant> {
    const id = this.currentPlantId++;
    const plant: Plant = { 
      ...insertPlant, 
      id,
      preparationMethods: insertPlant.preparationMethods || null,
      isPopular: insertPlant.isPopular || null
    };
    this.plants.set(id, plant);
    return plant;
  }

  // Bookmark operations
  async getUserBookmarks(userId: number): Promise<Plant[]> {
    const userBookmarks = Array.from(this.bookmarks.values()).filter(
      bookmark => bookmark.userId === userId
    );
    const bookmarkedPlants = userBookmarks.map(bookmark =>
      this.plants.get(bookmark.plantId)
    ).filter(Boolean) as Plant[];
    return bookmarkedPlants;
  }

  async addBookmark(insertBookmark: InsertBookmark): Promise<UserBookmark> {
    const id = this.currentBookmarkId++;
    const bookmark: UserBookmark = { ...insertBookmark, id };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async removeBookmark(userId: number, plantId: number): Promise<boolean> {
    const bookmark = Array.from(this.bookmarks.entries()).find(
      ([_, b]) => b.userId === userId && b.plantId === plantId
    );
    if (bookmark) {
      this.bookmarks.delete(bookmark[0]);
      return true;
    }
    return false;
  }

  // Notes operations
  async getUserNotes(userId: number): Promise<UserNote[]> {
    return Array.from(this.notes.values()).filter(
      note => note.userId === userId
    );
  }

  async getPlantNotes(userId: number, plantId: number): Promise<UserNote[]> {
    return Array.from(this.notes.values()).filter(
      note => note.userId === userId && note.plantId === plantId
    );
  }

  async addNote(insertNote: InsertNote): Promise<UserNote> {
    const id = this.currentNoteId++;
    const createdAt = new Date().toISOString();
    const note: UserNote = { ...insertNote, id, createdAt };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: number, noteText: string): Promise<UserNote | undefined> {
    const note = this.notes.get(id);
    if (note) {
      const updatedNote = { ...note, note: noteText };
      this.notes.set(id, updatedNote);
      return updatedNote;
    }
    return undefined;
  }

  async deleteNote(id: number): Promise<boolean> {
    return this.notes.delete(id);
  }

  // Virtual tours
  async getVirtualTours(): Promise<VirtualTour[]> {
    return Array.from(this.tours.values());
  }

  async getVirtualTour(id: number): Promise<VirtualTour | undefined> {
    return this.tours.get(id);
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getPlants(): Promise<Plant[]> {
    return await db.select().from(plants);
  }

  async getPlant(id: number): Promise<Plant | undefined> {
    const [plant] = await db.select().from(plants).where(eq(plants.id, id));
    return plant;
  }

  async searchPlants(query: string): Promise<Plant[]> {
    // Using MemStorage implementation for search as it's already implemented
    const memStorage = new MemStorage();
    return await memStorage.searchPlants(query);
  }

  async getPlantsByCategory(category: string): Promise<Plant[]> {
    return await db.select().from(plants).where(eq(plants.category, category));
  }

  async getPlantsByRegion(region: string): Promise<Plant[]> {
    return await db.select().from(plants).where(eq(plants.region, region));
  }

  async createPlant(insertPlant: InsertPlant): Promise<Plant> {
    const [plant] = await db.insert(plants).values(insertPlant).returning();
    return plant;
  }

  async getUserBookmarks(userId: string): Promise<Plant[]> {
    const bookmarkedPlants = await db
      .select({ plant: plants })
      .from(userBookmarks)
      .innerJoin(plants, eq(userBookmarks.plantId, plants.id))
      .where(eq(userBookmarks.userId, userId));
    
    return bookmarkedPlants.map(item => item.plant);
  }

  async addBookmark(bookmark: InsertBookmark): Promise<UserBookmark> {
    const [newBookmark] = await db.insert(userBookmarks).values(bookmark).returning();
    return newBookmark;
  }

  async removeBookmark(userId: string, plantId: number): Promise<boolean> {
    const result = await db
      .delete(userBookmarks)
      .where(eq(userBookmarks.userId, userId) && eq(userBookmarks.plantId, plantId));
    return result.rowCount > 0;
  }

  async getUserNotes(userId: string): Promise<UserNote[]> {
    return await db.select().from(userNotes).where(eq(userNotes.userId, userId));
  }

  async getPlantNotes(userId: string, plantId: number): Promise<UserNote[]> {
    return await db
      .select()
      .from(userNotes)
      .where(eq(userNotes.userId, userId) && eq(userNotes.plantId, plantId));
  }

  async addNote(note: InsertNote): Promise<UserNote> {
    const [newNote] = await db.insert(userNotes).values(note).returning();
    return newNote;
  }

  async updateNote(id: number, noteText: string): Promise<UserNote | undefined> {
    const [updatedNote] = await db
      .update(userNotes)
      .set({ note: noteText })
      .where(eq(userNotes.id, id))
      .returning();
    return updatedNote;
  }

  async deleteNote(id: number): Promise<boolean> {
    const result = await db.delete(userNotes).where(eq(userNotes.id, id));
    return result.rowCount > 0;
  }

  async getVirtualTours(): Promise<VirtualTour[]> {
    return await db.select().from(virtualTours);
  }

  async getVirtualTour(id: number): Promise<VirtualTour | undefined> {
    const [tour] = await db.select().from(virtualTours).where(eq(virtualTours.id, id));
    return tour;
  }
}

// Use database storage in production, memory storage for development
export const storage = process.env.NODE_ENV === "production" 
  ? new DatabaseStorage() 
  : new MemStorage();
