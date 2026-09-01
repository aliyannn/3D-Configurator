"use client";

import React, { useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { UIOverlay } from "@/components/configurator/UIOverlay";
import { SpecSheetModal } from "@/components/configurator/SpecSheetModal";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";

// Dynamically import Canvas with SSR disabled for WebGL safety
const ConfiguratorCanvas = dynamic(
  () =>
    import("@/components/configurator/ConfiguratorCanvas").then(
      (mod) => mod.ConfiguratorCanvas
    ),
  { ssr: false }
);

export default function ConfiguratorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setCapturedImage = useConfiguratorStore((state) => state.setCapturedImage);
  const configSerialNumber = useConfiguratorStore((state) => state.configSerialNumber);

  const handleCaptureScreenshot = useCallback(() => {
    // Locate the WebGL Canvas in DOM
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL("image/png");
      setCapturedImage(dataUrl);

      // Create download trigger
      const link = document.createElement("a");
      link.download = `CyberSneaker_${configSerialNumber}_Render.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Screenshot capture failed:", err);
    }
  }, [setCapturedImage, configSerialNumber]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#030407] scanlines">
      {/* Background Cyber Grid Lines */}
      <div className="absolute inset-0 cyber-grid-bg opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-cyber-glow pointer-events-none opacity-60" />

      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <ConfiguratorCanvas canvasRef={canvasRef} />
      </div>

      {/* Interactive UI HUD Layer */}
      <UIOverlay onCaptureScreenshot={handleCaptureScreenshot} />

      {/* Holographic Spec Sheet & Checkout Modal */}
      <SpecSheetModal />
    </main>
  );
}
