export type ProductCategory = "vehicles" | "bikes" | "furniture" | "footwear" | "tech" | "custom";

export type StudioMaterialType =
  | "matte"
  | "metallic"
  | "gloss"
  | "leather_fabric"
  | "carbon";

export interface StudioMaterialProperties {
  type: StudioMaterialType;
  name: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  transmission?: number;
  surcharge: number;
}

export const STUDIO_MATERIALS: Record<StudioMaterialType, StudioMaterialProperties> = {
  matte: {
    type: "matte",
    name: "Matte Finish",
    roughness: 0.85,
    metalness: 0.05,
    clearcoat: 0.0,
    surcharge: 0,
  },
  metallic: {
    type: "metallic",
    name: "Metallic / Anodized",
    roughness: 0.22,
    metalness: 0.9,
    clearcoat: 0.5,
    surcharge: 450,
  },
  gloss: {
    type: "gloss",
    name: "High Gloss / Clearcoat",
    roughness: 0.08,
    metalness: 0.15,
    clearcoat: 1.0,
    surcharge: 250,
  },
  leather_fabric: {
    type: "leather_fabric",
    name: "Leather / Textured Fabric",
    roughness: 0.95,
    metalness: 0.02,
    clearcoat: 0.0,
    surcharge: 350,
  },
  carbon: {
    type: "carbon",
    name: "Forged Carbon Weave",
    roughness: 0.35,
    metalness: 0.6,
    clearcoat: 0.7,
    surcharge: 650,
  },
};

export interface PartDefinition {
  id: string;
  name: string;
  description: string;
  defaultColor: string;
  defaultMaterial: StudioMaterialType;
}

export interface ProductModel {
  id: string;
  category: ProductCategory;
  title: string;
  subtitle: string;
  badge: string;
  basePrice: number;
  cameraDefaults: {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
  };
  parts: PartDefinition[];
}

export const CURATED_COLOR_SWATCHES = [
  { name: "Liquid Stealth", hex: "#11141A" },
  { name: "Pure Titanium", hex: "#E2E8F0" },
  { name: "Cyberpunk Cyan", hex: "#00F0FF" },
  { name: "Laser Crimson", hex: "#EF4444" },
  { name: "Hyper Gold", hex: "#F59E0B" },
  { name: "British Racing Green", hex: "#047857" },
  { name: "Monaco Blue", hex: "#1D4ED8" },
  { name: "Neon Acid", hex: "#A3E635" },
  { name: "Ultra Violet", hex: "#8B5CF6" },
  { name: "Saddle Tan", hex: "#B45309" },
];

