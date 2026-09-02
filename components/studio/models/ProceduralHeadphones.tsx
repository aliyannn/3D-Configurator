"use client";

import React from "react";
import { useStudioStore } from "@/store/useStudioStore";
import { StudioMeshMaterial } from "./StudioMeshMaterial";
import { cyberAudio } from "@/lib/audio";

export function ProceduralHeadphones() {
  const modelId = "headphones_aura";
  const wireframe = useStudioStore((state) => state.wireframe);
  const setActivePartId = useStudioStore((state) => state.setActivePartId);
  const setHoveredPartId = useStudioStore((state) => state.setHoveredPartId);
  const soundEnabled = useStudioStore((state) => state.soundEnabled);

  const handlePointerDown = (e: any, partId: string) => {
    e.stopPropagation();
    setActivePartId(partId);
    if (soundEnabled) cyberAudio.playSelect();
  };

  const handlePointerOver = (e: any, partId: string) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
    setHoveredPartId(partId);
    if (soundEnabled) cyberAudio.playTick();
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = "auto";
    setHoveredPartId(null);
  };

  return (
    <group position={[0, 0.45, 0]}>
      {/* 1. STRUCTURAL HEADBAND (headband) */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "headband")}
        onPointerOver={(e) => handlePointerOver(e, "headband")}
        onPointerOut={handlePointerOut}
      >
        {/* Curved Steel Arch Band */}
        <mesh position={[0, 0.55, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.78, 0.035, 16, 48, Math.PI]} />
          <StudioMeshMaterial modelId={modelId} partId="headband" wireframe={wireframe} />
        </mesh>
        {/* Soft Ergonomic Inner Silicone Cushion Pad */}
        <mesh position={[0, 0.55, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.74, 0.045, 12, 32, (Math.PI * 2) / 3]} />
          <StudioMeshMaterial modelId={modelId} partId="headband" wireframe={wireframe} />
        </mesh>
      </group>

      {/* 2. ACOUSTIC EARCUPS (earcups) */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "earcups")}
        onPointerOver={(e) => handlePointerOver(e, "earcups")}
        onPointerOut={handlePointerOut}
      >
        {/* Left Earcup */}
        <mesh position={[-0.86, 0.32, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.34, 0.38, 0.22, 32]} />
          <StudioMeshMaterial modelId={modelId} partId="earcups" wireframe={wireframe} />
        </mesh>
        {/* Right Earcup */}
        <mesh position={[0.86, 0.32, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.34, 0.38, 0.22, 32]} />
          <StudioMeshMaterial modelId={modelId} partId="earcups" wireframe={wireframe} />
        </mesh>
      </group>

      {/* 3. MEMORY FOAM EAR CUSHIONS (cushions) */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "cushions")}
        onPointerOver={(e) => handlePointerOver(e, "cushions")}
        onPointerOut={handlePointerOut}
      >
        {/* Left Ear Cushion Ring */}
        <mesh position={[-0.72, 0.32, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <torusGeometry args={[0.26, 0.1, 16, 32]} />
          <StudioMeshMaterial modelId={modelId} partId="cushions" wireframe={wireframe} />
        </mesh>
        {/* Right Ear Cushion Ring */}
        <mesh position={[0.72, 0.32, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <torusGeometry args={[0.26, 0.1, 16, 32]} />
          <StudioMeshMaterial modelId={modelId} partId="cushions" wireframe={wireframe} />
        </mesh>
      </group>

      {/* 4. GIMBAL RINGS & PIVOT ACCENTS (accents) */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "accents")}
        onPointerOver={(e) => handlePointerOver(e, "accents")}
        onPointerOut={handlePointerOut}
      >
        {/* Left Gimbal Yoke */}
        <mesh position={[-0.86, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.42, 0.025, 12, 24, Math.PI]} />
          <StudioMeshMaterial modelId={modelId} partId="accents" wireframe={wireframe} />
        </mesh>
        {/* Left Accent Badge */}
        <mesh position={[-0.98, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.02, 24]} />
          <StudioMeshMaterial modelId={modelId} partId="accents" wireframe={wireframe} />
        </mesh>

        {/* Right Gimbal Yoke */}
        <mesh position={[0.86, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.42, 0.025, 12, 24, Math.PI]} />
          <StudioMeshMaterial modelId={modelId} partId="accents" wireframe={wireframe} />
        </mesh>
        {/* Right Accent Badge */}
        <mesh position={[0.98, 0.32, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.02, 24]} />
          <StudioMeshMaterial modelId={modelId} partId="accents" wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}
