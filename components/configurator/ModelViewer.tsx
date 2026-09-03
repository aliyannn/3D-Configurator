"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { useStudioStore } from "@/store/useStudioStore";
import { STUDIO_MATERIALS, StudioMaterialType } from "@/data/modelsCatalog";
import { cyberAudio } from "@/lib/audio";
import { ProceduralCar } from "@/components/studio/models/ProceduralCar";

// Helper Dynamic PBR Material for Vehicle Parts
interface VehicleMaterialProps {
  modelId: string;
  partId: string;
  fallbackColor?: string;
  defaultFinish?: StudioMaterialType;
}

function useVehiclePartMaterial({
  modelId,
  partId,
  fallbackColor = "#991B1B",
  defaultFinish = "gloss",
}: VehicleMaterialProps) {
  const modelConfig = useStudioStore((state) => state.configurations[modelId]);
  const activePartId = useStudioStore((state) => state.activePartId);
  const hoveredPartId = useStudioStore((state) => state.hoveredPartId);

  const partState = modelConfig?.[partId] || {
    color: fallbackColor,
    material: defaultFinish,
  };
  const matDef = STUDIO_MATERIALS[partState.material] || STUDIO_MATERIALS[defaultFinish];

  const isActive = activePartId === partId;
  const isHovered = hoveredPartId === partId;

  return useMemo(() => {
    const color = new THREE.Color(partState.color);
    const emissive = isActive
      ? new THREE.Color(partState.color).multiplyScalar(0.2)
      : isHovered
      ? new THREE.Color(partState.color).multiplyScalar(0.1)
      : new THREE.Color(0x000000);

    return new THREE.MeshPhysicalMaterial({
      color,
      roughness: matDef.roughness,
      metalness: matDef.metalness,
      clearcoat: matDef.clearcoat,
      clearcoatRoughness: matDef.clearcoatRoughness || 0.08,
      emissive,
      emissiveIntensity: isActive ? 0.5 : isHovered ? 0.25 : 0.0,
      envMapIntensity: matDef.metalness > 0.8 ? 2.5 : 1.5,
    });
  }, [partState.color, partState.material, matDef, isActive, isHovered]);
}

