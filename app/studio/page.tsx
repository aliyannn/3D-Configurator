"use client";

import React, { useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { TopCategoryNav } from "@/components/studio/TopCategoryNav";
import { CustomizerDock } from "@/components/studio/CustomizerDock";
import { BuildSpecModal } from "@/components/studio/BuildSpecModal";
import { GlbUploadModal } from "@/components/studio/GlbUploadModal";
import { useStudioStore } from "@/store/useStudioStore";

// Dynamically import Canvas with SSR disabled for safe WebGL initialization
const StudioCanvas = dynamic(
  () =>
    import("@/components/studio/StudioCanvas").then((mod) => mod.StudioCanvas),
  { ssr: false }
);

export default function StudioPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setCapturedImage = useStudioStore((state) => state.setCapturedImage);
  const buildSerial = useStudioStore((state) => state.buildSerial);
  const currentModel = useStudioStore((state) => state.getCurrentModel());

  // 4K Snapshot Capture Function
  const handleCaptureSnapshot = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL("image/png");
      setCapturedImage(dataUrl);

      // Create download trigger
      const link = document.createElement("a");
      link.download = `${currentModel.id}_${buildSerial}_Render.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Studio snapshot capture failed:", err);
    }
  }, [setCapturedImage, buildSerial, currentModel.id]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#05070D] scanlines">
      {/* Background Cybernetic Ambient Vignette */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-cyber-glow pointer-events-none opacity-50" />

      {/* 3D WebGL Studio Canvas Viewport */}
      <div className="absolute inset-0 z-0">
        <StudioCanvas canvasRef={canvasRef} />
      </div>

      {/* Sketchfab-Grade Floating UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 md:p-5 z-10">
        {/* Top Category Navigation & Toolbar */}
        <TopCategoryNav onCaptureSnapshot={handleCaptureSnapshot} />

        {/* Bottom Interactive Customizer Dock */}
        <CustomizerDock />
      </div>

      {/* Build Spec Sheet & Export Modal */}
      <BuildSpecModal />

      {/* Custom .GLB File / URL Upload Modal */}
      <GlbUploadModal />
    </main>
  );
}
