"use client";

import React from "react";
import { useStudioStore } from "@/store/useStudioStore";
import { StudioMeshMaterial } from "./StudioMeshMaterial";
import { cyberAudio } from "@/lib/audio";

export function ProceduralSofa() {
  const modelId = "sofa_haven";
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

  // Leg Coordinates: [Front-Left, Front-Right, Rear-Left, Rear-Right]
  const legPositions: [number, number, number][] = [
    [-1.25, -0.22, 0.42],
    [1.25, -0.22, 0.42],
    [-1.25, -0.22, -0.42],
    [1.25, -0.22, -0.42],
  ];

  return (
    <group position={[0, 0.45, 0]}>
      {/* 1. MAIN UPHOLSTERY FABRIC (fabric) */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "fabric")}
        onPointerOver={(e) => handlePointerOver(e, "fabric")}
        onPointerOut={handlePointerOut}
      >
        {/* Main Base Bench Platform */}
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.28, 1.05]} />
          <StudioMeshMaterial modelId={modelId} partId="fabric" wireframe={wireframe} />
        </mesh>
        {/* Backrest Wall */}
        <mesh position={[0, 0.52, -0.42]} rotation={[-0.08, 0, 0]} castShadow>
          <boxGeometry args={[2.8, 0.65, 0.24]} />
          <StudioMeshMaterial modelId={modelId} partId="fabric" wireframe={wireframe} />
        </mesh>
        {/* Left Armrest */}
        <mesh position={[-1.38, 0.35, 0]} castShadow>
          <boxGeometry args={[0.22, 0.42, 1.08]} />
          <StudioMeshMaterial modelId={modelId} partId="fabric" wireframe={wireframe} />
        </mesh>
        {/* Right Armrest */}
        <mesh position={[1.38, 0.35, 0]} castShadow>
          <boxGeometry args={[0.22, 0.42, 1.08]} />
          <StudioMeshMaterial modelId={modelId} partId="fabric" wireframe={wireframe} />
        </mesh>
      </group>

      {/* 2. ACCENT CUSHIONS (cushions) */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "cushions")}
        onPointerOver={(e) => handlePointerOver(e, "cushions")}
        onPointerOut={handlePointerOut}
      >
        {/* 3 Main Seat Cushions */}
        {[-0.82, 0.0, 0.82].map((x, idx) => (
          <mesh key={idx} position={[x, 0.28, 0.06]} castShadow receiveShadow>
            <boxGeometry args={[0.78, 0.16, 0.86]} />
            <StudioMeshMaterial modelId={modelId} partId="cushions" wireframe={wireframe} />
          </mesh>
        ))}

        {/* 3 Backrest Pillows */}
        {[-0.82, 0.0, 0.82].map((x, idx) => (
          <mesh
            key={`b-${idx}`}
            position={[x, 0.54, -0.28]}
            rotation={[-0.12, 0, 0]}
            castShadow
          >
            <boxGeometry args={[0.76, 0.44, 0.16]} />
            <StudioMeshMaterial modelId={modelId} partId="cushions" wireframe={wireframe} />
          </mesh>
        ))}

        {/* Left & Right Cylindrical Bolster Accent Pillows */}
        <mesh position={[-1.15, 0.42, 0.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.65, 24]} />
          <StudioMeshMaterial modelId={modelId} partId="cushions" wireframe={wireframe} />
        </mesh>
        <mesh position={[1.15, 0.42, 0.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.65, 24]} />
          <StudioMeshMaterial modelId={modelId} partId="cushions" wireframe={wireframe} />
        </mesh>
      </group>

      {/* 3. SOLID PERIMETER WOODEN TRIM (woodTrim) */}
      <group
        position={[0, -0.08, 0]}
        onPointerDown={(e) => handlePointerDown(e, "woodTrim")}
        onPointerOver={(e) => handlePointerOver(e, "woodTrim")}
        onPointerOut={handlePointerOut}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.84, 0.06, 1.08]} />
          <StudioMeshMaterial modelId={modelId} partId="woodTrim" wireframe={wireframe} />
        </mesh>
      </group>

      {/* 4. TAPERED SUPPORT LEGS (legs) */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "legs")}
        onPointerOver={(e) => handlePointerOver(e, "legs")}
        onPointerOut={handlePointerOut}
      >
        {legPositions.map((pos, idx) => (
          <mesh
            key={idx}
            position={pos}
            rotation={[pos[2] > 0 ? 0.15 : -0.15, 0, pos[0] > 0 ? -0.15 : 0.15]}
            castShadow
          >
            <cylinderGeometry args={[0.035, 0.02, 0.26, 16]} />
            <StudioMeshMaterial modelId={modelId} partId="legs" wireframe={wireframe} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
