import { create } from "zustand";

export type PartKey = "sole" | "airPods" | "upperMesh" | "collar" | "laces" | "accents" | "heelVent";

export type MaterialType = "matte" | "metallic" | "carbon" | "gloss" | "neon";

export interface MaterialProperties {
  type: MaterialType;
  name: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  emissiveIntensity: number;
  surcharge: number;
}

export const MATERIAL_PRESETS: Record<MaterialType, MaterialProperties> = {
  matte: {
    type: "matte",
    name: "Matte Cyber-Leather",
    roughness: 0.82,
    metalness: 0.08,
    clearcoat: 0.0,
    emissiveIntensity: 0.0,
    surcharge: 0,
  },
  metallic: {
    type: "metallic",
    name: "Anodized Titanium",
    roughness: 0.22,
    metalness: 0.88,
    clearcoat: 0.4,
    emissiveIntensity: 0.0,
    surcharge: 25,
  },
  carbon: {
    type: "carbon",
    name: "Forged Carbon Fiber",
    roughness: 0.32,
    metalness: 0.65,
    clearcoat: 0.7,
    emissiveIntensity: 0.0,
    surcharge: 35,
  },
  gloss: {
    type: "gloss",
    name: "High-Gloss Patent Polymer",
    roughness: 0.06,
    metalness: 0.15,
    clearcoat: 1.0,
    emissiveIntensity: 0.0,
    surcharge: 20,
  },
  neon: {
    type: "neon",
    name: "Overclocked Neon Glow",
    roughness: 0.2,
    metalness: 0.05,
    clearcoat: 0.0,
    emissiveIntensity: 2.4,
    surcharge: 30,
  },
};

export interface PartConfig {
  id: PartKey;
  label: string;
  description: string;
  color: string;
  materialType: MaterialType;
}

export type StudioEnvironment = "cyber_neon_grid" | "studio_clean" | "deep_obsidian" | "holographic_sunset";

export type CameraPreset = "isometric" | "side_profile" | "top_down" | "sole_view" | "front_angle";

export interface PresetTheme {
  id: string;
  name: string;
  badge: string;
  parts: Record<PartKey, { color: string; materialType: MaterialType }>;
}

export const THEME_PRESETS: PresetTheme[] = [
  {
    id: "neo_tokyo",
    name: "Neo Tokyo 2077",
    badge: "Iconic Cyberpunk",
    parts: {
      sole: { color: "#0a0d14", materialType: "matte" },
      airPods: { color: "#00F0FF", materialType: "neon" },
      upperMesh: { color: "#121826", materialType: "carbon" },
      collar: { color: "#1F293D", materialType: "matte" },
      laces: { color: "#FF0055", materialType: "neon" },
      accents: { color: "#00F0FF", materialType: "metallic" },
      heelVent: { color: "#FF0055", materialType: "neon" },
    },
  },
  {
    id: "stealth_obsidian",
    name: "Stealth Obsidian",
    badge: "Covert Military",
    parts: {
      sole: { color: "#0d0d10", materialType: "matte" },
      airPods: { color: "#222226", materialType: "gloss" },
      upperMesh: { color: "#151518", materialType: "carbon" },
      collar: { color: "#0a0a0c", materialType: "matte" },
      laces: { color: "#1a1a1f", materialType: "matte" },
      accents: { color: "#2b2b33", materialType: "metallic" },
      heelVent: { color: "#ff2200", materialType: "neon" },
    },
  },
  {
    id: "hyper_titanium",
    name: "Hyper Titanium",
    badge: "Aerospace Grade",
    parts: {
      sole: { color: "#E8ECF2", materialType: "gloss" },
      airPods: { color: "#00B4D8", materialType: "neon" },
      upperMesh: { color: "#C0C7D6", materialType: "metallic" },
      collar: { color: "#8E9AAF", materialType: "matte" },
      laces: { color: "#0077B6", materialType: "gloss" },
      accents: { color: "#00E5FF", materialType: "metallic" },
      heelVent: { color: "#00B4D8", materialType: "neon" },
    },
  },
  {
    id: "solar_flare",
    name: "Solar Flare X",
    badge: "High Energy",
    parts: {
      sole: { color: "#18181b", materialType: "matte" },
      airPods: { color: "#FFE600", materialType: "neon" },
      upperMesh: { color: "#27272a", materialType: "carbon" },
      collar: { color: "#FF6600", materialType: "gloss" },
      laces: { color: "#FFE600", materialType: "neon" },
      accents: { color: "#FF3300", materialType: "metallic" },
      heelVent: { color: "#FFE600", materialType: "neon" },
    },
  },
  {
    id: "synthwave_sunset",
    name: "Synthwave Sunset",
    badge: "Retro Wave",
    parts: {
      sole: { color: "#1a0b2e", materialType: "matte" },
      airPods: { color: "#FF007F", materialType: "neon" },
      upperMesh: { color: "#2d124d", materialType: "gloss" },
      collar: { color: "#4c1d95", materialType: "matte" },
      laces: { color: "#7B2CBF", materialType: "gloss" },
      accents: { color: "#FF007F", materialType: "metallic" },
      heelVent: { color: "#00F0FF", materialType: "neon" },
    },
  },
  {
    id: "toxic_emerald",
    name: "Toxic Emerald",
    badge: "Bio Hazard",
    parts: {
      sole: { color: "#0a120d", materialType: "matte" },
      airPods: { color: "#00FF66", materialType: "neon" },
      upperMesh: { color: "#0f2316", materialType: "carbon" },
      collar: { color: "#143a21", materialType: "matte" },
      laces: { color: "#39FF14", materialType: "neon" },
      accents: { color: "#00FF66", materialType: "metallic" },
      heelVent: { color: "#39FF14", materialType: "neon" },
    },
  },
];

