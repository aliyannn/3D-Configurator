import { create } from "zustand";
import {
  VehicleModel,
  MODELS_CATALOG,
  PartDefinition,
  StudioMaterialType,
  STUDIO_MATERIALS,
} from "@/data/modelsCatalog";

export type StudioEnvironment =
  | "studio_neutral"
  | "cyber_neon"
  | "golden_hour"
  | "deep_obsidian";

export type CameraPreset =
  | "left_profile"
  | "right_profile"
  | "front_three_quarter"
  | "rear_three_quarter"
  | "engine_closeup"
  | "tank_closeup"
  | "side_profile"
  | "detail_close"
  | "top_down";

export interface PartState {
  color: string;
  material: StudioMaterialType;
}

export interface CustomGlbData {
  url: string;
  name: string;
  detectedParts: PartDefinition[];
}

interface StudioState {
  activeModelId: string;
  customGlb: CustomGlbData | null;
  // modelId -> partId -> PartState
  configurations: Record<string, Record<string, PartState>>;
  activePartId: string;
  hoveredPartId: string | null;

  // Viewport Settings
  environment: StudioEnvironment;
  cameraPreset: CameraPreset;
  cameraTriggerCount: number;
  autoRotate: boolean;
  wireframe: boolean;
  soundEnabled: boolean;
  headlightStyle: "rectangular" | "round";

  // Modals & Snapshot
  specModalOpen: boolean;
  glbUploadModalOpen: boolean;
  capturedImage: string | null;
  buildSerial: string;

  // Actions
  setActiveModelId: (id: string) => void;
  setCustomGlb: (data: CustomGlbData | null) => void;
  setActivePartId: (partId: string) => void;
  setHoveredPartId: (partId: string | null) => void;
  setPartColor: (modelId: string, partId: string, color: string) => void;
  setPartMaterial: (
    modelId: string,
    partId: string,
    material: StudioMaterialType
  ) => void;
  setEnvironment: (env: StudioEnvironment) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  toggleAutoRotate: () => void;
  toggleWireframe: () => void;
  toggleSound: () => void;
  toggleHeadlightStyle: () => void;
  setSpecModalOpen: (open: boolean) => void;
  setGlbUploadModalOpen: (open: boolean) => void;
  setCapturedImage: (img: string | null) => void;
  generateNewSerial: () => void;
  resetCurrentModel: () => void;

  // Helpers
  getCurrentModel: () => VehicleModel;
  getCurrentPartConfig: (partId?: string) => PartState;
  calculateTotalPrice: () => number;
  exportConfigJSON: () => string;
  importConfigJSON: (jsonStr: string) => boolean;
}

function makeSerialCode(prefix = "CG125"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let str = `${prefix}-`;
  for (let i = 0; i < 4; i++) str += chars[Math.floor(Math.random() * chars.length)];
  str += "-";
  for (let i = 0; i < 4; i++) str += chars[Math.floor(Math.random() * chars.length)];
  return str;
}

// Initialize default configurations from catalog
function buildInitialConfigurations(): Record<string, Record<string, PartState>> {
  const configs: Record<string, Record<string, PartState>> = {};
  MODELS_CATALOG.forEach((model) => {
    configs[model.id] = {};
    model.parts.forEach((part) => {
      configs[model.id][part.id] = {
        color: part.defaultColor,
        material: part.defaultMaterial,
      };
    });
  });
  return configs;
}