export const MODELS_CATALOG: ProductModel[] = [
  {
    id: "car_gtx",
    category: "vehicles",
    title: "Apex GT-X Hypercar",
    subtitle: "Aerodynamic Electric Supercar Concept",
    badge: "Supercar",
    basePrice: 89000,
    cameraDefaults: {
      position: [4.2, 2.2, 4.8],
      target: [0, 0.4, 0],
      fov: 42,
    },
    parts: [
      {
        id: "body",
        name: "Exterior Body",
        description: "Lightweight aerodynamic carbon-composite body panels.",
        defaultColor: "#00F0FF",
        defaultMaterial: "gloss",
      },
      {
        id: "rims",
        name: "Forged Aero Rims",
        description: "21-inch forged magnesium turbine alloy wheels.",
        defaultColor: "#11141A",
        defaultMaterial: "metallic",
      },
      {
        id: "windows",
        name: "Cockpit Glass",
        description: "Electrochromic tinted smart acoustic glass.",
        defaultColor: "#0A1118",
        defaultMaterial: "gloss",
      },
      {
        id: "calipers",
        name: "Brake Calipers",
        description: "6-piston carbon ceramic braking system calipers.",
        defaultColor: "#EF4444",
        defaultMaterial: "metallic",
      },
      {
        id: "trim",
        name: "Aero Splitters & Wing",
        description: "Active aerodynamic downforce diffusers and rear spoiler.",
        defaultColor: "#11141A",
        defaultMaterial: "carbon",
      },
    ],
  },
  {
    id: "bike_valkyrie",
    category: "bikes",
    title: "Valkyrie R9 Cafe Racer",
    subtitle: "Modern Neo-Retro Custom Motorcycle",
    badge: "Motorcycle",
    basePrice: 15400,
    cameraDefaults: {
      position: [3.2, 1.6, 3.4],
      target: [0, 0.35, 0],
      fov: 40,
    },
    parts: [
      {
        id: "tank",
        name: "Fuel Tank & Cowl",
        description: "Hand-sculpted aluminum alloy fuel tank and rear cowl.",
        defaultColor: "#EF4444",
        defaultMaterial: "gloss",
      },
      {
        id: "seat",
        name: "Stitched Leather Saddle",
        description: "Diamond-quilted full-grain waterproof leather saddle.",
        defaultColor: "#B45309",
        defaultMaterial: "leather_fabric",
      },
      {
        id: "frame",
        name: "Trellis Chassis Frame",
        description: "Laser-cut chrome-moly tubular trellis structural frame.",
        defaultColor: "#11141A",
        defaultMaterial: "matte",
      },
      {
        id: "exhaust",
        name: "Exhaust Header & Pipe",
        description: "Lightweight titanium tuned megaphone exhaust system.",
        defaultColor: "#E2E8F0",
        defaultMaterial: "metallic",
      },
      {
        id: "wheels",
        name: "Wire-Spoke Rims",
        description: "High-strength lightweight forged wire-spoke wheels.",
        defaultColor: "#11141A",
        defaultMaterial: "metallic",
      },
    ],
  },
  {
    id: "sofa_haven",
    category: "furniture",
    title: "Nordic Haven 3-Seater",
    subtitle: "Modern Scandinavian Architectural Sofa",
    badge: "Interior",
    basePrice: 2850,
    cameraDefaults: {
      position: [3.4, 2.0, 3.6],
      target: [0, 0.4, 0],
      fov: 42,
    },
    parts: [
      {
        id: "fabric",
        name: "Main Upholstery Fabric",
        description: "Heavyweight textured boucle and wool blend upholstery.",
        defaultColor: "#E2E8F0",
        defaultMaterial: "leather_fabric",
      },
      {
        id: "cushions",
        name: "Accent Bolster Cushions",
        description: "High-resilience memory foam support throw cushions.",
        defaultColor: "#047857",
        defaultMaterial: "leather_fabric",
      },
      {
        id: "legs",
        name: "Tapered Support Legs",
        description: "Precision angled solid hardwood or anodized metal legs.",
        defaultColor: "#B45309",
        defaultMaterial: "matte",
      },
      {
        id: "woodTrim",
        name: "Perimeter Base Trim",
        description: "Minimalist Scandinavian solid perimeter plinth base.",
        defaultColor: "#11141A",
        defaultMaterial: "matte",
      },
    ],
  },
  {
    id: "sneaker_apex",
    category: "footwear",
    title: "CyberSneaker Pro X",
    subtitle: "High-Performance Kinetic Footwear",
    badge: "Footwear",
    basePrice: 240,
    cameraDefaults: {
      position: [2.8, 1.5, 3.0],
      target: [0, 0.2, 0],
      fov: 40,
    },
    parts: [
      {
        id: "upperMesh",
        name: "Aeromesh Upper",
        description: "Seamless ballistic aeroweave composite upper chassis.",
        defaultColor: "#11141A",
        defaultMaterial: "carbon",
      },
      {
        id: "sole",
        name: "Outsole & Tread",
        description: "Sculpted geometric polymer high-traction outsole.",
        defaultColor: "#00F0FF",
        defaultMaterial: "matte",
      },
      {
        id: "airPods",
        name: "Kinetic Air Pods",
        description: "Visible energy dampener pressurized cushioning capsules.",
        defaultColor: "#00F0FF",
        defaultMaterial: "gloss",
      },
      {
        id: "laces",
        name: "Laces & Fasteners",
        description: "Magnetic tension speed-lacing system cords.",
        defaultColor: "#EF4444",
        defaultMaterial: "matte",
      },
      {
        id: "accents",
        name: "Downforce Aero Fins",
        description: "Lateral aerodynamic stabilizer wings and emblems.",
        defaultColor: "#E2E8F0",
        defaultMaterial: "metallic",
      },
    ],
  },
  {
    id: "headphones_aura",
    category: "tech",
    title: "Aura Pro Studio Wireless",
    subtitle: "Audiophile Over-Ear Active Noise-Cancelling",
    badge: "Tech Gear",
    basePrice: 420,
    cameraDefaults: {
      position: [2.4, 1.4, 2.6],
      target: [0, 0.35, 0],
      fov: 38,
    },
    parts: [
      {
        id: "earcups",
        name: "Acoustic Earcups",
        description: "Precision CNC milled aluminum acoustic housing cups.",
        defaultColor: "#11141A",
        defaultMaterial: "metallic",
      },
      {
        id: "headband",
        name: "Structural Headband",
        description: "Flexible spring steel band with cushioned silicone arch.",
        defaultColor: "#11141A",
        defaultMaterial: "matte",
      },
      {
        id: "cushions",
        name: "Memory Foam Cushions",
        description: "Ultra-breathable protein leather memory foam ear cushions.",
        defaultColor: "#B45309",
        defaultMaterial: "leather_fabric",
      },
      {
        id: "accents",
        name: "Gimbal Ring & Badges",
        description: "Anodized aluminum pivot joints and laser-engraved rings.",
        defaultColor: "#00F0FF",
        defaultMaterial: "metallic",
      },
    ],
  },
];
