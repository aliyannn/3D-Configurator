"use client";

import React from "react";
import {
  useStudioStore,
  CameraPreset,
} from "@/store/useStudioStore";
import {
  MODELS_CATALOG,
  VehicleBrand,
  CURATED_COLOR_SWATCHES,
  StudioMaterialType,
} from "@/data/modelsCatalog";
import {
  Camera,
  FileText,
  Upload,
  Check,
  RotateCw,
} from "lucide-react";
import { cyberAudio } from "@/lib/audio";

const BRANDS: VehicleBrand[] = ["Honda", "Toyota"];

// Authentic Camera Angles derived directly from the Honda CG 125 Specification Sheet
const SPEC_SHEET_ANGLES: { id: CameraPreset; label: string; icon: string }[] = [
  { id: "left_profile", label: "Left Profile", icon: "⬅️" },
  { id: "right_profile", label: "Right Profile", icon: "➡️" },
  { id: "front_three_quarter", label: "Front 3/4", icon: "↗️" },
  { id: "rear_three_quarter", label: "Rear 3/4", icon: "↖️" },
  { id: "engine_closeup", label: "Engine Zoom", icon: "⚙️" },
  { id: "tank_closeup", label: "Tank Zoom", icon: "⛽" },
];

interface UIOverlayProps {
  onCaptureSnapshot: () => void;
}

