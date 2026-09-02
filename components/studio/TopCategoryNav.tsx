"use client";

import React from "react";
import {
  useStudioStore,
  StudioEnvironment,
} from "@/store/useStudioStore";
import { MODELS_CATALOG, ProductCategory } from "@/data/modelsCatalog";
import {
  Camera,
  RotateCcw,
  Sun,
  Volume2,
  VolumeX,
  Upload,
  Layers,
  Sparkles,
  Boxes,
} from "lucide-react";
import { cyberAudio } from "@/lib/audio";

const CATEGORY_ITEMS: {
  id: string;
  category: ProductCategory;
  label: string;
  icon: string;
}[] = [
  { id: "car_gtx", category: "vehicles", label: "Vehicles", icon: "🚗" },
  { id: "bike_valkyrie", category: "bikes", label: "Bikes", icon: "🏍️" },
  { id: "sofa_haven", category: "furniture", label: "Furniture", icon: "🛋️" },
  { id: "sneaker_apex", category: "footwear", label: "Footwear", icon: "👟" },
  { id: "headphones_aura", category: "tech", label: "Tech Gear", icon: "🎧" },
];

const LIGHTING_PRESETS: { id: StudioEnvironment; label: string; icon: string }[] = [
  { id: "studio_neutral", label: "Studio Neutral", icon: "💡" },
  { id: "cyber_neon", label: "Cyber Neon", icon: "🌌" },
  { id: "golden_hour", label: "Golden Hour", icon: "🌅" },
  { id: "deep_obsidian", label: "Deep Obsidian", icon: "🌑" },
];

interface TopCategoryNavProps {
  onCaptureSnapshot: () => void;
}

export function TopCategoryNav({ onCaptureSnapshot }: TopCategoryNavProps) {
  const activeModelId = useStudioStore((state) => state.activeModelId);
  const setActiveModelId = useStudioStore((state) => state.setActiveModelId);
  const environment = useStudioStore((state) => state.environment);
  const setEnvironment = useStudioStore((state) => state.setEnvironment);
  const soundEnabled = useStudioStore((state) => state.soundEnabled);
  const toggleSound = useStudioStore((state) => state.toggleSound);
  const wireframe = useStudioStore((state) => state.wireframe);
  const toggleWireframe = useStudioStore((state) => state.toggleWireframe);
  const resetCurrentModel = useStudioStore((state) => state.resetCurrentModel);
  const setGlbUploadModalOpen = useStudioStore((state) => state.setGlbUploadModalOpen);
  const currentModel = useStudioStore((state) => state.getCurrentModel());

  const handleSelectModel = (id: string) => {
    if (soundEnabled) cyberAudio.playSelect();
    setActiveModelId(id);
  };

  return (
    <header className="pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-3 cyber-glass px-3.5 md:px-5 py-2.5 md:py-3 rounded-2xl border border-cyan-500/20 shadow-2xl">
      {/* Brand & Active Model Info */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.5)]">
            <Boxes className="w-4 h-4 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-bold font-heading tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-300">
                UNIVERSAL 3D STUDIO
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono-code bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                SKETCHFAB-PBR
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono-code">
              {currentModel.title} •{" "}
              <span className="text-cyan-400">{currentModel.parts.length} ZONES</span>
            </p>
          </div>
        </div>

        {/* Mobile Snapshot Button */}
        <button
          onClick={() => {
            if (soundEnabled) cyberAudio.playSnap();
            onCaptureSnapshot();
          }}
          className="md:hidden p-2 rounded-xl bg-pink-600 text-white shadow-sm"
          title="Capture Snapshot"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Category Switcher Pill Carousel */}
      <nav className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5 px-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
        {CATEGORY_ITEMS.map((item) => {
          const isSelected = activeModelId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectModel(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-medium shrink-0 transition-all duration-200 border ${
                isSelected
                  ? "bg-cyan-500 text-black border-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.4)] font-bold scale-[1.02]"
                  : "bg-transparent text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Custom Upload GLB Button */}
        <button
          onClick={() => {
            if (soundEnabled) cyberAudio.playSelect();
            setGlbUploadModalOpen(true);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-medium shrink-0 transition-all duration-200 border ${
            activeModelId === "custom"
              ? "bg-purple-500 text-black border-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.4)] font-bold"
              : "bg-purple-950/40 text-purple-300 border-purple-800/60 hover:bg-purple-900/50 hover:border-purple-500"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload .GLB</span>
        </button>
      </nav>

      {/* Studio Lighting & Controls Toolbar */}
      <div className="hidden md:flex items-center gap-2">
        {/* Environment Presets Selector */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          {LIGHTING_PRESETS.map((light) => {
            const isSelected = environment === light.id;
            return (
              <button
                key={light.id}
                onClick={() => {
                  if (soundEnabled) cyberAudio.playTick();
                  setEnvironment(light.id);
                }}
                title={light.label}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <span>{light.icon}</span>
              </button>
            );
          })}
        </div>

        {/* Wireframe Toggle */}
        <button
          onClick={() => {
            if (soundEnabled) cyberAudio.playTick();
            toggleWireframe();
          }}
          title="Toggle Wireframe Mesh"
          className={`p-2 rounded-xl text-xs border transition-all ${
            wireframe
              ? "bg-pink-500 text-black border-pink-300 shadow-[0_0_10px_rgba(255,0,85,0.4)]"
              : "bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700"
          }`}
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          title={soundEnabled ? "Mute Cyber Audio SFX" : "Enable Cyber Audio SFX"}
          className="p-2 rounded-xl text-xs bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700 transition-all"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {/* Reset Model */}
        <button
          onClick={() => {
            if (soundEnabled) cyberAudio.playTick();
            resetCurrentModel();
          }}
          title="Reset Current Model to Factory Default"
          className="p-2 rounded-xl text-xs bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-rose-400 hover:border-rose-500/40 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* 4K Snapshot Button */}
        <button
          onClick={() => {
            if (soundEnabled) cyberAudio.playSnap();
            onCaptureSnapshot();
          }}
          title="Capture High-Res 4K Snapshot"
          className="px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 bg-gradient-to-r from-pink-600 to-rose-500 text-white border border-pink-400 shadow-[0_0_15px_rgba(255,0,85,0.4)] hover:brightness-110 active:scale-95 transition-all duration-200"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Snapshot</span>
        </button>
      </div>
    </header>
  );
}
