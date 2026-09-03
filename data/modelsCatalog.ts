export type VehicleBrand = "Honda" | "Toyota" | "Custom";
export type ProductCategory = "motorcycles" | "cars" | "custom" | "vehicles" | "bikes" | "furniture" | "footwear" | "tech";

export type StudioMaterialType =
  | "gloss"
  | "matte"
  | "chrome";

export interface StudioMaterialProperties {
  type: StudioMaterialType;
  name: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness?: number;
  surcharge: number;
}

export const STUDIO_MATERIALS: Record<StudioMaterialType, StudioMaterialProperties> = {
  gloss: {
    type: "gloss",
    name: "High Gloss Clearcoat",
    roughness: 0.12,
    metalness: 0.82,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    surcharge: 0,
  },
  matte: {
    type: "matte",
    name: "Matte Powdercoat",
    roughness: 0.72,
    metalness: 0.25,
    clearcoat: 0.0,
    surcharge: 350,
  },
  chrome: {
    type: "chrome",
    name: "Chrome / Polished Metallic",
    roughness: 0.08,
    metalness: 0.98,
    clearcoat: 0.6,
    clearcoatRoughness: 0.05,
    surcharge: 450,
  },
};

export interface PartDefinition {
  id: string;
  name: string;
  icon?: string;
  description: string;
  defaultColor: string;
  defaultMaterial: StudioMaterialType;
  swatches?: { name: string; hex: string }[];
}