export function UIOverlay({ onCaptureSnapshot }: UIOverlayProps) {
  const activeModelId = useStudioStore((state) => state.activeModelId);
  const setActiveModelId = useStudioStore((state) => state.setActiveModelId);
  const currentModel = useStudioStore((state) => state.getCurrentModel());
  const activePartId = useStudioStore((state) => state.activePartId);
  const setActivePartId = useStudioStore((state) => state.setActivePartId);
  const configurations = useStudioStore((state) => state.configurations);
  const setPartColor = useStudioStore((state) => state.setPartColor);
  const setPartMaterial = useStudioStore((state) => state.setPartMaterial);
  const cameraPreset = useStudioStore((state) => state.cameraPreset);
  const setCameraPreset = useStudioStore((state) => state.setCameraPreset);
  const soundEnabled = useStudioStore((state) => state.soundEnabled);
  const setSpecModalOpen = useStudioStore((state) => state.setSpecModalOpen);
  const setGlbUploadModalOpen = useStudioStore((state) => state.setGlbUploadModalOpen);
  const headlightStyle = useStudioStore((state) => state.headlightStyle);
  const toggleHeadlightStyle = useStudioStore((state) => state.toggleHeadlightStyle);

  const modelConfig = configurations[currentModel.id] || {};
  const activePartDef =
    currentModel.parts.find((p) => p.id === activePartId) || currentModel.parts[0];
  const currentPartState =
    modelConfig[activePartId] || { color: "#0F172A", material: "gloss" };

  const currentBrand = currentModel.brand;
  const brandModels = MODELS_CATALOG.filter((m) => m.brand === currentBrand);

  const handleBrandChange = (brand: VehicleBrand) => {
    if (soundEnabled) cyberAudio.playSelect();
    const firstModel = MODELS_CATALOG.find((m) => m.brand === brand);
    if (firstModel) {
      setActiveModelId(firstModel.id);
    }
  };

  const handleModelChange = (modelId: string) => {
    if (soundEnabled) cyberAudio.playSelect();
    setActiveModelId(modelId);
  };

  const handleSelectPart = (id: string) => {
    if (soundEnabled) cyberAudio.playTick();
    setActivePartId(id);
  };

  const handleSelectColor = (hex: string) => {
    if (soundEnabled) cyberAudio.playColorSwitch();
    setPartColor(currentModel.id, activePartId, hex);
  };

  const handleSelectFinish = (finish: StudioMaterialType) => {
    if (soundEnabled) cyberAudio.playColorSwitch();
    setPartMaterial(currentModel.id, activePartId, finish);
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 z-10 select-none">
      {/* ========================================================================= */}
      {/* 1. TOP BAR: Brand, Model & Action Suite */}
      {/* ========================================================================= */}
      <header className="pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto w-full">
        {/* Left: Brand Badge & Model Picker */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Brand Selector */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200 shadow-md backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-600">
              HONDA
            </span>
            <span className="text-slate-300">|</span>
            <select
              value={currentBrand}
              onChange={(e) => handleBrandChange(e.target.value as VehicleBrand)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Model Selector */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200 shadow-md backdrop-blur-md">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Model:
            </span>
            <select
              value={currentModel.id}
              onChange={(e) => handleModelChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer max-w-[220px] truncate"
            >
              {brandModels.some((m) => m.category === "motorcycles") && (
                <optgroup label="🏍️ Motorcycles">
                  {brandModels
                    .filter((m) => m.category === "motorcycles")
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                </optgroup>
              )}
              {brandModels.some((m) => m.category === "cars") && (
                <optgroup label="🚗 Sports Cars">
                  {brandModels
                    .filter((m) => m.category === "cars")
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                </optgroup>
              )}
            </select>
          </div>

          {/* Upload Custom GLB Button */}
          <button
            onClick={() => {
              if (soundEnabled) cyberAudio.playSelect();
              setGlbUploadModalOpen(true);
            }}
            title="Upload custom 3D model"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold shadow-sm transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">Import .GLB</span>
          </button>
        </div>

        {/* Right: Snapshot & Print Spec Sheet Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* 📸 Capture Snapshot */}
          <button
            onClick={() => {
              if (soundEnabled) cyberAudio.playSnap();
              onCaptureSnapshot();
            }}
            title="Download high-res render with studio watermark"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Camera className="w-3.5 h-3.5 text-slate-600" />
            <span>📸 Snapshot</span>
          </button>

          {/* 📄 Print Spec Sheet for Mechanic */}
          <button
            onClick={() => {
              if (soundEnabled) cyberAudio.playSelect();
              setSpecModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg transition-all active:scale-95"
          >
            <FileText className="w-3.5 h-3.5 text-white" />
            <span>📄 Print Spec Sheet</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. BOTTOM FLOATING PILL DOCK (Zones + Colors + Authentic Angles) */}
      {/* ========================================================================= */}
      <div className="pointer-events-auto w-full max-w-2xl mx-auto pb-4 sm:pb-6">
        <div className="rounded-3xl p-3.5 sm:p-4 bg-white/95 border border-slate-200 shadow-[0_20px_60px_rgba(30,41,59,0.16)] backdrop-blur-2xl space-y-3">
          {/* ROW 1: Modification Zones Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {currentModel.parts.map((part) => {
              const isSelected = activePartId === part.id;
              const partColor = modelConfig[part.id]?.color || part.defaultColor;

              return (
                <button
                  key={part.id}
                  onClick={() => handleSelectPart(part.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all border ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]"
                      : "bg-slate-100/90 text-slate-600 border-slate-200/80 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-sm leading-none">{part.icon}</span>
                  <span className="truncate">{part.name}</span>
                  <div
                    className="w-2.5 h-2.5 rounded-full border border-white shrink-0 ml-0.5 shadow-sm"
                    style={{ backgroundColor: partColor }}
                  />
                </button>
              );
            })}
          </div>

          {/* ROW 2: Swatches + Finish Toggles + Optional Headlamp Style Toggle */}
          <div className="flex items-center justify-between gap-2.5 pt-1 border-t border-slate-100 flex-wrap">
            {/* Color Palette Circles */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {(activePartDef.swatches || CURATED_COLOR_SWATCHES).map((swatch) => {
                const isSelected =
                  currentPartState.color.toLowerCase() === swatch.hex.toLowerCase();
                return (
                  <button
                    key={swatch.name}
                    onClick={() => handleSelectColor(swatch.hex)}
                    title={swatch.name}
                    className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 transition-all flex items-center justify-center ${
                      isSelected
                        ? "ring-2 ring-slate-900 ring-offset-2 scale-110 shadow-md"
                        : "border border-slate-300 hover:scale-105"
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                  >
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Finish & Style Control Suite */}
            <div className="flex items-center gap-2">
              {/* If Headlight selected: toggle OEM Rectangular vs Round Cafe */}
              {activePartId === "headlight" && (
                <button
                  onClick={() => {
                    if (soundEnabled) cyberAudio.playTick();
                    toggleHeadlightStyle();
                  }}
                  className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-all flex items-center gap-1 shadow-sm"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>
                    {headlightStyle === "rectangular"
                      ? "Style: OEM Rectangular"
                      : "Style: Round Cafe"}
                  </span>
                </button>
              )}

              {/* Surface Finish Toggle */}
              <div className="flex items-center p-0.5 rounded-full bg-slate-100 border border-slate-200 shrink-0 text-[11px] font-semibold text-slate-600">
                <button
                  onClick={() => handleSelectFinish("gloss")}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    currentPartState.material === "gloss"
                      ? "bg-white text-slate-900 shadow-sm font-bold"
                      : "hover:text-slate-900"
                  }`}
                >
                  Gloss
                </button>
                <button
                  onClick={() => handleSelectFinish("matte")}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    currentPartState.material === "matte"
                      ? "bg-white text-slate-900 shadow-sm font-bold"
                      : "hover:text-slate-900"
                  }`}
                >
                  Matte
                </button>
                <button
                  onClick={() => handleSelectFinish("chrome")}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    currentPartState.material === "chrome"
                      ? "bg-white text-slate-900 shadow-sm font-bold"
                      : "hover:text-slate-900"
                  }`}
                >
                  Chrome
                </button>
              </div>
            </div>
          </div>

          {/* ROW 3: Authentic Multi-Angle Camera Pills Matching Spec Sheet */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
                Angles:
              </span>
              {SPEC_SHEET_ANGLES.map((cam) => {
                const isSelected = cameraPreset === cam.id;
                return (
                  <button
                    key={cam.id}
                    onClick={() => {
                      if (soundEnabled) cyberAudio.playTick();
                      setCameraPreset(cam.id);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full shrink-0 transition-all font-semibold ${
                      isSelected
                        ? "bg-red-600 text-white shadow-sm font-bold"
                        : "text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200/60"
                    }`}
                  >
                    <span>{cam.icon}</span>
                    <span>{cam.label}</span>
                  </button>
                );
              })}
            </div>

            <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 ml-2">
              Honda CG 125 OEM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
