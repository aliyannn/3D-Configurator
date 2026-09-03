"use client";

import React from "react";
import { useStudioStore } from "@/store/useStudioStore";
import { Camera, FileText, Upload } from "lucide-react";
import { cyberAudio } from "@/lib/audio";

const CATEGORIES = [
  { id: "car_gtx", label: "Sports Car", icon: "🚗" },
  { id: "bike_valkyrie", label: "Superbike", icon: "🏍️" },
  { id: "sofa_haven", label: "Showroom Sofa", icon: "🛋️" },
  { id: "sneaker_apex", label: "Footwear", icon: "👟" },
];

interface MinimalTopBarProps {
  onCaptureSnapshot: () => void;
}

export function MinimalTopBar({ onCaptureSnapshot }: MinimalTopBarProps) {
  const activeModelId = useStudioStore((state) => state.activeModelId);
  const setActiveModelId = useStudioStore((state) => state.setActiveModelId);
  const currentModel = useStudioStore((state) => state.getCurrentModel());
  const soundEnabled = useStudioStore((state) => state.soundEnabled);
  const setSpecModalOpen = useStudioStore((state) => state.setSpecModalOpen);
  const setGlbUploadModalOpen = useStudioStore((state) => state.setGlbUploadModalOpen);

  const handleSelectModel = (id: string) => {
    if (soundEnabled) cyberAudio.playSelect();
    setActiveModelId(id);
  };

  return (
    <header className="pointer-events-auto w-full flex items-center justify-between gap-3 max-w-7xl mx-auto px-4 sm:px-6 pt-4 select-none">
      {/* 1. Top Left: Studio & Model Identifier */}
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-950/70 border border-white/10 backdrop-blur-2xl shadow-xl">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-semibold text-white tracking-tight">Apex Studio</span>
          <span className="text-zinc-500 font-light">•</span>
          <span className="text-zinc-300 font-medium truncate">
            {activeModelId === "car_gtx" ? "Model 01 (GT Series)" : currentModel.title}
          </span>
        </div>
      </div>

      {/* 2. Center: Quick Category Switcher */}
      <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-zinc-950/70 border border-white/10 backdrop-blur-2xl shadow-xl">
        {CATEGORIES.map((cat) => {
          const isSelected = activeModelId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelectModel(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                isSelected
                  ? "bg-white text-zinc-950 shadow-md font-semibold scale-[1.02]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}

        {/* Upload Custom GLB Pill */}
        <button
          onClick={() => {
            if (soundEnabled) cyberAudio.playSelect();
            setGlbUploadModalOpen(true);
          }}
          title="Upload or link custom 3D model"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
            activeModelId === "custom"
              ? "bg-purple-500 text-white font-semibold"
              : "text-zinc-400 hover:text-purple-300 hover:bg-white/5"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Import .GLB</span>
        </button>
      </nav>

      {/* 3. Top Right: [📸 4K Render] and [📄 Save Spec Sheet] */}
      <div className="flex items-center gap-2">
        {/* 4K Render Snapshot Button */}
        <button
          onClick={() => {
            if (soundEnabled) cyberAudio.playSnap();
            onCaptureSnapshot();
          }}
          title="Capture clean 4K transparent PNG"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium text-zinc-200 bg-zinc-950/70 hover:bg-zinc-900 border border-white/10 hover:border-white/20 backdrop-blur-2xl shadow-xl active:scale-95 transition-all"
        >
          <Camera className="w-3.5 h-3.5 text-zinc-400" />
          <span>📸 4K Render</span>
        </button>

        {/* Save Spec Sheet Button */}
        <button
          onClick={() => {
            if (soundEnabled) cyberAudio.playSelect();
            setSpecModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-100 shadow-[0_0_20px_rgba(255,255,255,0.25)] active:scale-95 transition-all"
        >
          <FileText className="w-3.5 h-3.5 text-zinc-950" />
          <span>📄 Save Spec Sheet</span>
        </button>
      </div>
    </header>
  );
}