export interface VehicleModel {
  id: string;
  brand: VehicleBrand;
  category: "motorcycles" | "cars" | "custom";
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

// 8 Universal Automotive Studio Color Swatches
export const CURATED_COLOR_SWATCHES = [
  { name: "Imperial Red", hex: "#991B1B" },
  { name: "Midnight Obsidian", hex: "#0F172A" },
  { name: "British Racing Green", hex: "#064E3B" },
  { name: "Raw Brushed Silver", hex: "#94A3B8" },
  { name: "Pure Showroom White", hex: "#F8FAFC" },
  { name: "Vintage Tan Leather", hex: "#78350F" },
  { name: "Sunset Amber Gold", hex: "#D97706" },
  { name: "Horizon Electric Blue", hex: "#0284C7" },
];

export const MODELS_CATALOG: VehicleModel[] = [
  {
    id: "honda_cg125",
    brand: "Honda",
    category: "motorcycles",
    title: "Honda CG 125 / Modern Cafe Racer",
    subtitle: "Custom Neo-Retro Tuning & Scrambler Spec",
    badge: "125cc Custom",
    basePrice: 2200,
    cameraDefaults: {
      position: [2.8, 1.4, 3.0],
      target: [0, 0.4, 0],
      fov: 38,
    },
    parts: [
      {
        id: "fuelTank",
        name: "Fuel Tank",
        icon: "⛽",
        description: "Teardrop cafe tank with knee indents and vintage pinstripes.",
        defaultColor: "#991B1B",
        defaultMaterial: "gloss",
        swatches: [
          { name: "Imperial Red", hex: "#991B1B" },
          { name: "Midnight Black", hex: "#0F172A" },
          { name: "Racing Green", hex: "#064E3B" },
          { name: "Brushed Steel", hex: "#94A3B8" },
          { name: "Sunset Gold", hex: "#D97706" },
        ],
      },
      {
        id: "seat",
        name: "Seat Leather",
        icon: "💺",
        description: "Handcrafted tuck & roll ribbed waterproof leather saddle.",
        defaultColor: "#78350F",
        defaultMaterial: "matte",
        swatches: [
          { name: "Saddle Tan", hex: "#78350F" },
          { name: "Matte Black", hex: "#18181B" },
          { name: "Oxblood Red", hex: "#450A0A" },
          { name: "Vintage Cream", hex: "#FEF3C7" },
        ],
      },
      {
        id: "engine",
        name: "Engine Block",
        icon: "⚙️",
        description: "Single-cylinder 4-stroke OHV engine with cylinder cooling fins.",
        defaultColor: "#E2E8F0",
        defaultMaterial: "chrome",
        swatches: [
          { name: "Chrome Polished", hex: "#E2E8F0" },
          { name: "Powdercoat Black", hex: "#18181B" },
          { name: "Gunmetal Grey", hex: "#475569" },
        ],
      },
      {
        id: "exhaust",
        name: "Exhaust & Muffler",
        icon: "💨",
        description: "Swept-up reverse-cone megaphone exhaust pipe.",
        defaultColor: "#F1F5F9",
        defaultMaterial: "chrome",
        swatches: [
          { name: "Classic Chrome", hex: "#F1F5F9" },
          { name: "Matte Heat Black", hex: "#18181B" },
          { name: "Titanium Heat Blue", hex: "#38BDF8" },
        ],
      },
      {
        id: "wheels",
        name: "Spoke Wheels",
        icon: "🛞",
        description: "Heavy-duty wire-spoked alloy rims with cafe road tires.",
        defaultColor: "#0F172A",
        defaultMaterial: "matte",
        swatches: [
          { name: "Satin Black", hex: "#0F172A" },
          { name: "Chrome Wire", hex: "#E2E8F0" },
          { name: "Vintage Gold", hex: "#D97706" },
        ],
      },
      {
        id: "headlight",
        name: "Headlight & Visor",
        icon: "💡",
        description: "Classic 7-inch round headlight with protective grill and tinted lens.",
        defaultColor: "#FACC15",
        defaultMaterial: "gloss",
        swatches: [
          { name: "Vintage Yellow", hex: "#FACC15" },
          { name: "Modern Clear", hex: "#F8FAFC" },
          { name: "Amber Glow", hex: "#F97316" },
        ],
      },
      {
        id: "handlebars",
        name: "Handlebars",
        icon: "🏍️",
        description: "Low-rise clip-on cafe racer bars with retro rubber grips.",
        defaultColor: "#18181B",
        defaultMaterial: "matte",
        swatches: [
          { name: "Tracker Black", hex: "#18181B" },
          { name: "Chrome Polished", hex: "#E2E8F0" },
        ],
      },
    ],
  },
  {
    id: "toyota_supra",
    brand: "Toyota",
    category: "cars",
    title: "Toyota GR Supra / Sports GT",
    subtitle: "Gazoo Racing Twin-Scroll Turbo Track Spec",
    badge: "GR Track Spec",
    basePrice: 56000,
    cameraDefaults: {
      position: [4.4, 1.8, 4.6],
      target: [0, 0.4, 0],
      fov: 38,
    },
    parts: [
      {
        id: "body",
        name: "Body Paint",
        icon: "🚗",
        description: "Aerodynamic multi-coat metallic body finish.",
        defaultColor: "#DC2626",
        defaultMaterial: "gloss",
        swatches: [
          { name: "Renaissance Red", hex: "#DC2626" },
          { name: "Phantom Matte Grey", hex: "#4B5563" },
          { name: "Nocturnal Black", hex: "#09090B" },
          { name: "Nitro Yellow", hex: "#EAB308" },
          { name: "Horizon Blue", hex: "#0284C7" },
          { name: "Absolute White", hex: "#F8FAFC" },
        ],
      },
      {
        id: "rims",
        name: "BBS Alloy Wheels",
        icon: "🛞",
        description: "19-inch forged twin-spoke matte/gloss alloy wheels.",
        defaultColor: "#09090B",
        defaultMaterial: "matte",
        swatches: [
          { name: "Piano Black", hex: "#09090B" },
          { name: "BBS Silver", hex: "#CBD5E1" },
          { name: "Forged Bronze", hex: "#78350F" },
        ],
      },
      {
        id: "calipers",
        name: "Brembo Calipers",
        icon: "🛑",
        description: "4-piston front opposed brake calipers with high-temp enamel.",
        defaultColor: "#DC2626",
        defaultMaterial: "gloss",
        swatches: [
          { name: "Brembo Red", hex: "#DC2626" },
          { name: "Acid Lime", hex: "#84CC16" },
          { name: "Competition Gold", hex: "#F59E0B" },
        ],
      },
      {
        id: "tint",
        name: "Window Tint",
        icon: "🪟",
        description: "UV-reflective ceramic privacy window glass tint.",
        defaultColor: "#334155",
        defaultMaterial: "gloss",
        swatches: [
          { name: "Smoke 35%", hex: "#334155" },
          { name: "Limo 5%", hex: "#020617" },
          { name: "Clear 90%", hex: "#94A3B8" },
        ],
      },
      {
        id: "aero",
        name: "Aero Diffusers",
        icon: "⚡",
        description: "Carbon fiber front splitter, side skirts, and rear deck spoiler.",
        defaultColor: "#18181B",
        defaultMaterial: "matte",
        swatches: [
          { name: "Exposed Carbon", hex: "#18181B" },
          { name: "Body Matched", hex: "#DC2626" },
        ],
      },
    ],
  },
  {
    id: "toyota_corolla_gr",
    brand: "Toyota",
    category: "cars",
    title: "Toyota GR Corolla Rally Edition",
    subtitle: "GR-FOUR All-Wheel-Drive Hot Hatch",
    badge: "GR-FOUR AWD",
    basePrice: 38500,
    cameraDefaults: {
      position: [4.2, 1.8, 4.4],
      target: [0, 0.4, 0],
      fov: 38,
    },
    parts: [
      {
        id: "body",
        name: "Body Paint",
        icon: "🚗",
        description: "Widebody flared rally exterior paint finish.",
        defaultColor: "#F8FAFC",
        defaultMaterial: "gloss",
        swatches: [
          { name: "Ice Cap White", hex: "#F8FAFC" },
          { name: "Supersonic Red", hex: "#DC2626" },
          { name: "Black Metal", hex: "#09090B" },
          { name: "Heavy Metal Grey", hex: "#475569" },
        ],
      },
      {
        id: "rims",
        name: "Enkei Rally Wheels",
        icon: "🛞",
        description: "18-inch gloss black 15-spoke cast alloy wheels.",
        defaultColor: "#09090B",
        defaultMaterial: "gloss",
        swatches: [
          { name: "Gloss Black", hex: "#09090B" },
          { name: "Rally White", hex: "#F8FAFC" },
          { name: "Tarmac Bronze", hex: "#78350F" },
        ],
      },
      {
        id: "calipers",
        name: "GR Calipers",
        icon: "🛑",
        description: "Red-painted 4-piston ventilated disc brake calipers.",
        defaultColor: "#DC2626",
        defaultMaterial: "gloss",
        swatches: [
          { name: "GR Red", hex: "#DC2626" },
          { name: "Stealth Grey", hex: "#475569" },
        ],
      },
      {
        id: "tint",
        name: "Privacy Glass",
        icon: "🪟",
        description: "Factory privacy glass on rear doors and liftgate.",
        defaultColor: "#334155",
        defaultMaterial: "gloss",
        swatches: [
          { name: "Deep Smoke", hex: "#334155" },
          { name: "Clear Glass", hex: "#94A3B8" },
        ],
      },
      {
        id: "aero",
        name: "Rally Roof & Wing",
        icon: "⚡",
        description: "Forged carbon fiber composite roof and high-downforce spoiler.",
        defaultColor: "#18181B",
        defaultMaterial: "matte",
        swatches: [
          { name: "Forged Carbon", hex: "#18181B" },
          { name: "Body Matched", hex: "#F8FAFC" },
        ],
      },
    ],
  },
];
