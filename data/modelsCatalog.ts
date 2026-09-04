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
  meshPatterns?: string[];
}

export interface VehicleModel {
  id: string;
  brand: VehicleBrand;
  category: "motorcycles" | "cars" | "custom";
  title: string;
  subtitle: string;
  badge: string;
  basePrice: number;
  modelUrl?: string;
  cameraDefaults: {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
  };
  parts: PartDefinition[];
}

// Curated Authentic Colors
export const CURATED_COLOR_SWATCHES = [
  { name: "Classic Gloss Black (OEM)", hex: "#0F172A" },
  { name: "Imperial Red (OEM)", hex: "#991B1B" },
  { name: "Championship White", hex: "#F8FAFC" },
  { name: "Electron Blue Pearl", hex: "#1D4ED8" },
  { name: "Raw Brushed Metal", hex: "#94A3B8" },
  { name: "Saddle Tan Leather", hex: "#78350F" },
  { name: "Factory Chrome / Silver", hex: "#E2E8F0" },
  { name: "Matte Heat Black", hex: "#18181B" },
  { name: "Amber Gold Glow", hex: "#D97706" },
  { name: "Vintage Navy Blue", hex: "#1E3A8A" },
];

export const MODELS_CATALOG: VehicleModel[] = [
  // ==========================================
  // 1. HONDA MOTORCYCLES
  // ==========================================
  {
    id: "honda_cg125",
    brand: "Honda",
    category: "motorcycles",
    title: "Honda CG 125 (OEM & Custom Spec)",
    subtitle: "Authentic 125cc OHV 4-Stroke Commuter & Cafe Racer",
    badge: "125cc OHV",
    basePrice: 1850,
    modelUrl: "/models/cg125.glb",
    cameraDefaults: {
      position: [2.5, 1.25, 2.6],
      target: [0, 0.45, 0],
      fov: 38,
    },
    parts: [
      {
        id: "fuelTank",
        name: "Fuel Tank & Body Panels",
        icon: "⛽",
        description: "Classic CG 125 teardrop tank with top ridge, Honda wing emblem & striped side covers.",
        defaultColor: "#0F172A", // Classic Black OEM
        defaultMaterial: "gloss",
        meshPatterns: ["metalbody", "tank", "sidebits", "rest_metalbody"],
        swatches: [
          { name: "Classic Gloss Black (OEM)", hex: "#0F172A" },
          { name: "Imperial Red (OEM)", hex: "#991B1B" },
          { name: "Raw Brushed Metal", hex: "#94A3B8" },
          { name: "Vintage Navy Blue", hex: "#1E3A8A" },
          { name: "Sunset Gold", hex: "#D97706" },
        ],
      },
      {
        id: "seat",
        name: "Ribbed Dual Seat",
        icon: "💺",
        description: "Long dual-passenger seat with horizontal heat-pressed ribbed seams & rear HONDA stencil.",
        defaultColor: "#18181B", // Black Ribbed OEM
        defaultMaterial: "matte",
        meshPatterns: ["seat", "leather"],
        swatches: [
          { name: "OEM Ribbed Black", hex: "#18181B" },
          { name: "Tuck & Roll Tan Leather", hex: "#78350F" },
          { name: "Oxblood Burgundy", hex: "#450A0A" },
        ],
      },
      {
        id: "engine",
        name: "OHV 125cc Engine",
        icon: "⚙️",
        description: "Single-cylinder 4-stroke OHV engine with cylinder cooling fins, HONDA crankcase & kickstarter.",
        defaultColor: "#E2E8F0", // Factory Silver OEM
        defaultMaterial: "chrome",
        meshPatterns: ["engine", "starthammer", "gearshifter", "casing"],
        swatches: [
          { name: "Factory Silver (OEM)", hex: "#E2E8F0" },
          { name: "Matte Heat Black Powdercoat", hex: "#18181B" },
          { name: "Gunmetal Casing", hex: "#475569" },
        ],
      },
      {
        id: "exhaust",
        name: "Silencer & Header Pipe",
        icon: "💨",
        description: "Continuous header pipe with authentic long cylindrical silencer & chrome heat shield.",
        defaultColor: "#F8FAFC", // Mirror Chrome
        defaultMaterial: "chrome",
        meshPatterns: ["brakepedal", "subframe", "exhaust", "silencer"],
        swatches: [
          { name: "Classic Long Chrome (OEM)", hex: "#F8FAFC" },
          { name: "Matte Black Scrambler", hex: "#18181B" },
          { name: "Titanium Heat Blue", hex: "#38BDF8" },
        ],
      },
      {
        id: "wheels",
        name: "Wire Spoke Wheels",
        icon: "🛞",
        description: "18-inch chrome wire spoke rims with center aluminum drum brake hubs & deep-tread tires.",
        defaultColor: "#E2E8F0", // Chrome Spokes
        defaultMaterial: "chrome",
        meshPatterns: ["wheel", "rubber", "rim"],
        swatches: [
          { name: "Chrome Wire Spoke (OEM)", hex: "#E2E8F0" },
          { name: "Satin Black Rims", hex: "#0F172A" },
          { name: "Vintage Gold Spoke", hex: "#D97706" },
        ],
      },
      {
        id: "headlight",
        name: "Headlamp & Gauges",
        icon: "💡",
        description: "OEM rectangular headlamp with amber turn signals and dual speedometer/tachometer gauges.",
        defaultColor: "#F8FAFC", // Clear Fluted Glass
        defaultMaterial: "gloss",
        meshPatterns: ["headlight", "glass", "speedometer"],
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
    id: "honda_cbr650r",
    brand: "Honda",
    category: "motorcycles",
    title: "Honda CBR 650R Super Sport",
    subtitle: "Inline-4 High-Revving Racing Machine",
    badge: "650cc Inline-4",
    basePrice: 9800,
    modelUrl: "/models/honda_cbr650r.glb",
    cameraDefaults: {
      position: [2.5, 1.2, 2.5],
      target: [0, 0.45, 0],
      fov: 38,
    },
    parts: [
      {
        id: "fairings",
        name: "Race Fairings & Cowl",
        icon: "🏍️",
        description: "Aerodynamic multi-piece race fairings with dual LED headlamp housing.",
        defaultColor: "#DC2626",
        defaultMaterial: "gloss",
        meshPatterns: ["color_m08", "auto", "fairing", "object_1", "object_2"],
        swatches: [
          { name: "Grand Prix Red", hex: "#DC2626" },
          { name: "Matte Gunpowder Black", hex: "#09090B" },
          { name: "Pearl Glare White", hex: "#F8FAFC" },
        ],
      },
      {
        id: "wheels",
        name: "Cast Alloy Wheels",
        icon: "🛞",
        description: "Y-spoke lightweight cast aluminum wheels with racing radial tires.",
        defaultColor: "#09090B",
        defaultMaterial: "matte",
        meshPatterns: ["color_m02", "wheel", "rim", "object_3"],
        swatches: [
          { name: "Satin Black", hex: "#09090B" },
          { name: "Cast Bronze", hex: "#78350F" },
          { name: "Racing Red Rims", hex: "#DC2626" },
        ],
      },
      {
        id: "exhaust",
        name: "4-into-1 Under-Engine Exhaust",
        icon: "💨",
        description: "Compact underslung stubby exhaust collector with titanium finish.",
        defaultColor: "#CBD5E1",
        defaultMaterial: "chrome",
        meshPatterns: ["color_m00", "exhaust", "pipe"],
        swatches: [
          { name: "Titanium Silver", hex: "#CBD5E1" },
          { name: "Matte Black Ceramic", hex: "#18181B" },
        ],
      },
      {
        id: "seat",
        name: "Split Rider Saddle",
        icon: "💺",
        description: "High-density foam aggressive supersport seat.",
        defaultColor: "#18181B",
        defaultMaterial: "matte",
        meshPatterns: ["seat", "auto3"],
        swatches: [
          { name: "Stealth Black", hex: "#18181B" },
          { name: "Red Contrast Stitch", hex: "#991B1B" },
        ],
      },
    ],
  },
  {
    id: "honda_nr750",
    brand: "Honda",
    category: "motorcycles",
    title: "1994 Honda NR750 (Oval Piston)",
    subtitle: "Legendary 32-Valve V4 Engineering Masterpiece",
    badge: "32-Valve V4",
    basePrice: 65000,
    modelUrl: "/models/honda_nr750_1994.glb",
    cameraDefaults: {
      position: [2.6, 1.25, 2.6],
      target: [0, 0.45, 0],
      fov: 38,
    },
    parts: [
      {
        id: "fairings",
        name: "Carbon & Red Fairings",
        icon: "🏍️",
        description: "Fiberglass and carbon composite body with dual under-seat NACA ducts.",
        defaultColor: "#DC2626",
        defaultMaterial: "gloss",
        meshPatterns: ["bike", "chassis"],
        swatches: [
          { name: "NR Racing Red", hex: "#DC2626" },
          { name: "Midnight Obsidian", hex: "#09090B" },
        ],
      },
      {
        id: "rims",
        name: "Magnesium 5-Spoke Rims",
        icon: "🛞",
        description: "Single-sided Pro-Arm magnesium rear wheel and 16-inch front.",
        defaultColor: "#D97706",
        defaultMaterial: "gloss",
        meshPatterns: ["rim", "wheel"],
        swatches: [
          { name: "Factory Magnesium Gold", hex: "#D97706" },
          { name: "Pure Silver", hex: "#E2E8F0" },
        ],
      },
      {
        id: "exhaust",
        name: "Twin Under-Tail Silencers",
        icon: "💨",
        description: "Pioneering under-seat twin-barrel exhaust system.",
        defaultColor: "#CBD5E1",
        defaultMaterial: "chrome",
        meshPatterns: ["exhaust"],
        swatches: [
          { name: "Polished Stainless", hex: "#CBD5E1" },
          { name: "Titanium Blue", hex: "#38BDF8" },
        ],
      },
      {
        id: "brakes",
        name: "Racing Disc Brakes",
        icon: "🛑",
        description: "Twin 310mm floating drilled discs with Nissin calipers.",
        defaultColor: "#F59E0B",
        defaultMaterial: "chrome",
        meshPatterns: ["brake"],
        swatches: [
          { name: "Gold Carrier", hex: "#F59E0B" },
          { name: "Racing Red", hex: "#DC2626" },
        ],
      },
    ],
  },
  {
    id: "honda_shadow_rs",
    brand: "Honda",
    category: "motorcycles",
    title: "2010 Honda Shadow RS 750",
    subtitle: "Liquid-Cooled V-Twin Modern Classic Roadster",
    badge: "745cc V-Twin",
    basePrice: 8200,
    modelUrl: "/models/honda_shadow_rs_2010.glb",
    cameraDefaults: {
      position: [2.7, 1.2, 2.7],
      target: [0, 0.45, 0],
      fov: 38,
    },
    parts: [
      {
        id: "tank",
        name: "Cruiser Teardrop Tank",
        icon: "⛽",
        description: "Classic roadster peanut tank with chrome Honda crest.",
        defaultColor: "#0F172A",
        defaultMaterial: "gloss",
        meshPatterns: ["shadow", "tank", "object_0"],
        swatches: [
          { name: "Gloss Obsidian Black", hex: "#0F172A" },
          { name: "Metallic Pearl White", hex: "#F8FAFC" },
          { name: "Vintage Maroon", hex: "#7F1D1D" },
        ],
      },
      {
        id: "engine",
        name: "V-Twin Engine & Cooling Fins",
        icon: "⚙️",
        description: "745cc 52-degree SOHC liquid-cooled V-Twin with polished cylinder edges.",
        defaultColor: "#CBD5E1",
        defaultMaterial: "chrome",
        meshPatterns: ["chrome", "aluminiumdetails"],
        swatches: [
          { name: "Polished Aluminum", hex: "#CBD5E1" },
          { name: "Matte Black Powdercoat", hex: "#18181B" },
        ],
      },
      {
        id: "exhaust",
        name: "Staggered Dual Chrome Exhaust",
        icon: "💨",
        description: "Classic cruiser dual staggered shotgun exhaust pipes.",
        defaultColor: "#F8FAFC",
        defaultMaterial: "chrome",
        meshPatterns: ["chromedetails", "black_chrome"],
        swatches: [
          { name: "Mirror Chrome", hex: "#F8FAFC" },
          { name: "Ceramic Matte Black", hex: "#18181B" },
        ],
      },
      {
        id: "seat",
        name: "Low-Slung Solo Seat",
        icon: "💺",
        description: "Comfortable ergonomic cruiser saddle.",
        defaultColor: "#78350F",
        defaultMaterial: "matte",
        meshPatterns: ["black_mate", "seat"],
        swatches: [
          { name: "Saddle Tan Leather", hex: "#78350F" },
          { name: "Classic Black", hex: "#18181B" },
        ],
      },
    ],
  },

  // ==========================================
  // 2. HONDA SPORTS CARS
  // ==========================================
  {
    id: "honda_s2000",
    brand: "Honda",
    category: "cars",
    title: "2001 Honda S2000 AP1",
    subtitle: "9000 RPM VTEC F20C High-Revving Roadster",
    badge: "9000 RPM VTEC",
    basePrice: 34000,
    modelUrl: "/models/2001_honda_s2000.glb",
    cameraDefaults: {
      position: [3.8, 1.5, 3.8],
      target: [0, 0.35, 0],
      fov: 38,
    },
    parts: [
      {
        id: "body",
        name: "Roadster Body Paint",
        icon: "🚗",
        description: "50:50 weight distribution lightweight roadster bodywork.",
        defaultColor: "#0284C7",
        defaultMaterial: "gloss",
        meshPatterns: ["coloured", "paint", "base"],
        swatches: [
          { name: "Laguna Blue Pearl", hex: "#0284C7" },
          { name: "Grand Prix White", hex: "#F8FAFC" },
          { name: "Berlina Black", hex: "#09090B" },
          { name: "Rio Yellow Pearl", hex: "#FACC15" },
          { name: "New Formula Red", hex: "#DC2626" },
        ],
      },
      {
        id: "rims",
        name: "TNR Forged 18\" Rims",
        icon: "🛞",
        description: "Ultralightweight track-spec forged aluminum wheels.",
        defaultColor: "#0F172A",
        defaultMaterial: "matte",
        meshPatterns: ["rim", "wheel", "tnr_rim91a"],
        swatches: [
          { name: "Satin Gunmetal", hex: "#0F172A" },
          { name: "Forged Bronze", hex: "#78350F" },
          { name: "Championship White", hex: "#F8FAFC" },
        ],
      },
      {
        id: "calipers",
        name: "Brake Calipers",
        icon: "🛑",
        description: "High-temperature track brake calipers.",
        defaultColor: "#DC2626",
        defaultMaterial: "gloss",
        meshPatterns: ["calliper", "brakedisc"],
        swatches: [
          { name: "Type-R Red", hex: "#DC2626" },
          { name: "Brembo Gold", hex: "#F59E0B" },
          { name: "Acid Green", hex: "#84CC16" },
        ],
      },
      {
        id: "interior",
        name: "Sport Cockpit & Seats",
        icon: "💺",
        description: "Driver-focused cockpit with leather bucket seats.",
        defaultColor: "#991B1B",
        defaultMaterial: "matte",
        meshPatterns: ["interior", "tilling"],
        swatches: [
          { name: "OEM Red Leather", hex: "#991B1B" },
          { name: "Full Black Leather", hex: "#18181B" },
        ],
      },
      {
        id: "carbon",
        name: "Carbon Aerodynamics",
        icon: "⚡",
        description: "Front lip spoiler and rear deck aero elements.",
        defaultColor: "#18181B",
        defaultMaterial: "matte",
        meshPatterns: ["carbon"],
        swatches: [
          { name: "Exposed Carbon Weave", hex: "#18181B" },
          { name: "Body Matched", hex: "#0284C7" },
        ],
      },
    ],
  },
  {
    id: "honda_civic_type_r",
    brand: "Honda",
    category: "cars",
    title: "Honda Civic Type-R",
    subtitle: "Turbocharged Hot Hatch Aerodynamic Track Edition",
    badge: "K20C1 Turbo",
    basePrice: 44000,
    modelUrl: "/models/honda_civic_type-r.glb",
    cameraDefaults: {
      position: [4.0, 1.6, 4.0],
      target: [0, 0.35, 0],
      fov: 38,
    },
    parts: [
      {
        id: "body",
        name: "Championship White Paint",
        icon: "🚗",
        description: "Track-tuned aerodynamic widebody with vortex generators.",
        defaultColor: "#F8FAFC",
        defaultMaterial: "gloss",
        meshPatterns: ["material.001", "material.002", "paint", "object_0", "object_1"],
        swatches: [
          { name: "Championship White", hex: "#F8FAFC" },
          { name: "Sonic Gray Pearl", hex: "#64748B" },
          { name: "Rallye Red", hex: "#DC2626" },
          { name: "Boost Blue", hex: "#0284C7" },
          { name: "Crystal Black", hex: "#09090B" },
        ],
      },
      {
        id: "rims",
        name: "20\" Piano Black Rims",
        icon: "🛞",
        description: "20-inch lightweight aluminum alloy wheels with red pinstripe.",
        defaultColor: "#09090B",
        defaultMaterial: "gloss",
        meshPatterns: ["material.004", "tyre", "rim"],
        swatches: [
          { name: "Piano Black", hex: "#09090B" },
          { name: "Championship White", hex: "#F8FAFC" },
          { name: "Matte Bronze", hex: "#78350F" },
        ],
      },
      {
        id: "splitter",
        name: "Carbon Splitter & Wing",
        icon: "⚡",
        description: "Functional downforce front splitter, side sills and high-mount wing.",
        defaultColor: "#18181B",
        defaultMaterial: "matte",
        meshPatterns: ["material.003", "material.006"],
        swatches: [
          { name: "Carbon Fiber", hex: "#18181B" },
          { name: "Body Matched", hex: "#F8FAFC" },
        ],
      },
      {
        id: "exhaust",
        name: "Triple Center Exhaust",
        icon: "💨",
        description: "Signature triple center-mounted stainless steel exhaust pipes.",
        defaultColor: "#CBD5E1",
        defaultMaterial: "chrome",
        meshPatterns: ["exhaust_color", "exhaust"],
        swatches: [
          { name: "Polished Chrome", hex: "#CBD5E1" },
          { name: "Burnt Titanium Tip", hex: "#38BDF8" },
        ],
      },
    ],
  },
  {
    id: "honda_civic_si_99",
    brand: "Honda",
    category: "cars",
    title: "1999 Honda Civic Si (EM1)",
    subtitle: "Golden Era B16A2 DOHC VTEC Coupe Icon",
    badge: "B16A2 DOHC",
    basePrice: 18000,
    modelUrl: "/models/1999_honda_civic_si.glb",
    cameraDefaults: {
      position: [3.9, 1.5, 3.9],
      target: [0, 0.35, 0],
      fov: 38,
    },
    parts: [
      {
        id: "body",
        name: "Electron Blue Pearl Paint",
        icon: "🚗",
        description: "Classic EM1 Civic Si aerodynamic coupe bodywork.",
        defaultColor: "#1D4ED8",
        defaultMaterial: "gloss",
        meshPatterns: ["carpaint", "body"],
        swatches: [
          { name: "Electron Blue Pearl (OEM)", hex: "#1D4ED8" },
          { name: "Milano Red (OEM)", hex: "#DC2626" },
          { name: "Flamenco Black (OEM)", hex: "#09090B" },
          { name: "Taffeta White", hex: "#F8FAFC" },
        ],
      },
      {
        id: "bumper",
        name: "Front Bumper & Lip",
        icon: "⚡",
        description: "Factory OEM Civic Si color-matched front spoiler lip.",
        defaultColor: "#1D4ED8",
        defaultMaterial: "gloss",
        meshPatterns: ["bumperfa_body", "bumper"],
        swatches: [
          { name: "Body Color Matched", hex: "#1D4ED8" },
          { name: "Satin Black Lip", hex: "#09090B" },
        ],
      },
      {
        id: "trim",
        name: "Chrome Emblems & Trim",
        icon: "✨",
        description: "Factory Honda 'H' and DOHC VTEC side emblems.",
        defaultColor: "#E2E8F0",
        defaultMaterial: "chrome",
        meshPatterns: ["ext_metal", "emblem"],
        swatches: [
          { name: "Factory Chrome", hex: "#E2E8F0" },
          { name: "Red 'H' Badge", hex: "#DC2626" },
        ],
      },
      {
        id: "tint",
        name: "Ceramic Window Tint",
        icon: "🪟",
        description: "UV privacy window film.",
        defaultColor: "#1E293B",
        defaultMaterial: "gloss",
        meshPatterns: ["window", "glass"],
        swatches: [
          { name: "Smoke 35%", hex: "#1E293B" },
          { name: "Limo 5%", hex: "#020617" },
          { name: "Clear Glass", hex: "#94A3B8" },
        ],
      },
    ],
  },
  {
    id: "honda_civic_eg6",
    brand: "Honda",
    category: "cars",
    title: "1991 Honda Civic SiR II (EG6)",
    subtitle: "B16A Lightweight VTEC Legend Hatchback",
    badge: "EG6 B16A",
    basePrice: 16500,
    modelUrl: "/models/1991_honda_civic_eg6.glb",
    cameraDefaults: {
      position: [3.8, 1.45, 3.8],
      target: [0, 0.35, 0],
      fov: 38,
    },
    parts: [
      {
        id: "body",
        name: "Captiva Blue / Milano Red Paint",
        icon: "🚗",
        description: "Lightweight 1050kg aerodynamic hatchback body.",
        defaultColor: "#991B1B",
        defaultMaterial: "gloss",
        meshPatterns: ["carpaint", "body", "paint"],
        swatches: [
          { name: "Milano Red (OEM)", hex: "#991B1B" },
          { name: "Captiva Blue (OEM)", hex: "#0284C7" },
          { name: "Frost White", hex: "#F8FAFC" },
          { name: "Flint Black Metallic", hex: "#09090B" },
        ],
      },
      {
        id: "rims",
        name: "Spoon Lightweight Wheels",
        icon: "🛞",
        description: "15-inch Spoon SW388 matte black wheels.",
        defaultColor: "#0F172A",
        defaultMaterial: "matte",
        meshPatterns: ["wheel", "rim"],
        swatches: [
          { name: "Spoon Matte Black", hex: "#0F172A" },
          { name: "Spoon Championship White", hex: "#F8FAFC" },
        ],
      },
      {
        id: "hood",
        name: "Carbon Fiber Bonnet",
        icon: "⚡",
        description: "Lightweight vented carbon fiber hood.",
        defaultColor: "#18181B",
        defaultMaterial: "matte",
        meshPatterns: ["hood", "carbon", "bonnet"],
        swatches: [
          { name: "Twill Carbon Weave", hex: "#18181B" },
          { name: "Body Matched", hex: "#991B1B" },
        ],
      },
    ],
  },
  {
    id: "honda_integra_type_r",
    brand: "Honda",
    category: "cars",
    title: "Honda Integra Type-R (DB8 4-Door)",
    subtitle: "Factory Hand-Ported B18C 4-Door Sedan Track Weapon",
    badge: "B18C Spec-R",
    basePrice: 26000,
    modelUrl: "/models/honda_integra_db8_type-r.glb",
    cameraDefaults: {
      position: [4.1, 1.5, 4.1],
      target: [0, 0.35, 0],
      fov: 38,
    },
    parts: [
      {
        id: "body",
        name: "Championship White Paint",
        icon: "🚗",
        description: "Reinforced chassis with factory seam welding.",
        defaultColor: "#F8FAFC",
        defaultMaterial: "gloss",
        meshPatterns: ["body_paint", "paint"],
        swatches: [
          { name: "Championship White", hex: "#F8FAFC" },
          { name: "Phoenix Yellow", hex: "#FACC15" },
          { name: "Nighthawk Black Pearl", hex: "#09090B" },
        ],
      },
      {
        id: "wheels",
        name: "Enkei Championship Wheels",
        icon: "🛞",
        description: "15-inch lightweight factory Championship White wheels.",
        defaultColor: "#F8FAFC",
        defaultMaterial: "gloss",
        meshPatterns: ["wheel_metal", "wheel"],
        swatches: [
          { name: "Championship White", hex: "#F8FAFC" },
          { name: "Gunmetal Grey", hex: "#475569" },
        ],
      },
      {
        id: "exhaust",
        name: "Stainless Steel Exhaust",
        icon: "💨",
        description: "High-flow stainless steel tubular header and catback.",
        defaultColor: "#CBD5E1",
        defaultMaterial: "chrome",
        meshPatterns: ["exhaust_metal", "exhaust"],
        swatches: [
          { name: "Polished Stainless", hex: "#CBD5E1" },
          { name: "Burnt Titanium", hex: "#38BDF8" },
        ],
      },
      {
        id: "calipers",
        name: "Type-R Red Calipers",
        icon: "🛑",
        description: "5-lug oversized track brake calipers.",
        defaultColor: "#DC2626",
        defaultMaterial: "gloss",
        meshPatterns: ["brake_disc", "brake"],
        swatches: [
          { name: "Brembo Red", hex: "#DC2626" },
          { name: "Factory Silver", hex: "#CBD5E1" },
        ],
      },
    ],
  },
  {
    id: "honda_s800",
    brand: "Honda",
    category: "cars",
    title: "Honda S800 Vintage Sports Coupe",
    subtitle: "Classic 10,000 RPM Needle Roller Bearing Sports Car",
    badge: "10k RPM Classic",
    basePrice: 42000,
    modelUrl: "/models/honda_s800.glb",
    cameraDefaults: {
      position: [3.6, 1.4, 3.6],
      target: [0, 0.35, 0],
      fov: 38,
    },
    parts: [
      {
        id: "body",
        name: "Scarlett Red / Racing Yellow",
        icon: "🚗",
        description: "Classic 1960s streamlined sports coupe.",
        defaultColor: "#DC2626",
        defaultMaterial: "gloss",
        meshPatterns: ["ext_paint", "paint", "object_0"],
        swatches: [
          { name: "Scarlett Red (OEM)", hex: "#DC2626" },
          { name: "Carnival Yellow (OEM)", hex: "#FACC15" },
          { name: "British Racing Green", hex: "#14532D" },
          { name: "Classic Ivory White", hex: "#F8FAFC" },
        ],
      },
      {
        id: "chrome",
        name: "Chrome Bumpers & Grille",
        icon: "✨",
        description: "1960s mirror-polished chrome bumperettes and horizontal slat grille.",
        defaultColor: "#F8FAFC",
        defaultMaterial: "chrome",
        meshPatterns: ["ext_hubcaps", "int_chrome", "chrome_mat", "ext_grille"],
        swatches: [
          { name: "Mirror Chrome", hex: "#F8FAFC" },
          { name: "Satin Nickel", hex: "#CBD5E1" },
        ],
      },
      {
        id: "interior",
        name: "Retro Leather & Wood Cockpit",
        icon: "💺",
        description: "Wood-rimmed 3-spoke steering wheel and fluted leather seats.",
        defaultColor: "#78350F",
        defaultMaterial: "matte",
        meshPatterns: ["stw_wood", "int_leather_mat"],
        swatches: [
          { name: "Vintage Cognac Leather", hex: "#78350F" },
          { name: "Oxblood Leather", hex: "#450A0A" },
          { name: "Classic Black", hex: "#18181B" },
        ],
      },
      {
        id: "wheels",
        name: "Steel Wheels with Chrome Hubcaps",
        icon: "🛞",
        description: "Period-correct slotted steel wheels with chrome 'H' embossed center caps.",
        defaultColor: "#E2E8F0",
        defaultMaterial: "chrome",
        meshPatterns: ["ext_rims", "hubcaps"],
        swatches: [
          { name: "Chrome Hubcaps", hex: "#E2E8F0" },
          { name: "Racing Silver", hex: "#94A3B8" },
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
    ],
  },
];

