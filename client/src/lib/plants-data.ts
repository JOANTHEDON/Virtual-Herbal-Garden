import type { Plant } from "@shared/schema";

// This file contains the medicinal plants data
// In a real application, this would come from an API or database
export const MEDICINAL_PLANTS: Omit<Plant, "id">[] = [
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
    habitat: "Native to India, grows in dry regions, Mediterranean climates.",
    medicinalUses: "Adaptogen for stress relief, enhances strength, supports immune system.",
    cultivation: "Drought-tolerant plant, grows in sandy soil, requires minimal water.",
    primaryUse: "Powerful adaptogen for stress management and vitality enhancement.",
    category: "Adaptogen",
    imageUrl: "https://images.unsplash.com/photo-1595751746078-40b1c6e4b175?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    modelUrl: "/models/ashwagandha_1752659931972.glb",
    preparationMethods: ["Root powder", "Capsules", "Tea", "Milk decoction"],
    ayushSystem: "Ayurveda",
    isPopular: true
  },
  {
    commonName: "Ginger",
    botanicalName: "Zingiber officinale",
    region: "Southeast Asia",
    habitat: "Native to Southeast Asia, grows in warm, humid climates.",
    medicinalUses: "Digestive aid, anti-nausea, anti-inflammatory, circulation booster.",
    cultivation: "Requires warm climate, well-drained soil, regular watering.",
    primaryUse: "Natural digestive aid and anti-nausea remedy.",
    category: "Digestive",
    imageUrl: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    modelUrl: "/models/ginger_rhizome_1752659969242.glb",
    preparationMethods: ["Fresh root tea", "Dried powder", "Juice", "Oil"],
    ayushSystem: "Ayurveda",
    isPopular: true
  },
  {
    commonName: "Aloe Vera",
    botanicalName: "Aloe barbadensis",
    region: "Africa",
    habitat: "Native to North Africa, grows in arid and semi-arid climates.",
    medicinalUses: "Skin healing, wound treatment, digestive health, anti-inflammatory.",
    cultivation: "Drought-resistant succulent, requires minimal water and sandy soil.",
    primaryUse: "Natural skin healer and soothing agent for burns and wounds.",
    category: "Healing",
    imageUrl: "https://images.unsplash.com/photo-1596363505707-14e1bbdbbc10?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    modelUrl: "/models/aloe_vera_1752659996190.glb",
    preparationMethods: ["Fresh gel", "Juice", "Topical application", "Capsules"],
    ayushSystem: "Ayurveda",
    isPopular: true
  },
  {
    commonName: "Brahmi",
    botanicalName: "Bacopa monnieri",
    region: "India",
    habitat: "Native to India, grows in wetlands and marshy areas.",
    medicinalUses: "Brain tonic, memory enhancer, stress reducer, cognitive support.",
    cultivation: "Aquatic plant, grows in shallow water or very moist soil.",
    primaryUse: "Powerful brain tonic for memory enhancement and cognitive function.",
    category: "Brain Health",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    modelUrl: "/models/brahmi_1752660022307.glb",
    preparationMethods: ["Leaf paste", "Powder", "Oil", "Fresh juice"],
    ayushSystem: "Ayurveda",
    isPopular: true
  },
  {
    commonName: "Tulsi",
    botanicalName: "Ocimum sanctum",
    region: "India",
    habitat: "Native to India, grows in tropical and subtropical regions.",
    medicinalUses: "Sacred herb, respiratory health, stress relief, immunity booster.",
    cultivation: "Easy to grow, requires warm climate and well-drained soil.",
    primaryUse: "Sacred adaptogen for respiratory health and spiritual well-being.",
    category: "Sacred",
    imageUrl: "https://images.unsplash.com/photo-1616251066324-6d5d0ab4a0a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    modelUrl: "/models/tulsi_basil_1752660043152.glb",
    preparationMethods: ["Fresh leaves", "Tea", "Essential oil", "Powder"],
    ayushSystem: "Ayurveda",
    isPopular: true
  },
  {
    commonName: "Amla",
    botanicalName: "Phyllanthus emblica",
    region: "India",
    habitat: "Native to India, grows in tropical and subtropical regions.",
    medicinalUses: "Rich in Vitamin C, immunity booster, hair health, anti-aging.",
    cultivation: "Hardy tree, grows in various soil types, drought tolerant.",
    primaryUse: "Natural source of Vitamin C for immunity and anti-aging benefits.",
    category: "Vitamin C",
    imageUrl: "https://images.unsplash.com/photo-1590019461652-6eec1d86a83c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    modelUrl: "/models/amla_tree_1752660069472.glb",
    preparationMethods: ["Fresh fruit", "Juice", "Powder", "Oil"],
    ayushSystem: "Ayurveda",
    isPopular: true
  }
];

export const PLANT_CATEGORIES = [
  "Anti-inflammatory",
  "Antibacterial", 
  "Adaptogen",
  "Digestive",
  "Healing",
  "Brain Health",
  "Sacred",
  "Vitamin C"
];

export const AYUSH_SYSTEMS = [
  "Ayurveda",
  "Yoga & Naturopathy", 
  "Unani",
  "Siddha",
  "Homeopathy"
];

export const REGIONS = [
  "India",
  "South Asia",
  "Southeast Asia", 
  "Africa",
  "Himalayas"
];
