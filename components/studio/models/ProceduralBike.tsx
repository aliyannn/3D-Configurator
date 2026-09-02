"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { useStudioStore } from "@/store/useStudioStore";
import { StudioMeshMaterial } from "./StudioMeshMaterial";
import { cyberAudio } from "@/lib/audio";

export function ProceduralBike() {
  const modelId = "bike_valkyrie";
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

  // 1. Sculpted Fuel Tank Shape
  const tankGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.4, 0.0);
    shape.lineTo(0.6, 0.0);
    shape.quadraticCurveTo(0.8, 0.35, 0.5, 0.48);
    shape.quadraticCurveTo(-0.1, 0.52, -0.4, 0.28);
    shape.closePath();

    const extrudeSettings = {
      steps: 2,
      depth: 0.44,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.08,
      bevelSegments: 4,
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  return (
    <group position={[0, 0.5, 0]}>
      {/* 1. FUEL TANK & REAR COWL (tank) */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "tank")}
        onPointerOver={(e) => handlePointerOver(e, "tank")}
        onPointerOut={handlePointerOut}
      >
        {/* Sculpted Aluminum Fuel Tank */}
        <mesh geometry={tankGeom} position={[0.2, 0.48, 0]} castShadow>
          <StudioMeshMaterial modelId={modelId} partId="tank" wireframe={wireframe} />
        </mesh>
        {/* Aerodynamic Cafe Racer Tail Cowl */}
        <mesh position={[-0.85, 0.44, 0]} rotation={[0, 0, -0.15]} castShadow>
          <capsuleGeometry args={[0.18, 0.28, 8, 16]} />
          <StudioMeshMaterial modelId={modelId} partId="tank" wireframe={wireframe} />
        </mesh>
      </group>

      {/* 2. STITCHED LEATHER SADDLE (seat) */}
      <group
        position={[-0.35, 0.46, 0]}
        onPointerDown={(e) => handlePointerDown(e, "seat")}
        onPointerOver={(e) => handlePointerOver(e, "seat")}
        onPointerOut={handlePointerOut}
      >
        <mesh rotation={[0, 0, -0.05]} castShadow>
          <boxGeometry args={[0.55, 0.1, 0.3]} />
          <StudioMeshMaterial modelId={modelId} partId="seat" wireframe={wireframe} />
        </mesh>
      </group>

      {/* 3. TRELLIS STRUCTURAL FRAME & ENGINE BLOCK (frame) */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "frame")}
        onPointerOver={(e) => handlePointerOver(e, "frame")}
        onPointerOut={handlePointerOut}
      >
        {/* Tubular Trellis Rails */}
        {[-0.15, 0.15].map((z, idx) => (
          <group key={idx} position={[0, 0, z]}>
            {/* Top Backbone Tube */}
            <mesh position={[0.1, 0.35, 0]} rotation={[0, 0, -0.2]}>
              <cylinderGeometry args={[0.03, 0.03, 1.2, 12]} />
              <StudioMeshMaterial modelId={modelId} partId="frame" wireframe={wireframe} />
            </mesh>
            {/* Diagonal Cradle Struts */}
            <mesh position={[0.25, 0.05, 0]} rotation={[0, 0, 0.7]}>
              <cylinderGeometry args={[0.025, 0.025, 0.8, 12]} />
              <StudioMeshMaterial modelId={modelId} partId="frame" wireframe={wireframe} />
            </mesh>
            <mesh position={[-0.25, 0.05, 0]} rotation={[0, 0, -0.6]}>
              <cylinderGeometry args={[0.025, 0.025, 0.75, 12]} />
              <StudioMeshMaterial modelId={modelId} partId="frame" wireframe={wireframe} />
            </mesh>
          </group>
        ))}

        {/* Engine Block */}
        <mesh position={[0.05, 0.05, 0]} castShadow>
          <boxGeometry args={[0.55, 0.45, 0.38]} />
          <meshStandardMaterial color="#2B3240" roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Front Inverted Telescopic Forks & Triple Tree */}
        <group position={[1.05, 0.15, 0]} rotation={[0, 0, -0.38]}>
          <mesh position={[0, 0, 0.14]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 1.15, 16]} />
            <StudioMeshMaterial modelId={modelId} partId="frame" wireframe={wireframe} />
          </mesh>
          <mesh position={[0, 0, -0.14]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 1.15, 16]} />
            <StudioMeshMaterial modelId={modelId} partId="frame" wireframe={wireframe} />
          </mesh>
          {/* Clip-On Handlebars */}
          <mesh position={[0, 0.58, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.65, 12]} />
            <StudioMeshMaterial modelId={modelId} partId="frame" wireframe={wireframe} />
          </mesh>
          {/* Round Cafe Headlight */}
          <mesh position={[0.15, 0.42, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.12, 0.12, 0.1, 24]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Rear Swingarm */}
        <mesh position={[-0.75, -0.05, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.7, 0.06, 0.32]} />
          <StudioMeshMaterial modelId={modelId} partId="frame" wireframe={wireframe} />
        </mesh>
      </group>

      {/* 4. TITANIUM EXHAUST PIPES & MUFFLER (exhaust) */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "exhaust")}
        onPointerOver={(e) => handlePointerOver(e, "exhaust")}
        onPointerOut={handlePointerOut}
      >
        {/* Header Pipe Curved under Engine */}
        <mesh position={[0.28, -0.12, 0.2]} rotation={[0, 0, 0.4]} castShadow>
          <cylinderGeometry args={[0.038, 0.038, 0.65, 16]} />
          <StudioMeshMaterial modelId={modelId} partId="exhaust" wireframe={wireframe} />
        </mesh>
        {/* Megaphone Up-Swept Muffler */}
        <mesh position={[-0.45, 0.02, 0.26]} rotation={[0, -0.1, -0.3]} castShadow>
          <cylinderGeometry args={[0.075, 0.04, 0.75, 16]} />
          <StudioMeshMaterial modelId={modelId} partId="exhaust" wireframe={wireframe} />
        </mesh>
      </group>

      {/* 5. WHEELS & SPOKED RIMS (wheels) */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "wheels")}
        onPointerOver={(e) => handlePointerOver(e, "wheels")}
        onPointerOut={handlePointerOut}
      >
        {/* Front Wheel: [1.32, -0.15, 0] */}
        <group position={[1.32, -0.15, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.38, 0.09, 16, 32]} />
            <meshStandardMaterial color="#111317" roughness={0.8} metalness={0.1} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.08, 24]} />
            <StudioMeshMaterial modelId={modelId} partId="wheels" wireframe={wireframe} />
          </mesh>
          {/* Front Dual Brake Discs */}
          {[-0.07, 0.07].map((z, i) => (
            <mesh key={i} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.02, 16]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
        </group>

        {/* Rear Wheel: [-1.2, -0.15, 0] */}
        <group position={[-1.2, -0.15, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.38, 0.11, 16, 32]} />
            <meshStandardMaterial color="#111317" roughness={0.8} metalness={0.1} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.1, 24]} />
            <StudioMeshMaterial modelId={modelId} partId="wheels" wireframe={wireframe} />
          </mesh>
          {/* Rear Drive Sprocket */}
          <mesh position={[0, 0, -0.09]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