export const useStudioStore = create<StudioState>((set, get) => ({
  activeModelId: "honda_cg125",
  customGlb: null,
  configurations: buildInitialConfigurations(),
  activePartId: "fuelTank",
  hoveredPartId: null,

  environment: "studio_neutral",
  cameraPreset: "front_three_quarter",
  cameraTriggerCount: 0,
  autoRotate: false,
  wireframe: false,
  soundEnabled: true,
  headlightStyle: "rectangular", // Authentic OEM Honda CG 125 rectangular headlamp

  specModalOpen: false,
  glbUploadModalOpen: false,
  capturedImage: null,
  buildSerial: makeSerialCode("CG125"),

  setActiveModelId: (id: string) => {
    const state = get();
    if (state.activeModelId === id) return;

    let defaultPart = "fuelTank";
    if (id === "custom" && state.customGlb?.detectedParts.length) {
      defaultPart = state.customGlb.detectedParts[0].id;
    } else {
      const model = MODELS_CATALOG.find((m) => m.id === id);
      if (model && model.parts.length > 0) {
        defaultPart = model.parts[0].id;
      }
    }

    set({
      activeModelId: id,
      activePartId: defaultPart,
      cameraPreset: "front_three_quarter",
      cameraTriggerCount: state.cameraTriggerCount + 1,
      buildSerial: makeSerialCode(id.toUpperCase().slice(0, 5)),
    });
  },

  setCustomGlb: (data: CustomGlbData | null) => {
    if (!data) {
      set({ customGlb: null, activeModelId: "honda_cg125", activePartId: "fuelTank" });
      return;
    }

    set((state) => {
      const customConfig: Record<string, PartState> = {};
      data.detectedParts.forEach((p) => {
        customConfig[p.id] = {
          color: p.defaultColor,
          material: p.defaultMaterial,
        };
      });

      return {
        customGlb: data,
        activeModelId: "custom",
        activePartId: data.detectedParts[0]?.id || "part_1",
        configurations: {
          ...state.configurations,
          custom: customConfig,
        },
        buildSerial: makeSerialCode("GLB"),
        glbUploadModalOpen: false,
      };
    });
  },

  setActivePartId: (partId: string) => set({ activePartId: partId }),
  setHoveredPartId: (partId: string | null) => set({ hoveredPartId: partId }),

  setPartColor: (modelId: string, partId: string, color: string) =>
    set((state) => {
      const modelConfig = state.configurations[modelId] || {};
      const currentPartState = modelConfig[partId] || {
        color: "#0F172A",
        material: "gloss",
      };

      return {
        configurations: {
          ...state.configurations,
          [modelId]: {
            ...modelConfig,
            [partId]: {
              ...currentPartState,
              color,
            },
          },
        },
      };
    }),

  setPartMaterial: (
    modelId: string,
    partId: string,
    material: StudioMaterialType
  ) =>
    set((state) => {
      const modelConfig = state.configurations[modelId] || {};
      const currentPartState = modelConfig[partId] || {
        color: "#0F172A",
        material: "gloss",
      };

      return {
        configurations: {
          ...state.configurations,
          [modelId]: {
            ...modelConfig,
            [partId]: {
              ...currentPartState,
              material,
            },
          },
        },
      };
    }),

  setEnvironment: (environment: StudioEnvironment) => set({ environment }),

  setCameraPreset: (preset: CameraPreset) =>
    set((state) => ({
      cameraPreset: preset,
      cameraTriggerCount: state.cameraTriggerCount + 1,
    })),

  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),
  toggleWireframe: () => set((state) => ({ wireframe: !state.wireframe })),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  toggleHeadlightStyle: () =>
    set((state) => ({
      headlightStyle:
        state.headlightStyle === "rectangular" ? "round" : "rectangular",
    })),

  setSpecModalOpen: (open: boolean) => set({ specModalOpen: open }),
  setGlbUploadModalOpen: (open: boolean) => set({ glbUploadModalOpen: open }),
  setCapturedImage: (img: string | null) => set({ capturedImage: img }),
  generateNewSerial: () => set({ buildSerial: makeSerialCode("ALYN") }),

  resetCurrentModel: () => {
    const { activeModelId, customGlb } = get();
    if (activeModelId === "custom" && customGlb) {
      set((state) => {
        const customConfig: Record<string, PartState> = {};
        customGlb.detectedParts.forEach((p) => {
          customConfig[p.id] = {
            color: p.defaultColor,
            material: p.defaultMaterial,
          };
        });
        return {
          configurations: { ...state.configurations, custom: customConfig },
          buildSerial: makeSerialCode("GLB"),
        };
      });
      return;
    }

    const catalogModel = MODELS_CATALOG.find((m) => m.id === activeModelId);
    if (!catalogModel) return;

    set((state) => {
      const restoredConfig: Record<string, PartState> = {};
      catalogModel.parts.forEach((p) => {
        restoredConfig[p.id] = {
          color: p.defaultColor,
          material: p.defaultMaterial,
        };
      });
      return {
        configurations: { ...state.configurations, [activeModelId]: restoredConfig },
        buildSerial: makeSerialCode(activeModelId.slice(0, 4).toUpperCase()),
      };
    });
  },

  getCurrentModel: (): VehicleModel => {
    const { activeModelId, customGlb } = get();
    if (activeModelId === "custom" && customGlb) {
      return {
        id: "custom",
        brand: "Custom",
        category: "custom",
        title: customGlb.name || "Custom Uploaded .GLB",
        subtitle: "Dynamic Vehicle Mesh Asset",
        badge: "Custom Asset",
        basePrice: 5000,
        cameraDefaults: {
          position: [3.5, 2.0, 3.5],
          target: [0, 0.4, 0],
          fov: 38,
        },
        parts: customGlb.detectedParts,
      };
    }

    const found = MODELS_CATALOG.find((m) => m.id === activeModelId);
    return found || MODELS_CATALOG[0];
  },

  getCurrentPartConfig: (partId?: string): PartState => {
    const { activeModelId, activePartId, configurations } = get();
    const targetPartId = partId || activePartId;
    const modelConfig = configurations[activeModelId];
    if (modelConfig && modelConfig[targetPartId]) {
      return modelConfig[targetPartId];
    }
    return { color: "#0F172A", material: "gloss" };
  },

  calculateTotalPrice: (): number => {
    const currentModel = get().getCurrentModel();
    return currentModel.basePrice;
  },

  exportConfigJSON: (): string => {
    const currentModel = get().getCurrentModel();
    const modelConfig = get().configurations[currentModel.id] || {};
    const payload = {
      modelId: currentModel.id,
      brand: currentModel.brand,
      modelTitle: currentModel.title,
      serialNumber: get().buildSerial,
      timestamp: new Date().toISOString(),
      parts: modelConfig,
      totalPrice: get().calculateTotalPrice(),
    };
    return JSON.stringify(payload, null, 2);
  },

  importConfigJSON: (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (!data.modelId || !data.parts) return false;

      set((state) => ({
        activeModelId: data.modelId,
        activePartId: Object.keys(data.parts)[0] || "fuelTank",
        configurations: {
          ...state.configurations,
          [data.modelId]: data.parts,
        },
        buildSerial: data.serialNumber || makeSerialCode("IMP"),
      }));
      return true;
    } catch {
      return false;
    }
  },
}));
