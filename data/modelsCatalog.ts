export type ProductCategory = "vehicles" | "bikes" | "furniture" | "footwear" | "tech" | "custom";

export type StudioMaterialType =
  | "gloss"
  | "matte"
  | "metallic"
  | "leather_fabric"
  | "carbon";

export interface StudioMaterialProperties {
  type: StudioMaterialType;
  name: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness?: number;
  transmission?: number;
  surcharge: number;
}

export const STUDIO_MATERIALS: Record<StudioMaterialType, StudioMaterialProperties> = {
  gloss: {
    type: "gloss",
    name: "High-Gloss Clearcoat",
    roughness: 0.12,
    metalness: 0.85,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    surcharge: 0,
  },
  matte: {
    type: "matte",
    name: "Satin Matte Finish",
    roughness: 0.75,
    metalness: 0.15,
    clearcoat: 0.0,
    surcharge: 1200,
  },
  metallic: {
    type: "metallic",
    name: "Anodized Metallic",
    roughness: 0.22,
    metalness: 0.95,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    surcharge: 850,
  },
  leather_fabric: {
    type: "leather_fabric",
    name: "Textured Leather / Upholstery",
    roughness: 0.92,
    metalness: 0.05,
    clearcoat: 0.0,
    surcharge: 600,
  },
  carbon: {
    type: "carbon",
    name: "Exposed Carbon Fiber",
    roughness: 0.3,
    metalness: 0.65,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    surcharge: 1500,
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
  modelUrl?: string; // Verified GLB URL
  cameraDefaults: {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
  };
  parts: PartDefinition[];
}

// 8 Curated High-End Luxury Automotive Color Swatches
export const CURATED_COLOR_SWATCHES = [
  { name: "Rosso Corsa (Classic Red)", hex: "#D40000" },
  { name: "Modena Yellow", hex: "#FFD700" },
  { name: "Tour de France Blue", hex: "#0D2F81" },
  { name: "Nero Daytona (Obsidian)", hex: "#0F1115" },
  { name: "Bianco Avus (Chalk White)", hex: "#F4F5F7" },
  { name: "Grigio Silverstone (Titanium)", hex: "#52565E" },
  { name: "Verde British Racing", hex: "#0A4D34" },
  { name: "Arancio Triplo Strato", hex: "#FF5500" },
];

export const MODELS_CATALOG: ProductModel[] = [
  {
    id: "car_gtx",
    category: "vehicles",
    title: "Apex GT-X (Series 01)",
    subtitle: "High-Performance Mid-Engine Supercar",
    badge: "GT Series",
    basePrice: 245000,
    modelUrl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/ferrari.glb",
    cameraDefaults: {
      position: [4.2, 1.6, 4.6],
      target: [0, 0.4, 0],
      fov: 38,
    },
    parts: [
      {
        id: "paint",
        name: "Body Paint",
        description: "Multi-stage metallic paint with clearcoat lacquer.",
        defaultColor: "#D40000",
        defaultMaterial: "gloss",
      },
      {
        id: "rims",
        name: "Alloy Rims",
        description: "20-inch forged lightweight monoblock alloy wheels.",
        defaultColor: "#52565E",
        defaultMaterial: "metallic",
      },
      {
        id: "calipers",
        name: "Brake Calipers",
        description: "High-performance multi-piston ceramic brake calipers.",
        defaultColor: "#FFD700",
        defaultMaterial: "gloss",
      },
      {
        id: "tint",
        name: "Window Tint",
        description: "Acoustic electrochromic privacy glass tint.",
        defaultColor: "#0F1115",
        defaultMaterial: "gloss",
      },
    ],
  },
  {
    id: "bike_valkyrie",
    category: "bikes",
    title: "Valkyrie R9 Superbike",
    subtitle: "Modern Neo-Retro Cafe Racer",
    badge: "Superbike",
    basePrice: 18500,
    cameraDefaults: {
      position: [3.0, 1.4, 3.2],
      target: [0, 0.35, 0],
      fov: 38,
    },
    parts: [
      {
        id: "paint",
        name: "Tank & Fairing",
        description: "Hand-finished aluminum fuel tank and rear cowl.",
        defaultColor: "#D40000",
        defaultMaterial: "gloss",
      },
      {
        id: "rims",
        name: "Spoked Wheels",
        description: "High-strength forged wire-spoke alloy wheels.",
        defaultColor: "#0F1115",
        defaultMaterial: "metallic",
      },
      {
        id: "calipers",
        name: "Frame & Engine",
        description: "Tubular trellis frame and engine casing.",
        defaultColor: "#52565E",
        defaultMaterial: "metallic",
      },
      {
        id: "tint",
        name: "Exhaust Header",
        description: "Tuned titanium megaphone exhaust system.",
        defaultColor: "#F4F5F7",
        defaultMaterial: "metallic",
      },
    ],
  },
  {
    id: "sofa_haven",
    category: "furniture",
    title: "Nordic Haven 3-Seater",
    subtitle: "Architectural Scandinavian Lounge Sofa",
    badge: "Showroom",
    basePrice: 3400,
    cameraDefaults: {
      position: [3.2, 1.8, 3.5],
      target: [0, 0.35, 0],
      fov: 40,
    },
    parts: [
      {
        id: "paint",
        name: "Main Upholstery",
        description: "Premium heavy-weave wool and textured boucle fabric.",
        defaultColor: "#F4F5F7",
        defaultMaterial: "leather_fabric",
      },
      {
        id: "rims",
        name: "Accent Cushions",
        description: "Ergonomic memory-foam support throw bolsters.",
        defaultColor: "#0A4D34",
        defaultMaterial: "leather_fabric",
      },
      {
        id: "calipers",
        name: "Tapered Legs",
        description: "Precision-turned hardwood or brushed metal legs.",
        defaultColor: "#52565E",
        defaultMaterial: "metallic",
      },
      {
        id: "tint",
        name: "Perimeter Trim",
        description: "Solid Scandinavian base platform trim.",
        defaultColor: "#0F1115",
        defaultMaterial: "gloss",
      },
    ],
  },
  {
    id: "sneaker_apex",
    category: "footwear",
    title: "Apex CyberSneaker Pro",
    subtitle: "High-Performance Kinetic Footwear",
    badge: "Footwear",
    basePrice: 280,
    cameraDefaults: {
      position: [2.6, 1.4, 2.8],
      target: [0, 0.2, 0],
      fov: 38,
    },
    parts: [
      {
        id: "paint",
        name: "Aeromesh Upper",
        description: "Lightweight ballistic composite upper chassis.",
        defaultColor: "#0F1115",
        defaultMaterial: "gloss",
      },
      {
        id: "rims",
        name: "Outsole & Tread",
        description: "Sculpted high-traction polymer outsole.",
        defaultColor: "#D40000",
        defaultMaterial: "gloss",
      },
      {
        id: "calipers",
        name: "Energy Dampeners",
        description: "Pressurized kinetic air cushioning capsules.",
        defaultColor: "#FFD700",
        defaultMaterial: "gloss",
      },
      {
        id: "tint",
        name: "Laces & Accents",
        description: "Magnetic speed-lacing tension cords.",
        defaultColor: "#F4F5F7",
        defaultMaterial: "gloss",
      },
    ],
  },
];
