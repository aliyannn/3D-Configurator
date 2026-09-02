"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { useStudioStore } from "@/store/useStudioStore";
import { StudioMeshMaterial } from "./StudioMeshMaterial";
import { cyberAudio } from "@/lib/audio";

export function ProceduralSneaker() {
  const modelId = "sneaker_apex";
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

  // Sole profile
  const soleGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1.4, -0.1);
    shape.lineTo(1.3, -0.1);
    shape.quadraticCurveTo(1.6, 0.1, 1.5, 0.35);
    shape.lineTo(1.0, 0.36);
    shape.quadraticCurveTo(0.2, 0.22, -0.5, 0.28);
    shape.lineTo(-1.25, 0.4);
    shape.quadraticCurveTo(-1.55, 0.22, -1.4, -0.1);

    const extrudeSettings = {
      steps: 2,
      depth: 0.85,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.08,
      bevelSegments: 4,
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  // Upper Body profile
  const upperGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1.2, 0.0);
    shape.lineTo(1.0, 0.0);
    shape.quadraticCurveTo(1.35, 0.2, 1.2, 0.42);
    shape.quadraticCurveTo(0.75, 0.58, 0.2, 0.82);
    shape.lineTo(-0.25, 1.0);
    shape.quadraticCurveTo(-0.75, 0.88, -1.1, 0.68);
    shape.quadraticCurveTo(-1.3, 0.38, -1.2, 0.0);

    const extrudeSettings = {
      steps: 3,
      depth: 0.72,
      bevelEnabled: true,
      bevelThickness: 0.09,
      bevelSize: 0.09,
      bevelSegments: 4,
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  // Wing Accent profile
  const wingGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.8, 0.1);
    shape.lineTo(0.5, 0.22);
    shape.lineTo(0.2, 0.45);
    shape.lineTo(-0.55, 0.36);
    shape.lineTo(-0.78, 0.52);
    shape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  return (
    <group position={[0, 0.2, 0]}>
      {/* 1. SOLE & TREAD (sole) */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "sole")}
        onPointerOver={(e) => handlePointerOver(e, "sole")}
        onPointerOut={handlePointerOut}
      >
        <mesh geometry={soleGeom} position={[0, -0.12, 0]} castShadow receiveShadow>
          <StudioMeshMaterial modelId={modelId} partId="sole" wireframe={wireframe} />
        </mesh>
        {/* Outsole Tread Blocks */}
        {[-0.9, -0.5, -0.1, 0.3, 0.7, 1.0].map((x, i) => (
          <mesh key={i} position={[x, -0.28, 0]} castShadow>
            <boxGeometry args={[0.12, 0.06, 0.78]} />
            <StudioMeshMaterial modelId={modelId} partId="sole" wireframe={wireframe} />
          </mesh>
        ))}
      </group>

      {/* 2. KINETIC AIR PODS (airPods) */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "airPods")}
        onPointerOver={(e) => handlePointerOver(e, "airPods")}
        onPointerOut={handlePointerOut}
      >
        {[-0.7, -0.3, 0.4, 0.75].map((x, idx) => (
          <group key={idx} position={[x, -0.1, 0]}>
            <mesh position={[0, 0, 0.42]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <capsuleGeometry args={[0.09, 0.15, 8, 16]} />
              <StudioMeshMaterial modelId={modelId} partId="airPods" wireframe={wireframe} />
            </mesh>
            <mesh position={[0, 0, -0.42]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <capsuleGeometry args={[0.09, 0.15, 8, 16]} />
              <StudioMeshMaterial modelId={modelId} partId="airPods" wireframe={wireframe} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 3. UPPER AEROMESH (upperMesh) */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "upperMesh")}
        onPointerOver={(e) => handlePointerOver(e, "upperMesh")}
        onPointerOut={handlePointerOut}
      >
        <mesh geometry={upperGeom} position={[0, 0.3, 0]} castShadow receiveShadow>
          <StudioMeshMaterial modelId={modelId} partId="upperMesh" wireframe={wireframe} />
        </mesh>
      </group>

      {/* 4. KINETIC LACES (laces) */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "laces")}
        onPointerOver={(e) => handlePointerOver(e, "laces")}
        onPointerOut={handlePointerOut}
      >
        {[-0.1, 0.15, 0.4, 0.65].map((x, i) => (
          <mesh
            key={i}
            position={[x, 0.55 + (4 - i) * 0.05, 0]}
            rotation={[0, 0, -0.2]}
            castShadow
          >
            <boxGeometry args={[0.07, 0.035, 0.5]} />
            <StudioMeshMaterial modelId={modelId} partId="laces" wireframe={wireframe} />
          </mesh>
        ))}
        {/* Magnetic Lace Lock */}
        <mesh position={[0.25, 0.74, 0]} rotation={[0, 0, -0.22]} castShadow>
          <boxGeometry args={[0.16, 0.07, 0.2]} />
          <StudioMeshMaterial modelId={modelId} partId="laces" wireframe={wireframe} />
        </mesh>
      </group>

      {/* 5. AERO DOWNFORCE WINGS (accents) */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "accents")}
        onPointerOver={(e) => handlePointerOver(e, "accents")}
        onPointerOut={handlePointerOut}
      >
        <mesh geometry={wingGeom} position={[0, 0.35, 0.39]} castShadow>
          <StudioMeshMaterial modelId={modelId} partId="accents" wireframe={wireframe} />
        </mesh>
        <mesh
          geometry={wingGeom}
          position={[0, 0.35, -0.39]}
          rotation={[0, Math.PI, 0]}
          castShadow
        >
          <StudioMeshMaterial modelId={modelId} partId="accents" wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}
