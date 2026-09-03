export type VehicleBrand = "Honda" | "Toyota" | "Custom";
export type ProductCategory =
  | "motorcycles"
  | "cars"
  | "custom"
  | "vehicles"
  | "bikes"
  | "furniture"
  | "footwear"
  | "tech";

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
    name: "Factory Gloss Clearcoat",
    roughness: 0.12,
    metalness: 0.82,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    surcharge: 0,
  },
  matte: {
    type: "matte",
    name: "Heat-Resistant Matte Powdercoat",
    roughness: 0.72,
    metalness: 0.25,
    clearcoat: 0.0,
    surcharge: 350,
  },
  chrome: {
    type: "chrome",
    name: "Mirror Chrome Polished",
    roughness: 0.06,
    metalness: 0.98,
    clearcoat: 0.6,
    clearcoatRoughness: 0.04,
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
  styleOptions?: { id: string; label: string }[];
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

// Curated Honda CG 125 Authentic Colors
export const CURATED_COLOR_SWATCHES = [
  { name: "Classic Gloss Black (OEM)", hex: "#0F172A" },
  { name: "Imperial Red (OEM)", hex: "#991B1B" },
  { name: "Raw Brushed Metal", hex: "#94A3B8" },
  { name: "Saddle Tan Leather", hex: "#78350F" },
  { name: "Factory Chrome / Silver", hex: "#E2E8F0" },
  { name: "Matte Heat Black", hex: "#18181B" },
  { name: "Amber Gold Glow", hex: "#D97706" },
  { name: "Vintage Navy Blue", hex: "#1E3A8A" },
];

export const MODELS_CATALOG: VehicleModel[] = [
  {
    id: "honda_cg125",
    brand: "Honda",
    category: "motorcycles",
    title: "Honda CG 125 (OEM & Custom Spec)",
    subtitle: "Authentic 125cc OHV 4-Stroke Commuter & Cafe Racer",
    badge: "125cc OHV",
    basePrice: 1850,
    cameraDefaults: {
      position: [2.5, 1.25, 2.6],
      target: [0, 0.45, 0],
      fov: 38,
    },
    parts: [
      {
        id: "fuelTank",
        name: "Fuel Tank & Decals",
        icon: "⛽",
        description: "Classic CG 125 teardrop tank with top ridge, Honda wing emblem & striped side covers.",
        defaultColor: "#0F172A", // Classic Black OEM
        defaultMaterial: "gloss",
        swatches: [
          { name: "Classic Gloss Black (OEM)", hex: "#0F172A" },
          { name: "Imperial Red (OEM)", hex: "#991B1B" },
          { name: "Raw Brushed Metal", hex: "#94A3B8" },
          { name: "Vintage Navy Blue", hex: "#1E3A8A" },
          { name: "Sunset Gold", hex: "#D97706" },
        ],
      },
      {
        id: "engine",
        name: "OHV 125cc Engine",
        icon: "⚙️",
        description: "Single-cylinder 4-stroke OHV engine with cylinder cooling fins, HONDA crankcase & kickstarter.",
        defaultColor: "#E2E8F0", // Factory Silver OEM
        defaultMaterial: "chrome",
        swatches: [
          { name: "Factory Silver (OEM)", hex: "#E2E8F0" },
          { name: "Matte Heat Black Powdercoat", hex: "#18181B" },
          { name: "Gunmetal Casing", hex: "#475569" },
        ],
      },
      {
        id: "exhaust",
        name: "Silencer & Exhaust",
        icon: "💨",
        description: "Continuous header pipe with authentic long cylindrical silencer & chrome heat shield.",
        defaultColor: "#F8FAFC", // Mirror Chrome
        defaultMaterial: "chrome",
        swatches: [
          { name: "Classic Long Chrome (OEM)", hex: "#F8FAFC" },
          { name: "Matte Black Scrambler", hex: "#18181B" },
          { name: "Titanium Heat Blue", hex: "#38BDF8" },
        ],
      },
      {
        id: "seat",
        name: "Ribbed Dual Seat",
        icon: "💺",
        description: "Long dual-passenger seat with horizontal heat-pressed ribbed seams & rear HONDA stencil.",
        defaultColor: "#18181B", // Black Ribbed OEM
        defaultMaterial: "matte",
        swatches: [
          { name: "OEM Ribbed Black", hex: "#18181B" },
          { name: "Tuck & Roll Tan Leather", hex: "#78350F" },
          { name: "Oxblood Burgundy", hex: "#450A0A" },
        ],
      },
      {
        id: "wheels",
        name: "Wire Spoke Wheels",
        icon: "🛞",
        description: "18-inch chrome wire spoke rims with center aluminum drum brake hubs & deep-tread tires.",
        defaultColor: "#E2E8F0", // Chrome Spokes
        defaultMaterial: "chrome",
        swatches: [
          { name: "Chrome Wire Spoke (OEM)", hex: "#E2E8F0" },
          { name: "Satin Black Rims", hex: "#0F172A" },
          { name: "Vintage Gold Spoke", hex: "#D97706" },
        ],
      },
      {
        id: "headlight",
        name: "Headlamp & Cluster",
        icon: "💡",
        description: "OEM rectangular headlamp with amber turn signals and dual speedometer/tachometer gauges.",
        defaultColor: "#F8FAFC", // Clear Fluted Glass
        defaultMaterial: "gloss",
        swatches: [
          { name: "OEM Clear Fluted (Rectangular)", hex: "#F8FAFC" },
          { name: "Vintage Yellow Amber (Round Cafe)", hex: "#FACC15" },
          { name: "Modern Smoked Lens", hex: "#475569" },
        ],
        styleOptions: [
          { id: "rectangular", label: "OEM Rectangular" },
          { id: "round", label: "Round Cafe Racer" },
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
];
