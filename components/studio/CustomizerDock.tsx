"use client";

import React, { useState } from "react";
import {
  useStudioStore,
  CameraPreset,
} from "@/store/useStudioStore";
import {
  STUDIO_MATERIALS,
  CURATED_COLOR_SWATCHES,
  StudioMaterialType,
} from "@/data/modelsCatalog";
import {
  Palette,
  Check,
  RotateCcw,
  FileCheck,
  ChevronUp,
  ChevronDown,
  Sliders,
  Sparkles,
} from "lucide-react";
import { cyberAudio } from "@/lib/audio";
import { formatCurrency } from "@/lib/utils";

const CAMERA_PRESET_BUTTONS: { id: CameraPreset; label: string; icon: string }[] = [
  { id: "front_three_quarter", label: "Front 3/4", icon: "📐" },
  { id: "side_profile", label: "Side View", icon: "↔️" },
  { id: "top_down", label: "Top Down", icon: "⬆️" },
  { id: "detail_close", label: "Detail Zoom", icon: "🔍" },
];

export function CustomizerDock() {
  const currentModel = useStudioStore((state) => state.getCurrentModel());
  const activePartId = useStudioStore((state) => state.activePartId);
  const setActivePartId = useStudioStore((state) => state.setActivePartId);
  const setPartColor = useStudioStore((state) => state.setPartColor);
  const setPartMaterial = useStudioStore((state) => state.setPartMaterial);
  const configurations = useStudioStore((state) => state.configurations);
  const cameraPreset = useStudioStore((state) => state.cameraPreset);
  const setCameraPreset = useStudioStore((state) => state.setCameraPreset);
  const autoRotate = useStudioStore((state) => state.autoRotate);
  const toggleAutoRotate = useStudioStore((state) => state.toggleAutoRotate);
  const soundEnabled = useStudioStore((state) => state.soundEnabled);
  const setSpecModalOpen = useStudioStore((state) => state.setSpecModalOpen);
  const calculateTotalPrice = useStudioStore((state) => state.calculateTotalPrice);

  const [expanded, setExpanded] = useState(true);

  const modelConfig = configurations[currentModel.id] || {};
  const activePartDef =
    currentModel.parts.find((p) => p.id === activePartId) || currentModel.parts[0];
  const activePartState =
    modelConfig[activePartId] || { color: "#00F0FF", material: "gloss" };

  const totalPrice = calculateTotalPrice();

  const handleSelectPart = (id: string) => {
    if (soundEnabled) cyberAudio.playTick();
    setActivePartId(id);
  };

  const handleSelectMaterial = (mat: StudioMaterialType) => {
    if (soundEnabled) cyberAudio.playColorSwitch();
    setPartMaterial(currentModel.id, activePartId, mat);
  };

  const handleSelectColor = (hex: string) => {
    if (soundEnabled) cyberAudio.playColorSwitch();
    setPartColor(currentModel.id, activePartId, hex);
  };

  return (
    <div className="pointer-events-auto flex flex-col gap-2.5 max-w-4xl mx-auto w-full">
      {/* 1. FLOATING CAMERA PRESET & ROTATE BAR */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-xl cyber-glass border border-cyan-500/20 text-xs w-fit mx-auto shadow-lg gap-2">
        <span className="text-[10px] font-heading uppercase text-slate-400 tracking-wider">
          CAMERAS:
        </span>
        <div className="flex items-center gap-1">
          {CAMERA_PRESET_BUTTONS.map((cam) => {
            const isSelected = cameraPreset === cam.id;
            return (
              <button
                key={cam.id}
                onClick={() => {
                  if (soundEnabled) cyberAudio.playTick();
                  setCameraPreset(cam.id);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)] font-medium"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>{cam.icon}</span>
                <span className="text-[11px] font-mono-code">{cam.label}</span>
              </button>
            );
          })}
        </div>

        {/* Auto Rotate Toggle */}
        <button
          onClick={() => {
            if (soundEnabled) cyberAudio.playTick();
            toggleAutoRotate();
          }}
          title="Toggle Auto Rotation"
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all ${
            autoRotate
              ? "bg-cyan-500 text-black border-cyan-300 font-bold"
              : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <RotateCcw className={`w-3 h-3 ${autoRotate ? "animate-spin" : ""}`} />
          <span className="text-[10px] font-heading">Auto Orbit</span>
        </button>
      </div>

      {/* 2. MAIN CUSTOMIZATION DOCK */}
      <div className="cyber-glass rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden">
        {/* Dock Header Bar with Toggle */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/70 border-b border-cyan-500/10">
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-bold font-heading text-slate-200 uppercase tracking-wide">
              {currentModel.title} — {activePartDef?.name || "Zone Selector"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[9px] font-mono-code text-slate-400 uppercase tracking-wider block">
                TOTAL VALUATION
              </span>
              <span className="text-base md:text-lg font-black font-heading text-cyan-400 leading-none">
                {formatCurrency(totalPrice)}
              </span>
            </div>

            <button
              onClick={() => {
                if (soundEnabled) cyberAudio.playSelect();
                setSpecModalOpen(true);
              }}
              className="px-3.5 md:px-5 py-1.5 md:py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-[0_0_20px_rgba(0,240,255,0.5)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 border border-cyan-200"
            >
              <FileCheck className="w-3.5 h-3.5 text-black" />
              <span>SAVE BUILD & SPECS</span>
            </button>

            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-all bg-slate-900 border border-slate-800"
            >
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Customizer Controls */}
        {expanded && (
          <div className="p-3.5 md:p-4 space-y-3.5 bg-slate-950/40">
            {/* Part Selection Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[10px] font-heading uppercase text-slate-500 tracking-wider shrink-0">
                PARTS:
              </span>
              {currentModel.parts.map((part) => {
                const isSelected = activePartId === part.id;
                const pColor = modelConfig[part.id]?.color || part.defaultColor;
                return (
                  <button
                    key={part.id}
                    onClick={() => handleSelectPart(part.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all border ${
                      isSelected
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)] scale-[1.02]"
                        : "bg-slate-900/70 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full border border-white/40 shrink-0"
                      style={{ backgroundColor: pColor }}
                    />
                    <span className="truncate max-w-[120px]">{part.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Material Finishes & Color Swatches Dual Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-800/80">
              {/* Material Finish Buttons */}
              <div>
                <label className="text-[10px] font-heading uppercase text-slate-400 tracking-wider block mb-1.5">
                  MATERIAL FINISH / SURFACE SHADER
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(Object.keys(STUDIO_MATERIALS) as StudioMaterialType[]).map((matKey) => {
                    const mat = STUDIO_MATERIALS[matKey];
                    const isSelected = activePartState.material === matKey;
                    return (
                      <button
                        key={matKey}
                        onClick={() => handleSelectMaterial(matKey)}
                        className={`p-2 rounded-xl text-left text-[11px] transition-all border ${
                          isSelected
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                            : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <p className="font-semibold truncate">{mat.name}</p>
                        <p className="text-[9px] font-mono-code text-slate-500">
                          {mat.surcharge > 0 ? `+${formatCurrency(mat.surcharge)}` : "Standard"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Swatches Matrix & Custom Hex Picker */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-heading uppercase text-slate-400 tracking-wider">
                    COLOR PALETTE & TINT
                  </label>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded border border-white/30"
                      style={{ backgroundColor: activePartState.color }}
                    />
                    <span className="text-[10px] font-mono-code text-cyan-400 uppercase font-bold">
                      {activePartState.color}
                    </span>
                  </div>
                </div>

                {/* Swatches Matrix */}
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  {CURATED_COLOR_SWATCHES.map((swatch) => {
                    const isSelected =
                      activePartState.color.toLowerCase() === swatch.hex.toLowerCase();
                    return (
                      <button
                        key={swatch.name}
                        onClick={() => handleSelectColor(swatch.hex)}
                        title={swatch.name}
                        className={`w-7 h-7 rounded-lg transition-all flex items-center justify-center ${
                          isSelected
                            ? "ring-2 ring-cyan-400 scale-110 shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                            : "border border-white/10 hover:scale-105"
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                      >
                        {isSelected && (
                          <Check className="w-3 h-3 text-black mix-blend-difference" />
                        )}
                      </button>
                    );
                  })}

                  {/* Custom Hex Picker */}
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 ml-auto">
                    <Palette className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="color"
                      value={activePartState.color}
                      onChange={(e) =>
                        setPartColor(currentModel.id, activePartId, e.target.value)
                      }
                      className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 outline-none"
                    />
                    <input
                      type="text"
                      value={activePartState.color}
                      onChange={(e) =>
                        setPartColor(currentModel.id, activePartId, e.target.value)
                      }
                      maxLength={7}
                      className="w-16 px-1 text-[10px] font-mono-code uppercase bg-transparent text-cyan-400 border-b border-slate-700 outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
