import { create } from "zustand";
import {
  ProductModel,
  MODELS_CATALOG,
  PartDefinition,
  StudioMaterialType,
  STUDIO_MATERIALS,
  ProductCategory,
} from "@/data/modelsCatalog";

export type StudioEnvironment =
  | "studio_neutral"
  | "cyber_neon"
  | "golden_hour"
  | "deep_obsidian";

export type CameraPreset =
  | "front_three_quarter"
  | "side_profile"
  | "top_down"
  | "detail_close";

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
  setSpecModalOpen: (open: boolean) => void;
  setGlbUploadModalOpen: (open: boolean) => void;
  setCapturedImage: (img: string | null) => void;
  generateNewSerial: () => void;
  resetCurrentModel: () => void;

  // Helpers
  getCurrentModel: () => ProductModel;
  getCurrentPartConfig: (partId?: string) => PartState;
  calculateTotalPrice: () => number;
  exportConfigJSON: () => string;
  importConfigJSON: (jsonStr: string) => boolean;
}

function makeSerialCode(prefix = "APX"): string {
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
  activeModelId: "car_gtx",
  customGlb: null,
  configurations: buildInitialConfigurations(),
  activePartId: "paint",
  hoveredPartId: null,

  environment: "studio_neutral",
  cameraPreset: "front_three_quarter",
  cameraTriggerCount: 0,
  autoRotate: false,
  wireframe: false,
  soundEnabled: true,

  specModalOpen: false,
  glbUploadModalOpen: false,
  capturedImage: null,
  buildSerial: makeSerialCode("APX"),

  setActiveModelId: (id: string) => {
    const state = get();
    if (state.activeModelId === id) return;

    let defaultPart = "body";
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
      buildSerial: makeSerialCode(id.toUpperCase().slice(0, 3)),
    });
  },

  setCustomGlb: (data: CustomGlbData | null) => {
    if (!data) {
      set({ customGlb: null, activeModelId: "car_gtx", activePartId: "body" });
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
        color: "#ffffff",
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
        color: "#ffffff",
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
  setSpecModalOpen: (open: boolean) => set({ specModalOpen: open }),
  setGlbUploadModalOpen: (open: boolean) => set({ glbUploadModalOpen: open }),
  setCapturedImage: (img: string | null) => set({ capturedImage: img }),
  generateNewSerial: () => set({ buildSerial: makeSerialCode("APX") }),

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
        buildSerial: makeSerialCode(activeModelId.slice(0, 3).toUpperCase()),
      };
    });
  },

  getCurrentModel: (): ProductModel => {
    const { activeModelId, customGlb } = get();
    if (activeModelId === "custom" && customGlb) {
      return {
        id: "custom",
        category: "custom" as ProductCategory,
        title: customGlb.name || "Custom Uploaded .GLB",
        subtitle: "Dynamic User-Imported 3D Asset",
        badge: "Custom Asset",
        basePrice: 1500,
        cameraDefaults: {
          position: [3.5, 2.0, 3.5],
          target: [0, 0.4, 0],
          fov: 42,
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
    return { color: "#00F0FF", material: "gloss" };
  },

  calculateTotalPrice: (): number => {
    const currentModel = get().getCurrentModel();
    const modelConfig = get().configurations[currentModel.id] || {};
    let total = currentModel.basePrice;

    currentModel.parts.forEach((part) => {
      const pConfig = modelConfig[part.id];
      if (pConfig) {
        const mat = STUDIO_MATERIALS[pConfig.material];
        if (mat) total += mat.surcharge;
      }
    });

    return total;
  },

  exportConfigJSON: (): string => {
    const currentModel = get().getCurrentModel();
    const modelConfig = get().configurations[currentModel.id] || {};
    const payload = {
      modelId: currentModel.id,
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
        activePartId: Object.keys(data.parts)[0] || "body",
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
