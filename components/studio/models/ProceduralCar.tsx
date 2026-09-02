"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { useStudioStore } from "@/store/useStudioStore";
import { StudioMeshMaterial } from "./StudioMeshMaterial";
import { cyberAudio } from "@/lib/audio";

export function ProceduralCar() {
  const modelId = "car_gtx";
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

  // 1. Aerodynamic Car Body Contour
  const bodyGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-2.2, 0.25);
    shape.lineTo(-2.0, 0.55);
    shape.quadraticCurveTo(-1.2, 0.75, 0.0, 0.72); // Rear engine deck
    shape.quadraticCurveTo(1.2, 0.65, 1.8, 0.42); // Hood slope
    shape.lineTo(2.3, 0.25); // Front splitter nose
    shape.lineTo(2.3, 0.05);
    shape.lineTo(-2.2, 0.05); // Flat underfloor
    shape.closePath();

    const extrudeSettings = {
      steps: 3,
      depth: 1.6,
      bevelEnabled: true,
      bevelThickness: 0.15,
      bevelSize: 0.12,
      bevelSegments: 4,
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  // 2. Cockpit Canopy Glass
  const glassGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.9, 0.2);
    shape.quadraticCurveTo(-0.6, 0.65, -0.1, 0.68); // Roof peak
    shape.quadraticCurveTo(0.6, 0.62, 1.1, 0.2); // Windshield slope
    shape.closePath();

    const extrudeSettings = {
      steps: 2,
      depth: 1.1,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.08,
      bevelSegments: 3,
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  // 4 Wheel Positions: [Front-Right, Front-Left, Rear-Right, Rear-Left]
  const wheelPositions: [number, number, number][] = [
    [1.4, 0.05, 0.88],
    [1.4, 0.05, -0.88],
    [-1.35, 0.05, 0.88],
    [-1.35, 0.05, -0.88],
  ];

  return (
    <group position={[0, 0.35, 0]}>
      {/* 1. CHASSIS / EXTERIOR BODY */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "body")}
        onPointerOver={(e) => handlePointerOver(e, "body")}
        onPointerOut={handlePointerOut}
      >
        <mesh geometry={bodyGeom} position={[0, 0.3, 0]} castShadow receiveShadow>
          <StudioMeshMaterial modelId={modelId} partId="body" wireframe={wireframe} />
        </mesh>
        {/* Front Wheel Arch Flares */}
        <mesh position={[1.4, 0.36, 0]} castShadow>
          <boxGeometry args={[0.9, 0.35, 1.85]} />
          <StudioMeshMaterial modelId={modelId} partId="body" wireframe={wireframe} />
        </mesh>
        {/* Rear Wheel Arch Flares */}
        <mesh position={[-1.35, 0.42, 0]} castShadow>
          <boxGeometry args={[1.0, 0.42, 1.88]} />
          <StudioMeshMaterial modelId={modelId} partId="body" wireframe={wireframe} />
        </mesh>
      </group>

      {/* 2. COCKPIT GLASS */}
      <group
        position={[0.1, 0.62, 0]}
        onPointerDown={(e) => handlePointerDown(e, "windows")}
        onPointerOver={(e) => handlePointerOver(e, "windows")}
        onPointerOut={handlePointerOut}
      >
        <mesh geometry={glassGeom} castShadow receiveShadow>
          <StudioMeshMaterial modelId={modelId} partId="windows" wireframe={wireframe} />
        </mesh>
      </group>

      {/* 3. WHEEL RIMS & TIRES */}
      <group>
        {wheelPositions.map((pos, idx) => (
          <group key={idx} position={pos}>
            {/* Outer Rubber Tire */}
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[0.36, 0.12, 16, 32]} />
              <meshStandardMaterial color="#1a1a1f" roughness={0.8} metalness={0.1} />
            </mesh>
            {/* Customizable Forged Alloy Rim */}
            <group
              onPointerDown={(e) => handlePointerDown(e, "rims")}
              onPointerOver={(e) => handlePointerOver(e, "rims")}
              onPointerOut={handlePointerOut}
            >
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.34, 0.34, 0.18, 24]} />
                <StudioMeshMaterial modelId={modelId} partId="rims" wireframe={wireframe} />
              </mesh>
              {/* Turbine Multi-Spokes */}
              {[0, 45, 90, 135].map((angle, sIdx) => (
                <mesh
                  key={sIdx}
                  rotation={[0, 0, (angle * Math.PI) / 180]}
                  position={[0, 0, pos[2] > 0 ? 0.08 : -0.08]}
                >
                  <boxGeometry args={[0.62, 0.05, 0.04]} />
                  <StudioMeshMaterial modelId={modelId} partId="rims" wireframe={wireframe} />
                </mesh>
              ))}
            </group>

            {/* 4. BRAKE CALIPERS & ROTOR */}
            <group
              onPointerDown={(e) => handlePointerDown(e, "calipers")}
              onPointerOver={(e) => handlePointerOver(e, "calipers")}
              onPointerOut={handlePointerOut}
            >
              {/* Brake Rotor Disc */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.26, 0.26, 0.04, 16]} />
                <meshStandardMaterial color="#94A3B8" roughness={0.2} metalness={0.9} />
              </mesh>
              {/* Performance Brake Caliper Block */}
              <mesh position={[0.18, 0.12, pos[2] > 0 ? 0.06 : -0.06]}>
                <boxGeometry args={[0.16, 0.12, 0.08]} />
                <StudioMeshMaterial modelId={modelId} partId="calipers" wireframe={wireframe} />
              </mesh>
            </group>
          </group>
        ))}
      </group>

      {/* 5. AERO TRIM, SPLITTERS & REAR SPOILER WING */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "trim")}
        onPointerOver={(e) => handlePointerOver(e, "trim")}
        onPointerOut={handlePointerOut}
      >
        {/* Front Aero Splitter Blade */}
        <mesh position={[2.28, 0.12, 0]} castShadow>
          <boxGeometry args={[0.3, 0.04, 1.72]} />
          <StudioMeshMaterial modelId={modelId} partId="trim" wireframe={wireframe} />
        </mesh>
        {/* Side Skirt Blades */}
        <mesh position={[0, 0.1, 0.86]} castShadow>
          <boxGeometry args={[2.4, 0.04, 0.08]} />
          <StudioMeshMaterial modelId={modelId} partId="trim" wireframe={wireframe} />
        </mesh>
        <mesh position={[0, 0.1, -0.86]} castShadow>
          <boxGeometry args={[2.4, 0.04, 0.08]} />
          <StudioMeshMaterial modelId={modelId} partId="trim" wireframe={wireframe} />
        </mesh>
        {/* Rear High-Downforce GT Spoiler Wing */}
        <group position={[-2.15, 0.82, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.28, 0.04, 1.7]} />
            <StudioMeshMaterial modelId={modelId} partId="trim" wireframe={wireframe} />
          </mesh>
          {/* Spoiler Vertical Endplates */}
          <mesh position={[0, 0.06, 0.85]} castShadow>
            <boxGeometry args={[0.32, 0.18, 0.03]} />
            <StudioMeshMaterial modelId={modelId} partId="trim" wireframe={wireframe} />
          </mesh>
          <mesh position={[0, 0.06, -0.85]} castShadow>
            <boxGeometry args={[0.32, 0.18, 0.03]} />
            <StudioMeshMaterial modelId={modelId} partId="trim" wireframe={wireframe} />
          </mesh>
          {/* Spoiler Pylon Uprights */}
          <mesh position={[0, -0.16, 0.4]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.04, 0.32, 0.04]} />
            <StudioMeshMaterial modelId={modelId} partId="trim" wireframe={wireframe} />
          </mesh>
          <mesh position={[0, -0.16, -0.4]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.04, 0.32, 0.04]} />
            <StudioMeshMaterial modelId={modelId} partId="trim" wireframe={wireframe} />
          </mesh>
        </group>
        {/* Rear Air Diffuser Vent Strakes */}
        <mesh position={[-2.25, 0.18, 0]} rotation={[0, 0, 0.25]}>
          <boxGeometry args={[0.22, 0.14, 1.4]} />
          <StudioMeshMaterial modelId={modelId} partId="trim" wireframe={wireframe} />
        </mesh>
      </group>
    </group>
  );
}