// 🏍️ Detailed Honda CG 125 / Cafe Racer 3D Model
function HondaCG125Model() {
  const modelId = "honda_cg125";
  const setActivePartId = useStudioStore((state) => state.setActivePartId);
  const setHoveredPartId = useStudioStore((state) => state.setHoveredPartId);
  const soundEnabled = useStudioStore((state) => state.soundEnabled);

  const tankMat = useVehiclePartMaterial({
    modelId,
    partId: "fuelTank",
    fallbackColor: "#991B1B",
    defaultFinish: "gloss",
  });
  const seatMat = useVehiclePartMaterial({
    modelId,
    partId: "seat",
    fallbackColor: "#78350F",
    defaultFinish: "matte",
  });
  const engineMat = useVehiclePartMaterial({
    modelId,
    partId: "engine",
    fallbackColor: "#E2E8F0",
    defaultFinish: "chrome",
  });
  const exhaustMat = useVehiclePartMaterial({
    modelId,
    partId: "exhaust",
    fallbackColor: "#F1F5F9",
    defaultFinish: "chrome",
  });
  const wheelsMat = useVehiclePartMaterial({
    modelId,
    partId: "wheels",
    fallbackColor: "#0F172A",
    defaultFinish: "matte",
  });
  const headlightMat = useVehiclePartMaterial({
    modelId,
    partId: "headlight",
    fallbackColor: "#FACC15",
    defaultFinish: "gloss",
  });
  const handlebarsMat = useVehiclePartMaterial({
    modelId,
    partId: "handlebars",
    fallbackColor: "#18181B",
    defaultFinish: "matte",
  });

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

  // Teardrop Cafe Tank Geometry with Knee Indents
  const tankGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.45, 0.0);
    shape.lineTo(0.65, 0.0);
    shape.quadraticCurveTo(0.85, 0.35, 0.55, 0.48);
    shape.quadraticCurveTo(-0.1, 0.52, -0.45, 0.28);
    shape.closePath();

    const extrudeSettings = {
      steps: 3,
      depth: 0.46,
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
    <group position={[0, 0.58, 0]}>
      {/* 1. FUEL TANK (fuelTank) */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "fuelTank")}
        onPointerOver={(e) => handlePointerOver(e, "fuelTank")}
        onPointerOut={handlePointerOut}
      >
        <mesh geometry={tankGeom} position={[0.18, 0.48, 0]} material={tankMat} castShadow receiveShadow />
        {/* Monza Chrome Gas Cap */}
        <mesh position={[0.28, 0.74, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 24]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Vintage Tank Strap */}
        <mesh position={[0.18, 0.5, 0]}>
          <boxGeometry args={[0.06, 0.5, 0.48]} />
          <meshStandardMaterial color="#18181B" roughness={0.6} />
        </mesh>
      </group>

      {/* 2. TUCK & ROLL SEAT (seat) */}
      <group
        position={[-0.42, 0.46, 0]}
        onPointerDown={(e) => handlePointerDown(e, "seat")}
        onPointerOver={(e) => handlePointerOver(e, "seat")}
        onPointerOut={handlePointerOut}
      >
        {/* Ribbed Tuck & Roll Cushion */}
        <mesh rotation={[0, 0, -0.04]} material={seatMat} castShadow>
          <boxGeometry args={[0.62, 0.12, 0.32]} />
        </mesh>
        {/* Classic Cafe Racer Rear Tail Cowl */}
        <mesh position={[-0.38, 0.04, 0]} material={tankMat} castShadow>
          <capsuleGeometry args={[0.16, 0.18, 8, 16]} />
        </mesh>
      </group>

      {/* 3. ENGINE & CYLINDER HEAD (engine) */}
      <group
        position={[0.05, 0.04, 0]}
        onPointerDown={(e) => handlePointerDown(e, "engine")}
        onPointerOver={(e) => handlePointerOver(e, "engine")}
        onPointerOut={handlePointerOut}
      >
        {/* Main Crankcase Engine Block */}
        <mesh material={engineMat} castShadow receiveShadow>
          <boxGeometry args={[0.54, 0.42, 0.38]} />
        </mesh>
        {/* Air-Cooled Cylinder Head with Cooling Fins */}
        {[-0.08, -0.02, 0.04, 0.1, 0.16, 0.22].map((y, idx) => (
          <mesh key={idx} position={[0.12, 0.25 + y, 0]} material={engineMat} castShadow>
            <boxGeometry args={[0.36, 0.018, 0.34]} />
          </mesh>
        ))}
        {/* Mikuni Carburetor & Air Filter Cone */}
        <mesh position={[-0.22, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.04, 0.16, 16]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Kickstarter Lever */}
        <mesh position={[-0.15, -0.05, 0.22]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 12]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* 4. CHASSIS FRAME & SWINGARM */}
      <group>
        {/* Tubular Trellis Rails */}
        {[-0.14, 0.14].map((z, idx) => (
          <group key={idx} position={[0, 0, z]}>
            <mesh position={[0.1, 0.35, 0]} rotation={[0, 0, -0.2]}>
              <cylinderGeometry args={[0.028, 0.028, 1.25, 12]} />
              <meshStandardMaterial color="#18181B" roughness={0.7} />
            </mesh>
            <mesh position={[0.25, 0.08, 0]} rotation={[0, 0, 0.65]}>
              <cylinderGeometry args={[0.025, 0.025, 0.82, 12]} />
              <meshStandardMaterial color="#18181B" roughness={0.7} />
            </mesh>
          </group>
        ))}
        {/* Front Inverted Forks */}
        <group position={[1.1, 0.18, 0]} rotation={[0, 0, -0.36]}>
          <mesh position={[0, 0, 0.14]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 1.25, 16]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, -0.14]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 1.25, 16]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
        {/* Rear Swingarm */}
        <mesh position={[-0.75, -0.05, 0]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.72, 0.06, 0.3]} />
          <meshStandardMaterial color="#18181B" roughness={0.7} />
        </mesh>
      </group>

      {/* 5. EXHAUST & MUFFLER (exhaust) */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "exhaust")}
        onPointerOver={(e) => handlePointerOver(e, "exhaust")}
        onPointerOut={handlePointerOut}
      >
        {/* Curved Header Pipe from Engine */}
        <mesh position={[0.3, -0.12, 0.2]} rotation={[0, 0, 0.42]} material={exhaustMat} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.72, 16]} />
        </mesh>
        {/* Reverse-Cone Megaphone Muffler */}
        <mesh position={[-0.45, 0.02, 0.26]} rotation={[0, -0.1, -0.28]} material={exhaustMat} castShadow>
          <cylinderGeometry args={[0.08, 0.045, 0.85, 20]} />
        </mesh>
      </group>

      {/* 6. SPOKE WHEELS & BRAKES (wheels) */}
      <group
        onPointerDown={(e) => handlePointerDown(e, "wheels")}
        onPointerOver={(e) => handlePointerOver(e, "wheels")}
        onPointerOut={handlePointerOut}
      >
        {/* Front Wheel: [1.38, -0.12, 0] */}
        <group position={[1.38, -0.12, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.4, 0.09, 16, 32]} />
            <meshStandardMaterial color="#181A1F" roughness={0.85} metalness={0.05} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={wheelsMat} castShadow>
            <cylinderGeometry args={[0.36, 0.36, 0.08, 24]} />
          </mesh>
          {/* Front Brake Disc Rotor */}
          <mesh position={[0, 0, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.02, 16]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.92} roughness={0.15} />
          </mesh>
        </group>

        {/* Rear Wheel: [-1.22, -0.12, 0] */}
        <group position={[-1.22, -0.12, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.4, 0.11, 16, 32]} />
            <meshStandardMaterial color="#181A1F" roughness={0.85} metalness={0.05} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={wheelsMat} castShadow>
            <cylinderGeometry args={[0.36, 0.36, 0.1, 24]} />
          </mesh>
        </group>
      </group>

      {/* 7. HEADLIGHT & VISOR (headlight) */}
      <group
        position={[1.22, 0.58, 0]}
        onPointerDown={(e) => handlePointerDown(e, "headlight")}
        onPointerOver={(e) => handlePointerOver(e, "headlight")}
        onPointerOut={handlePointerOut}
      >
        {/* Classic 7-inch Bucket */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.14, 24]} />
          <meshStandardMaterial color="#18181B" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Tinted Front Glass Lens */}
        <mesh position={[0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={headlightMat}>
          <cylinderGeometry args={[0.14, 0.14, 0.02, 24]} />
        </mesh>
        {/* Headlight Protection Wire Grill */}
        <mesh position={[0.09, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.13, 0.015, 8, 24]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* 8. HANDLEBARS & GRIPS (handlebars) */}
      <group
        position={[0.95, 0.76, 0]}
        onPointerDown={(e) => handlePointerDown(e, "handlebars")}
        onPointerOver={(e) => handlePointerOver(e, "handlebars")}
        onPointerOut={handlePointerOut}
      >
        {/* Clip-On Handlebar Crossbar */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={handlebarsMat} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.72, 16]} />
        </mesh>
        {/* Left & Right Retro Rubber Grips */}
        {[-0.32, 0.32].map((z, i) => (
          <mesh key={i} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.12, 16]} />
            <meshStandardMaterial color="#18181B" roughness={0.9} />
          </mesh>
        ))}
        {/* Dual Mini Speedometer Gauges */}
        <mesh position={[0.04, 0.08, 0.08]} rotation={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.04, 0.08, -0.08]} rotation={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

export function ModelViewer() {
  const activeModelId = useStudioStore((state) => state.activeModelId);

  if (activeModelId === "honda_cg125") {
    return <HondaCG125Model />;
  }

  // Toyota GR Supra or Corolla GR
  return <ProceduralCar />;
}