export const COLOR_PALETTES = [
  { name: "Neon Cyan", hex: "#00F0FF" },
  { name: "Laser Pink", hex: "#FF0055" },
  { name: "Acid Yellow", hex: "#FFE600" },
  { name: "Electric Green", hex: "#00FF66" },
  { name: "Deep Violet", hex: "#8A2BE2" },
  { name: "Sunset Orange", hex: "#FF5E00" },
  { name: "Cobalt Blue", hex: "#0066FF" },
  { name: "Pure Arctic", hex: "#F8FAFC" },
  { name: "Titanium Grey", hex: "#64748B" },
  { name: "Stealth Black", hex: "#0A0C10" },
  { name: "Anodized Gold", hex: "#EAB308" },
  { name: "Blood Crimson", hex: "#DC2626" },
];

export const BASE_PRICE = 199;

interface ConfiguratorState {
  // Parts Configuration
  parts: Record<PartKey, PartConfig>;
  activePart: PartKey;
  hoveredPart: PartKey | null;

  // View & Control States
  environment: StudioEnvironment;
  cameraPreset: CameraPreset;
  cameraTriggerCount: number;
  autoRotate: boolean;
  explodedView: boolean;
  explodedAmount: number;
  wireframe: boolean;
  showHotspots: boolean;
  soundEnabled: boolean;

  // Modal & Snapshot States
  specSheetOpen: boolean;
  capturedImage: string | null;
  configSerialNumber: string;

  // Actions
  setActivePart: (part: PartKey) => void;
  setHoveredPart: (part: PartKey | null) => void;
  setPartColor: (part: PartKey, color: string) => void;
  setPartMaterial: (part: PartKey, materialType: MaterialType) => void;
  applyThemePreset: (presetId: string) => void;
  setEnvironment: (env: StudioEnvironment) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  toggleAutoRotate: () => void;
  toggleExplodedView: () => void;
  setExplodedAmount: (val: number) => void;
  toggleWireframe: () => void;
  toggleHotspots: () => void;
  toggleSound: () => void;
  setSpecSheetOpen: (open: boolean) => void;
  setCapturedImage: (image: string | null) => void;
  generateNewSerial: () => void;
  resetToDefault: () => void;

  // Computed
  getTotalPrice: () => number;
  getPartSurcharge: (part: PartKey) => number;
}

