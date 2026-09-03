"use client";

import React from "react";
import { useStudioStore, CameraPreset } from "@/store/useStudioStore";
import { CURATED_COLOR_SWATCHES, StudioMaterialType } from "@/data/modelsCatalog";
import { formatCurrency } from "@/lib/utils";
import { cyberAudio } from "@/lib/audio";
import { Check, Sparkles } from "lucide-react";

// Icon mapping per model part
const PART_EMOJIS: Record<string, string> = {
  // Car
  body: "🚗",
  rims: "🛞",
  windows: "🪟",
  calipers: "🛑",
  trim: "⚡",
  // Bike
  tank: "⛽",
  seat: "🪑",
  frame: "⚙️",
  exhaust: "💨",
  wheels: "🛞",
  // Sofa
  fabric: "🛋️",
  cushions: "🟫",
  legs: "🪵",
  woodTrim: "🪵",
  // Sneaker
  upperMesh: "👟",
  sole: "⚪",
  airPods: "⚡",
  laces: "🧵",
  accents: "✨",
  // Headphones
  earcups: "🎧",
  headband: "〰️",
};

const CAMERA_VIEWS: { id: CameraPreset; label: string }[] = [
  { id: "front_three_quarter", label: "Front 3/4" },
  { id: "side_profile", label: "Side" },
  { id: "top_down", label: "Top" },
];

export function MinimalFloatingDock() {
  const currentModel = useStudioStore((state) => state.getCurrentModel());
  const activePartId = useStudioStore((state) => state.activePartId);
  const setActivePartId = useStudioStore((state) => state.setActivePartId);
  const configurations = useStudioStore((state) => state.configurations);
  const setPartColor = useStudioStore((state) => state.setPartColor);
  const setPartMaterial = useStudioStore((state) => state.setPartMaterial);
  const cameraPreset = useStudioStore((state) => state.cameraPreset);
  const setCameraPreset = useStudioStore((state) => state.setCameraPreset);
  const soundEnabled = useStudioStore((state) => state.soundEnabled);
  const calculateTotalPrice = useStudioStore((state) => state.calculateTotalPrice);

  const modelConfig = configurations[currentModel.id] || {};
  const currentPartState = modelConfig[activePartId] || {
    color: "#00F0FF",
    material: "gloss",
  };
  const totalPrice = calculateTotalPrice();

  const handleSelectPart = (id: string) => {
    if (soundEnabled) cyberAudio.playTick();
    setActivePartId(id);
  };

  const handleSelectColor = (hex: string) => {
    if (soundEnabled) cyberAudio.playColorSwitch();
    setPartColor(currentModel.id, activePartId, hex);
  };

  const handleToggleMaterial = (mat: StudioMaterialType) => {
    if (soundEnabled) cyberAudio.playColorSwitch();
    setPartMaterial(currentModel.id, activePartId, mat);
  };

  const isMetallic = currentPartState.material === "metallic";

  return (
    <div className="pointer-events-auto w-full max-w-xl mx-auto px-4 pb-6 select-none">
      <div className="rounded-3xl p-3.5 sm:p-4 bg-zinc-950/80 border border-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-3">
        {/* ROW 1: Part Selector Tabs (Large, Touch-Friendly Icon Pills) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {currentModel.parts.map((part) => {
            const isSelected = activePartId === part.id;
            const emoji = PART_EMOJIS[part.id] || "✨";
            const partColor = modelConfig[part.id]?.color || part.defaultColor;

            return (
              <button
                key={part.id}
                onClick={() => handleSelectPart(part.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-medium shrink-0 transition-all duration-200 border ${
                  isSelected
                    ? "bg-white/15 text-white border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.15)] font-semibold scale-[1.02]"
                    : "bg-white/[0.04] text-zinc-400 border-white/5 hover:text-zinc-200 hover:bg-white/[0.08]"
                }`}
              >
                <span className="text-sm leading-none">{emoji}</span>
                <span className="truncate max-w-[90px] sm:max-w-none">{part.name}</span>
                <div
                  className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0 ml-0.5"
                  style={{ backgroundColor: partColor }}
                />
              </button>
            );
          })}
        </div>

        {/* ROW 2: Color Palette Swatches & Material Finish Toggle */}
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/[0.07]">
          {/* 8-10 High-Contrast Circular Color Swatches */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {CURATED_COLOR_SWATCHES.map((swatch) => {
              const isSelected =
                currentPartState.color.toLowerCase() === swatch.hex.toLowerCase();
              return (
                <button
                  key={swatch.name}
                  onClick={() => handleSelectColor(swatch.hex)}
                  title={swatch.name}
                  className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 transition-all duration-200 flex items-center justify-center ${
                    isSelected
                      ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950 scale-110 shadow-lg"
                      : "border border-white/20 hover:scale-105"
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                >
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-black mix-blend-difference" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Minimalist Finish Toggle: [ Matte ] vs [ Metallic ] */}
          <div className="flex items-center p-1 rounded-full bg-zinc-900 border border-white/10 shrink-0">
            <button
              onClick={() => handleToggleMaterial("matte")}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                !isMetallic
                  ? "bg-white text-zinc-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Matte
            </button>
            <button
              onClick={() => handleToggleMaterial("metallic")}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                isMetallic
                  ? "bg-white text-zinc-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Metallic
            </button>
          </div>
        </div>

        {/* ROW 3 (Footer micro-bar): Camera Views & Clean Price */}
        <div className="flex items-center justify-between pt-1 border-t border-white/[0.07] text-[11px]">
          {/* Camera Pills */}
          <div className="flex items-center gap-1 text-zinc-400">
            <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 mr-1 hidden sm:inline">
              View:
            </span>
            {CAMERA_VIEWS.map((cam) => {
              const isSelected = cameraPreset === cam.id;
              return (
                <button
                  key={cam.id}
                  onClick={() => {
                    if (soundEnabled) cyberAudio.playTick();
                    setCameraPreset(cam.id);
                  }}
                  className={`px-2.5 py-0.5 rounded-full transition-all ${
                    isSelected
                      ? "bg-white/15 text-white font-medium border border-white/20"
                      : "hover:text-zinc-200"
                  }`}
                >
                  {cam.label}
                </button>
              );
            })}
          </div>

          {/* Dynamic Valuation */}
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[10px] uppercase text-zinc-500 tracking-wider">Est:</span>
            <span className="text-xs font-semibold text-white">
              {formatCurrency(totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
