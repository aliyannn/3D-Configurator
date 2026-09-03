"use client";

import React, { useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { UIOverlay } from "@/components/configurator/UIOverlay";
import { SpecSheetModal } from "@/components/configurator/SpecSheetModal";
import { FileUploader } from "@/components/configurator/FileUploader";
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

  // Instant Snapshot Capture with Clean Studio Watermark
  const handleCaptureSnapshot = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    try {
      // Create offscreen canvas to stamp clean watermark
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const ctx = exportCanvas.getContext("2d");

      if (ctx) {
        // Draw 3D scene
        ctx.drawImage(canvas, 0, 0);

        // Draw clean studio watermark
        const fontSize = Math.max(16, Math.round(canvas.width / 45));
        ctx.font = `600 ${fontSize}px sans-serif`;
        ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
        ctx.textAlign = "right";
        ctx.fillText("Built via Aliyan 3D Studio", canvas.width - 30, canvas.height - 30);

        const dataUrl = exportCanvas.toDataURL("image/png");
        setCapturedImage(dataUrl);

        // Download trigger
        const link = document.createElement("a");
        link.download = `${currentModel.id}_${buildSerial}_AliyanStudio.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error("Snapshot capture failed:", err);
    }
  }, [setCapturedImage, buildSerial, currentModel.id]);

  return (
    <main className="fixed inset-0 w-full h-screen overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]">
      {/* Soft Studio Radial Showroom Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.95)_0%,rgba(226,232,240,0.7)_75%)] pointer-events-none" />

      {/* Fullscreen 3D Automotive Showroom Viewport */}
      <div className="absolute inset-0 z-0">
        <ConfiguratorCanvas canvasRef={canvasRef} />
      </div>

      {/* Floating UI HUD (Brand & Model Pickers, Bottom Floating Dock) */}
      <UIOverlay onCaptureSnapshot={handleCaptureSnapshot} />

      {/* Mechanic-Ready Printable Spec Sheet Modal */}
      <SpecSheetModal />

      {/* Universal Generic 3D Model File Uploader */}
      <FileUploader />
    </main>
  );
}
