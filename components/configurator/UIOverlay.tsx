"use client";

import React, { useState } from "react";
import {
  useConfiguratorStore,
  PartKey,
  MaterialType,
  MATERIAL_PRESETS,
  COLOR_PALETTES,
  THEME_PRESETS,
  CameraPreset,
  StudioEnvironment,
} from "@/store/useConfiguratorStore";
import {
  Camera,
  Layers,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  Sun,
  Maximize2,
  Share2,
  FileText,
  Boxes,
  Zap,
  Shield,
  Palette,
  Check,
  Disc,
} from "lucide-react";
import { cyberAudio } from "@/lib/audio";
import { formatCurrency } from "@/lib/utils";

const PART_ICONS: Record<PartKey, React.ReactNode> = {
  sole: <Disc className="w-4 h-4" />,
  airPods: <Zap className="w-4 h-4" />,
  upperMesh: <Shield className="w-4 h-4" />,
  collar: <Layers className="w-4 h-4" />,
  laces: <Sliders className="w-4 h-4" />,
  accents: <Sparkles className="w-4 h-4" />,
  heelVent: <Boxes className="w-4 h-4" />,
};

const CAMERA_OPTIONS: { id: CameraPreset; label: string; icon: string }[] = [
  { id: "isometric", label: "Isometric", icon: "📐" },
  { id: "side_profile", label: "Lateral", icon: "👟" },
  { id: "top_down", label: "Top-Down", icon: "⬆️" },
  { id: "sole_view", label: "Sole Underside", icon: "⬇️" },
  { id: "front_angle", label: "Quarter Front", icon: "↗️" },
];

const LIGHTING_OPTIONS: { id: StudioEnvironment; label: string; icon: string; desc: string }[] = [
  { id: "cyber_neon_grid", label: "Cyber Neon", icon: "🌌", desc: "Dual Cyan/Pink Rim" },
  { id: "studio_clean", label: "Studio White", icon: "💡", desc: "Crisp High Key" },
  { id: "deep_obsidian", label: "Deep Obsidian", icon: "🌑", desc: "Dark Specular" },
  { id: "holographic_sunset", label: "Synth Sunset", icon: "🌅", desc: "Warm Amber Glow" },
];

interface UIOverlayProps {
  onCaptureScreenshot: () => void;
}

