"use client";

import React, { useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { MinimalTopBar } from "@/components/configurator/MinimalTopBar";
import { MinimalFloatingDock } from "@/components/configurator/MinimalFloatingDock";
import { MinimalSpecModal } from "@/components/configurator/MinimalSpecModal";
import { GlbUploadModal } from "@/components/studio/GlbUploadModal";
import { useStudioStore } from "@/store/useStudioStore";

// Dynamically import ConfiguratorCanvas with SSR disabled for safe WebGL initialization
const ConfiguratorCanvas = dynamic(
  () =>
    import("@/components/configurator/ConfiguratorCanvas").then(
      (mod) => mod.ConfiguratorCanvas
    ),
  { ssr: false }
);

export default function ConfiguratorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setCapturedImage = useStudioStore((state) => state.setCapturedImage);
  const buildSerial = useStudioStore((state) => state.buildSerial);
  const currentModel = useStudioStore((state) => state.getCurrentModel());

  // Instant Snapshot Capture
  const handleCaptureSnapshot = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL("image/png");
      setCapturedImage(dataUrl);

      // Create download link
      const link = document.createElement("a");
      link.download = `${currentModel.id}_${buildSerial}_Render.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Snapshot capture failed:", err);
    }
  }, [setCapturedImage, buildSerial, currentModel.id]);

  return (
    <main className="fixed inset-0 w-full h-screen overflow-hidden bg-gradient-to-b from-[#161922] via-[#0D0F14] to-[#07090C]">
      {/* Neutral Showroom Ambient Radial Studio Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* Fullscreen 3D Automotive Showroom Viewport */}
      <div className="absolute inset-0 z-0">
        <ConfiguratorCanvas canvasRef={canvasRef} />
      </div>

      {/* Floating Ultra-Clean HUD Interface */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-10">
        {/* Top Minimal Pill Bar */}
        <MinimalTopBar onCaptureSnapshot={handleCaptureSnapshot} />

        {/* Centered Minimal Floating Customizer Dock */}
        <MinimalFloatingDock />
      </div>

      {/* Apple-Grade Spec Sheet Modal */}
      <MinimalSpecModal />

      {/* Custom 3D Model Upload Modal */}
      <GlbUploadModal />
    </main>
  );
}