const initialParts: Record<PartKey, PartConfig> = {
  sole: {
    id: "sole",
    label: "Outsole & Tread",
    description: "High-traction cybernetic polymer outsole with shock-damping channels.",
    color: "#0a0d14",
    materialType: "matte",
  },
  airPods: {
    id: "airPods",
    label: "Kinetic Air Pods",
    description: "Overclocked pressurized gas energy suspension units.",
    color: "#00F0FF",
    materialType: "neon",
  },
  upperMesh: {
    id: "upperMesh",
    label: "Upper Aeromesh",
    description: "Multi-layered ballistic micro-weave structural upper.",
    color: "#121826",
    materialType: "carbon",
  },
  collar: {
    id: "collar",
    label: "Ankle Cuff & Liner",
    description: "Ergonomic memory-foam smart compression lock collar.",
    color: "#1F293D",
    materialType: "matte",
  },
  laces: {
    id: "laces",
    label: "Kinetic Lacing",
    description: "High-tensile carbon composite magnetic tension cables.",
    color: "#FF0055",
    materialType: "neon",
  },
  accents: {
    id: "accents",
    label: "Side Wings & Aero Fin",
    description: "Aerodynamic downforce stabilizer fins and brand insignia.",
    color: "#00F0FF",
    materialType: "metallic",
  },
  heelVent: {
    id: "heelVent",
    label: "Rear Exhaust Vent",
    description: "Thermal dissipation heat-sink and cyber-exhaust array.",
    color: "#FF0055",
    materialType: "neon",
  },
};

function createSerial(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "CSPX-";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  code += "-";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  parts: { ...initialParts },
  activePart: "upperMesh",
  hoveredPart: null,

  environment: "cyber_neon_grid",
  cameraPreset: "isometric",
  cameraTriggerCount: 0,
  autoRotate: false,
  explodedView: false,
  explodedAmount: 0,
  wireframe: false,
  showHotspots: true,
  soundEnabled: true,

  specSheetOpen: false,
  capturedImage: null,
  configSerialNumber: createSerial(),

  setActivePart: (part) => set({ activePart: part }),
  setHoveredPart: (part) => set({ hoveredPart: part }),

  setPartColor: (part, color) =>
    set((state) => ({
      parts: {
        ...state.parts,
        [part]: {
          ...state.parts[part],
          color,
        },
      },
    })),

  setPartMaterial: (part, materialType) =>
    set((state) => ({
      parts: {
        ...state.parts,
        [part]: {
          ...state.parts[part],
          materialType,
        },
      },
    })),

  applyThemePreset: (presetId) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    set((state) => {
      const updatedParts = { ...state.parts };
      (Object.keys(preset.parts) as PartKey[]).forEach((key) => {
        updatedParts[key] = {
          ...updatedParts[key],
          color: preset.parts[key].color,
          materialType: preset.parts[key].materialType,
        };
      });
      return { parts: updatedParts, configSerialNumber: createSerial() };
    });
  },

  setEnvironment: (environment) => set({ environment }),

  setCameraPreset: (preset) =>
    set((state) => ({
      cameraPreset: preset,
      cameraTriggerCount: state.cameraTriggerCount + 1,
    })),

  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),
  
  toggleExplodedView: () =>
    set((state) => ({
      explodedView: !state.explodedView,
      explodedAmount: state.explodedView ? 0 : 1,
    })),

  setExplodedAmount: (val) => set({ explodedAmount: val }),
  toggleWireframe: () => set((state) => ({ wireframe: !state.wireframe })),
  toggleHotspots: () => set((state) => ({ showHotspots: !state.showHotspots })),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  setSpecSheetOpen: (open) => set({ specSheetOpen: open }),
  setCapturedImage: (image) => set({ capturedImage: image }),
  generateNewSerial: () => set({ configSerialNumber: createSerial() }),

  resetToDefault: () =>
    set({
      parts: { ...initialParts },
      activePart: "upperMesh",
      cameraPreset: "isometric",
      autoRotate: false,
      explodedView: false,
      explodedAmount: 0,
      wireframe: false,
      configSerialNumber: createSerial(),
    }),

  getPartSurcharge: (part) => {
    const currentPart = get().parts[part];
    if (!currentPart) return 0;
    return MATERIAL_PRESETS[currentPart.materialType].surcharge;
  },

  getTotalPrice: () => {
    const { parts } = get();
    let total = BASE_PRICE;
    (Object.keys(parts) as PartKey[]).forEach((key) => {
      const matType = parts[key].materialType;
      total += MATERIAL_PRESETS[matType].surcharge;
    });
    return total;
  },
}));