export function UIOverlay({ onCaptureScreenshot }: UIOverlayProps) {
  const parts = useConfiguratorStore((state) => state.parts);
  const activePart = useConfiguratorStore((state) => state.activePart);
  const environment = useConfiguratorStore((state) => state.environment);
  const cameraPreset = useConfiguratorStore((state) => state.cameraPreset);
  const autoRotate = useConfiguratorStore((state) => state.autoRotate);
  const explodedView = useConfiguratorStore((state) => state.explodedView);
  const wireframe = useConfiguratorStore((state) => state.wireframe);
  const showHotspots = useConfiguratorStore((state) => state.showHotspots);
  const soundEnabled = useConfiguratorStore((state) => state.soundEnabled);
  const configSerialNumber = useConfiguratorStore((state) => state.configSerialNumber);

  const setActivePart = useConfiguratorStore((state) => state.setActivePart);
  const setPartColor = useConfiguratorStore((state) => state.setPartColor);
  const setPartMaterial = useConfiguratorStore((state) => state.setPartMaterial);
  const applyThemePreset = useConfiguratorStore((state) => state.applyThemePreset);
  const setEnvironment = useConfiguratorStore((state) => state.setEnvironment);
  const setCameraPreset = useConfiguratorStore((state) => state.setCameraPreset);
  const toggleAutoRotate = useConfiguratorStore((state) => state.toggleAutoRotate);
  const toggleExplodedView = useConfiguratorStore((state) => state.toggleExplodedView);
  const toggleWireframe = useConfiguratorStore((state) => state.toggleWireframe);
  const toggleHotspots = useConfiguratorStore((state) => state.toggleHotspots);
  const toggleSound = useConfiguratorStore((state) => state.toggleSound);
  const setSpecSheetOpen = useConfiguratorStore((state) => state.setSpecSheetOpen);
  const resetToDefault = useConfiguratorStore((state) => state.resetToDefault);
  const getTotalPrice = useConfiguratorStore((state) => state.getTotalPrice);

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"parts" | "presets" | "lighting">("parts");

  const currentPartConfig = parts[activePart];
  const totalPrice = getTotalPrice();

  const handleSoundClick = (action: () => void, soundType: "tick" | "select" | "color" = "select") => {
    if (soundEnabled) {
      if (soundType === "tick") cyberAudio.playTick();
      else if (soundType === "color") cyberAudio.playColorSwitch();
      else cyberAudio.playSelect();
    }
    action();
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 md:p-6 z-10">
      {/* 1. TOP HEADER BAR */}
      <header className="pointer-events-auto flex items-center justify-between gap-3 cyber-glass px-4 py-3 rounded-2xl border border-cyan-500/20 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.6)]">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-bold font-heading tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-cyan-400">
                CYBERSNEAKER PRO X
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono-code bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                PRO-PBR v3.2
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono-code flex items-center gap-2">
              <span>CONFIG ID:</span>
              <span className="text-cyan-400 font-bold">{configSerialNumber}</span>
            </p>
          </div>
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Exploded View Toggle */}
          <button
            onClick={() => handleSoundClick(toggleExplodedView)}
            title="Toggle Exploded Layer Breakdown"
            className={`p-2 md:px-3 md:py-1.5 rounded-xl text-xs font-heading font-medium flex items-center gap-1.5 transition-all duration-200 border ${
              explodedView
                ? "bg-cyan-500 text-black border-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.6)] scale-105"
                : "bg-slate-900/80 text-slate-300 border-slate-700 hover:border-cyan-500/50 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden lg:inline">Exploded View</span>
          </button>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => handleSoundClick(toggleAutoRotate)}
            title="Auto Rotate 3D View"
            className={`p-2 rounded-xl text-xs transition-all duration-200 border ${
              autoRotate
                ? "bg-cyan-500 text-black border-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.5)]"
                : "bg-slate-900/80 text-slate-300 border-slate-700 hover:border-cyan-500/50"
            }`}
          >
            <RotateCcw className={`w-4 h-4 ${autoRotate ? "animate-spin" : ""}`} />
          </button>

          {/* Wireframe Toggle */}
          <button
            onClick={() => handleSoundClick(toggleWireframe)}
            title="Toggle Wireframe Mesh Mode"
            className={`p-2 rounded-xl text-xs transition-all duration-200 border ${
              wireframe
                ? "bg-pink-500 text-black border-pink-300 shadow-[0_0_12px_rgba(255,0,85,0.5)]"
                : "bg-slate-900/80 text-slate-300 border-slate-700 hover:border-pink-500/50"
            }`}
          >
            <Boxes className="w-4 h-4" />
          </button>

          {/* Hotspots Toggle */}
          <button
            onClick={() => handleSoundClick(toggleHotspots)}
            title="Toggle 3D Interactive Hotspot Pins"
            className={`p-2 rounded-xl text-xs transition-all duration-200 border ${
              showHotspots
                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500"
                : "bg-slate-900/80 text-slate-500 border-slate-700 hover:text-slate-300"
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? "Mute Cyber Audio SFX" : "Enable Cyber Audio SFX"}
            className="p-2 rounded-xl text-xs bg-slate-900/80 text-slate-300 border border-slate-700 hover:border-cyan-500/50 transition-all duration-200"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Screenshot Snapshot */}
          <button
            onClick={() => {
              if (soundEnabled) cyberAudio.playSnap();
              onCaptureScreenshot();
            }}
            title="Capture High-Res 3D Snapshot"
            className="p-2 md:px-3 md:py-1.5 rounded-xl text-xs font-heading font-medium flex items-center gap-1.5 bg-gradient-to-r from-pink-600 to-rose-500 text-white border border-pink-400 shadow-[0_0_15px_rgba(255,0,85,0.4)] hover:brightness-110 active:scale-95 transition-all duration-200"
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">Snapshot</span>
          </button>

          {/* Reset Defaults */}
          <button
            onClick={() => handleSoundClick(resetToDefault)}
            title="Reset All Parts to Default"
            className="p-2 rounded-xl text-xs bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-rose-400 hover:border-rose-500/40 transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE DOCK (Desktop Side Panel + Camera Preset Floating Dock) */}
      <div className="pointer-events-none flex-1 flex items-start justify-between py-3 overflow-hidden gap-4">
        {/* Left Floating Camera Preset Dock */}
        <div className="pointer-events-auto hidden md:flex flex-col gap-2 cyber-glass p-2 rounded-2xl border border-cyan-500/20 shadow-xl self-center">
          <span className="text-[9px] font-heading text-slate-400 text-center tracking-wider uppercase px-1">
            CAMERAS
          </span>
          {CAMERA_OPTIONS.map((cam) => (
            <button
              key={cam.id}
              onClick={() => handleSoundClick(() => setCameraPreset(cam.id), "tick")}
              title={cam.label}
              className={`p-2.5 rounded-xl text-xs flex flex-col items-center gap-1 transition-all duration-200 border ${
                cameraPreset === cam.id
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)] scale-105"
                  : "bg-slate-900/60 text-slate-400 border-transparent hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <span className="text-base">{cam.icon}</span>
              <span className="text-[9px] font-mono-code">{cam.label}</span>
            </button>
          ))}
        </div>

        {/* Right Customization Dock (Desktop) */}
        <div className="pointer-events-auto hidden md:flex flex-col w-96 max-h-[calc(100vh-180px)] cyber-glass rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden">
          {/* Navigation Category Tabs */}
          <div className="flex border-b border-cyan-500/20 bg-slate-950/60 p-1.5 gap-1">
            <button
              onClick={() => handleSoundClick(() => setActiveTab("parts"), "tick")}
              className={`flex-1 py-2 rounded-xl text-xs font-heading font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "parts"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>ZONES</span>
            </button>
            <button
              onClick={() => handleSoundClick(() => setActiveTab("presets"), "tick")}
              className={`flex-1 py-2 rounded-xl text-xs font-heading font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "presets"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>THEMES</span>
            </button>
            <button
              onClick={() => handleSoundClick(() => setActiveTab("lighting"), "tick")}
              className={`flex-1 py-2 rounded-xl text-xs font-heading font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "lighting"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>STUDIO</span>
            </button>
          </div>

          {/* Panel Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {activeTab === "parts" && (
              <>
                {/* 1. Zone Selector Strip */}
                <div>
                  <label className="text-[11px] font-heading uppercase tracking-wider text-slate-400 block mb-2 flex justify-between">
                    <span>SELECT ACTIVE ZONE</span>
                    <span className="text-cyan-400">{Object.keys(parts).length} MODULAR ZONES</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(Object.keys(parts) as PartKey[]).map((key) => {
                      const part = parts[key];
                      const isSelected = activePart === key;
                      const matSurcharge = MATERIAL_PRESETS[part.materialType].surcharge;
                      return (
                        <button
                          key={key}
                          onClick={() => handleSoundClick(() => setActivePart(key))}
                          className={`flex items-center justify-between p-2.5 rounded-xl text-xs text-left transition-all border ${
                            isSelected
                              ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)] scale-[1.02]"
                              : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90"
                          }`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className={isSelected ? "text-cyan-400" : "text-slate-500"}>
                              {PART_ICONS[key]}
                            </span>
                            <span className="truncate font-medium">{part.label}</span>
                          </div>
                          <div
                            className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: part.color }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Active Zone Details */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white font-heading">
                      {currentPartConfig.label}
                    </span>
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                      {MATERIAL_PRESETS[currentPartConfig.materialType].surcharge > 0
                        ? `+${formatCurrency(MATERIAL_PRESETS[currentPartConfig.materialType].surcharge)}`
                        : "Standard"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {currentPartConfig.description}
                  </p>
                </div>

                {/* 3. Material Finish Options */}
                <div>
                  <label className="text-[11px] font-heading uppercase tracking-wider text-slate-400 block mb-2">
                    MATERIAL FINISH & SHADER
                  </label>
                  <div className="space-y-1.5">
                    {(Object.keys(MATERIAL_PRESETS) as MaterialType[]).map((matKey) => {
                      const mat = MATERIAL_PRESETS[matKey];
                      const isSelected = currentPartConfig.materialType === matKey;
                      return (
                        <button
                          key={matKey}
                          onClick={() =>
                            handleSoundClick(() => setPartMaterial(activePart, matKey), "color")
                          }
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all border ${
                            isSelected
                              ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.25)]"
                              : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3.5 h-3.5 rounded-full border ${
                                isSelected ? "border-cyan-400 bg-cyan-400" : "border-slate-600 bg-slate-800"
                              } flex items-center justify-center`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 text-black" />}
                            </div>
                            <span className="font-medium">{mat.name}</span>
                          </div>
                          <span className="font-mono-code text-[11px] text-slate-400">
                            {mat.surcharge > 0 ? `+${formatCurrency(mat.surcharge)}` : "$0"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Color Palette & Custom Hex Swatch */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-heading uppercase tracking-wider text-slate-400">
                      COLOR & EMISSIVE TINT
                    </label>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-3.5 h-3.5 rounded border border-white/40"
                        style={{ backgroundColor: currentPartConfig.color }}
                      />
                      <span className="font-mono-code text-[11px] text-cyan-400 uppercase">
                        {currentPartConfig.color}
                      </span>
                    </div>
                  </div>

                  {/* Preset Swatches Matrix */}
                  <div className="grid grid-cols-6 gap-2 mb-3">
                    {COLOR_PALETTES.map((palette) => {
                      const isSelected =
                        currentPartConfig.color.toLowerCase() === palette.hex.toLowerCase();
                      return (
                        <button
                          key={palette.name}
                          onClick={() =>
                            handleSoundClick(() => setPartColor(activePart, palette.hex), "color")
                          }
                          title={palette.name}
                          className={`group relative aspect-square rounded-xl transition-all duration-200 flex items-center justify-center ${
                            isSelected
                              ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 scale-110 shadow-[0_0_12px_rgba(0,240,255,0.6)]"
                              : "hover:scale-105 border border-white/10"
                          }`}
                          style={{ backgroundColor: palette.hex }}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-black mix-blend-difference" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Hex Picker Input */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                    <Palette className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-400">Custom Color:</span>
                    <input
                      type="color"
                      value={currentPartConfig.color}
                      onChange={(e) => setPartColor(activePart, e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 outline-none"
                    />
                    <input
                      type="text"
                      value={currentPartConfig.color}
                      onChange={(e) => setPartColor(activePart, e.target.value)}
                      maxLength={7}
                      className="w-20 px-2 py-0.5 rounded bg-slate-900 text-xs font-mono-code text-cyan-400 uppercase border border-slate-700 outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </>
            )}

            {/* THEME PRESETS TAB */}
            {activeTab === "presets" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 leading-normal">
                  Select curated cyberpunk aesthetics crafted by footwear concept designers:
                </p>
                <div className="space-y-2.5">
                  {THEME_PRESETS.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleSoundClick(() => applyThemePreset(theme.id))}
                      className="w-full text-left p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold font-heading text-slate-200 group-hover:text-cyan-300">
                          {theme.name}
                        </span>
                        <span className="text-[9px] font-mono-code px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-400 border border-cyan-500/30">
                          {theme.badge}
                        </span>
                      </div>
                      {/* Swatch Previews */}
                      <div className="flex items-center gap-1.5">
                        {Object.values(theme.parts).map((p, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: p.color }}
                          />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STUDIO LIGHTING TAB */}
            {activeTab === "lighting" && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 leading-normal">
                  Switch high-fidelity real-time 3D studio environments and lighting rigs:
                </p>
                <div className="space-y-2">
                  {LIGHTING_OPTIONS.map((light) => {
                    const isSelected = environment === light.id;
                    return (
                      <button
                        key={light.id}
                        onClick={() => handleSoundClick(() => setEnvironment(light.id), "tick")}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all border ${
                          isSelected
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)]"
                            : "bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{light.icon}</span>
                          <div>
                            <p className="text-xs font-bold font-heading">{light.label}</p>
                            <p className="text-[11px] text-slate-400 font-mono-code">{light.desc}</p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. MOBILE FLOATING ACCORDION DRAWER BUTTON (Mobile only) */}
      <div className="pointer-events-auto md:hidden w-full flex flex-col gap-2 mb-2">
        {/* Mobile Camera Bar */}
        <div className="flex items-center justify-center gap-2 cyber-glass py-1.5 px-3 rounded-xl border border-cyan-500/20">
          {CAMERA_OPTIONS.map((cam) => (
            <button
              key={cam.id}
              onClick={() => handleSoundClick(() => setCameraPreset(cam.id), "tick")}
              className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 ${
                cameraPreset === cam.id
                  ? "bg-cyan-500/30 text-cyan-300 border border-cyan-400"
                  : "text-slate-400"
              }`}
            >
              <span>{cam.icon}</span>
              <span className="text-[10px] font-mono-code">{cam.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile Customizer Drawer Sheet */}
        <div className="cyber-glass rounded-2xl border border-cyan-500/20 overflow-hidden shadow-2xl">
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-950/80 text-xs font-heading font-bold text-cyan-300"
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>CUSTOMIZE: {currentPartConfig.label}</span>
            </div>
            {mobileDrawerOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>

          {mobileDrawerOpen && (
            <div className="p-4 max-h-72 overflow-y-auto space-y-4">
              {/* Zone Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {(Object.keys(parts) as PartKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleSoundClick(() => setActivePart(key))}
                    className={`px-3 py-1.5 rounded-xl text-xs shrink-0 font-medium border ${
                      activePart === key
                        ? "bg-cyan-500/30 text-cyan-300 border-cyan-400"
                        : "bg-slate-900/80 text-slate-400 border-slate-800"
                    }`}
                  >
                    {parts[key].label}
                  </button>
                ))}
              </div>

              {/* Material Chips */}
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(MATERIAL_PRESETS) as MaterialType[]).map((matKey) => (
                  <button
                    key={matKey}
                    onClick={() =>
                      handleSoundClick(() => setPartMaterial(activePart, matKey), "color")
                    }
                    className={`p-2 rounded-xl text-[11px] text-left border ${
                      currentPartConfig.materialType === matKey
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-400"
                        : "bg-slate-900/60 text-slate-300 border-slate-800"
                    }`}
                  >
                    {MATERIAL_PRESETS[matKey].name}
                  </button>
                ))}
              </div>

              {/* Swatches */}
              <div className="grid grid-cols-6 gap-2">
                {COLOR_PALETTES.map((palette) => (
                  <button
                    key={palette.name}
                    onClick={() =>
                      handleSoundClick(() => setPartColor(activePart, palette.hex), "color")
                    }
                    className={`h-8 rounded-lg border ${
                      currentPartConfig.color.toLowerCase() === palette.hex.toLowerCase()
                        ? "ring-2 ring-cyan-400 scale-105"
                        : "border-white/20"
                    }`}
                    style={{ backgroundColor: palette.hex }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. BOTTOM PRICE HUD & SPEC SHEET CTA */}
      <footer className="pointer-events-auto flex items-center justify-between cyber-glass px-4 md:px-6 py-3 rounded-2xl border border-cyan-500/20 shadow-2xl">
        {/* Dynamic Price Display */}
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[10px] uppercase font-mono-code text-slate-400 block tracking-widest">
              TOTAL CONFIG PRICE
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl md:text-3xl font-black font-heading tracking-wide text-white">
                {formatCurrency(totalPrice)}
              </span>
              <span className="text-[11px] font-mono-code text-cyan-400">
                (BASE + FINISH SURCHARGES)
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (soundEnabled) cyberAudio.playSelect();
              setSpecSheetOpen(true);
            }}
            className="px-4 md:px-7 py-2.5 md:py-3 rounded-xl font-heading font-bold text-xs md:text-sm tracking-wider uppercase bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 text-black shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:shadow-[0_0_35px_rgba(0,240,255,0.9)] hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center gap-2 border border-cyan-200"
          >
            <FileText className="w-4 h-4 text-black" />
            <span>ORDER & SPEC SHEET</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
