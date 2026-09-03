"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { useStudioStore } from "@/store/useStudioStore";
import { STUDIO_MATERIALS, StudioMaterialType } from "@/data/modelsCatalog";
import { cyberAudio } from "@/lib/audio";

interface PartMatProps {
  partId: string;
  fallbackColor: string;
  defaultFinish: StudioMaterialType;
}

function useCGPartMaterial({ partId, fallbackColor, defaultFinish }: PartMatProps) {
  const modelConfig = useStudioStore((state) => state.configurations["honda_cg125"]);
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
      emissiveIntensity: isActive ? 0.45 : isHovered ? 0.2 : 0.0,
      envMapIntensity: matDef.metalness > 0.8 ? 2.6 : 1.6,
    });
  }, [partState.color, partState.material, matDef, isActive, isHovered]);
}

export function HondaCG125Model() {
  const setActivePartId = useStudioStore((state) => state.setActivePartId);
  const setHoveredPartId = useStudioStore((state) => state.setHoveredPartId);
  const soundEnabled = useStudioStore((state) => state.soundEnabled);
  const headlightStyle = useStudioStore((state) => state.headlightStyle);

  // Materials
  const tankMat = useCGPartMaterial({
    partId: "fuelTank",
    fallbackColor: "#0F172A",
    defaultFinish: "gloss",
  });
  const engineMat = useCGPartMaterial({
    partId: "engine",
    fallbackColor: "#E2E8F0",
    defaultFinish: "chrome",
  });
  const exhaustMat = useCGPartMaterial({
    partId: "exhaust",
    fallbackColor: "#F8FAFC",
    defaultFinish: "chrome",
  });
  const seatMat = useCGPartMaterial({
    partId: "seat",
    fallbackColor: "#18181B",
    defaultFinish: "matte",
  });
  const wheelsMat = useCGPartMaterial({
    partId: "wheels",
    fallbackColor: "#E2E8F0",
    defaultFinish: "chrome",
  });
  const headlightMat = useCGPartMaterial({
    partId: "headlight",
    fallbackColor: "#F8FAFC",
    defaultFinish: "gloss",
  });

  const handlePartClick = (e: any, partId: string) => {
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

  // Authentic CG 125 Fuel Tank Geometry (Slender teardrop with knee contour)
  const tankGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.48, 0.0);
    shape.lineTo(0.58, 0.0);
    shape.quadraticCurveTo(0.72, 0.28, 0.52, 0.44);
    shape.quadraticCurveTo(-0.05, 0.48, -0.48, 0.26);
    shape.closePath();

    const extrudeSettings = {
      steps: 4,
      depth: 0.38,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.07,
      bevelSegments: 5,
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  return (
    <group position={[0, 0.52, 0]}>
      {/* ========================================================================= */}
      {/* 1. FUEL TANK & SIDE COVERS (fuelTank) */}
      {/* ========================================================================= */}
      <group
        onPointerDown={(e) => handlePartClick(e, "fuelTank")}
        onPointerOver={(e) => handlePointerOver(e, "fuelTank")}
        onPointerOut={handlePointerOut}
      >
        {/* Main Fuel Tank */}
        <mesh geometry={tankGeometry} position={[0.16, 0.44, 0]} material={tankMat} castShadow receiveShadow />

        {/* Chrome Gas Cap */}
        <mesh position={[0.26, 0.69, 0]}>
          <cylinderGeometry args={[0.05, 0.055, 0.03, 24]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.98} roughness={0.06} />
        </mesh>

        {/* Left & Right Honda Wing Graphics on Tank */}
        {[-0.205, 0.205].map((z, idx) => (
          <group key={idx} position={[0.18, 0.44, z]} rotation={[0, idx === 0 ? Math.PI : 0, 0]}>
            {/* Iconic Red / Gold Wing Decal Stripe */}
            <mesh position={[0, 0, 0.005]}>
              <planeGeometry args={[0.24, 0.06]} />
              <meshBasicMaterial color="#E11D48" transparent opacity={0.9} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0.02, -0.035, 0.006]}>
              <planeGeometry args={[0.26, 0.025]} />
              <meshBasicMaterial color="#F59E0B" transparent opacity={0.9} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        {/* Dual Side Covers below Seat with CG 125 Badge */}
        {[-0.17, 0.17].map((z, idx) => (
          <group key={`cover-${idx}`} position={[-0.15, 0.2, z]}>
            <mesh material={tankMat} castShadow>
              <boxGeometry args={[0.28, 0.2, 0.04]} />
            </mesh>
            {/* White/Red CG 125 Emblem plate */}
            <mesh position={[0, 0, idx === 0 ? -0.022 : 0.022]}>
              <planeGeometry args={[0.18, 0.05]} />
              <meshBasicMaterial color="#F8FAFC" side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, idx === 0 ? -0.023 : 0.023]}>
              <planeGeometry args={[0.12, 0.025]} />
              <meshBasicMaterial color="#DC2626" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 2. AUTHENTIC OHV 125cc SINGLE-CYLINDER ENGINE (engine) */}
      {/* ========================================================================= */}
      <group
        position={[0.06, 0.02, 0]}
        onPointerDown={(e) => handlePartClick(e, "engine")}
        onPointerOver={(e) => handlePointerOver(e, "engine")}
        onPointerOut={handlePointerOut}
      >
        {/* Main Crankcase Block */}
        <mesh material={engineMat} castShadow receiveShadow>
          <boxGeometry args={[0.48, 0.36, 0.34]} />
        </mesh>

        {/* Circular Stamped "HONDA" Side Casings */}
        {[-0.18, 0.18].map((z, idx) => (
          <mesh key={idx} position={[0, -0.02, z]} rotation={[Math.PI / 2, 0, 0]} material={engineMat} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.04, 28]} />
          </mesh>
        ))}

        {/* Cylinder Block with Cooling Fins (Pushrod OHV architecture) */}
        {[-0.07, -0.02, 0.03, 0.08, 0.13, 0.18, 0.23].map((y, idx) => (
          <mesh key={`fin-${idx}`} position={[0.08, 0.18 + y, 0]} material={engineMat} castShadow>
            <boxGeometry args={[0.32, 0.016, 0.3]} />
          </mesh>
        ))}

        {/* Finned Cylinder Head & Rocker Cover */}
        <mesh position={[0.08, 0.44, 0]} material={engineMat} castShadow>
          <boxGeometry args={[0.26, 0.08, 0.24]} />
        </mesh>

        {/* Spark Plug & High-Tension Boot */}
        <mesh position={[0.08, 0.5, 0.08]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.09, 12]} />
          <meshStandardMaterial color="#18181B" roughness={0.7} />
        </mesh>

        {/* Right-Side Kickstarter Pedal with Rubber Footpad */}
        <group position={[-0.14, -0.04, 0.21]} rotation={[0.4, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.26, 12]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.13, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.024, 0.024, 0.08, 12]} />
            <meshStandardMaterial color="#18181B" roughness={0.8} />
          </mesh>
        </group>

        {/* Left-Side Gear Shifter Pedal */}
        <group position={[0.04, -0.12, -0.21]} rotation={[-0.2, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.14, 0.018, 0.03]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0.06, 0, -0.03]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.05, 12]} />
            <meshStandardMaterial color="#18181B" roughness={0.8} />
          </mesh>
        </group>

        {/* Mikuni Carburetor & Black Intake Tube */}
        <mesh position={[-0.18, 0.14, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.05, 0.14, 16]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 3. OEM LONG CHROME SILENCER & EXHAUST PIPE (exhaust) */}
      {/* ========================================================================= */}
      <group
        onPointerDown={(e) => handlePartClick(e, "exhaust")}
        onPointerOver={(e) => handlePointerOver(e, "exhaust")}
        onPointerOut={handlePointerOut}
      >
        {/* Continuous Curved Header Pipe looping from cylinder under crankcase */}
        <mesh position={[0.26, -0.14, 0.18]} rotation={[0, 0, 0.38]} material={exhaustMat} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.68, 16]} />
        </mesh>
        {/* Authentic Long Straight Cylindrical Silencer */}
        <mesh position={[-0.56, -0.06, 0.24]} rotation={[0, 0, -0.08]} material={exhaustMat} castShadow>
          <cylinderGeometry args={[0.065, 0.045, 1.15, 24]} />
        </mesh>
        {/* Slotted Chrome Heat Shield Plate */}
        <mesh position={[-0.32, -0.04, 0.28]} rotation={[0, 0, -0.08]}>
          <boxGeometry args={[0.42, 0.07, 0.015]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.98} roughness={0.06} />
        </mesh>
        {/* Chrome Exhaust Mounting Hanger to Pillion Footrest */}
        <mesh position={[-0.45, 0.14, 0.23]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.012, 0.012, 0.38, 8]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 4. OEM RIBBED DUAL PASSENGER SEAT & REAR LIGHT (seat) */}
      {/* ========================================================================= */}
      <group
        position={[-0.42, 0.44, 0]}
        onPointerDown={(e) => handlePartClick(e, "seat")}
        onPointerOver={(e) => handlePointerOver(e, "seat")}
        onPointerOut={handlePointerOut}
      >
        {/* Long Dual Passenger Vinyl Cushion with Ribs */}
        <mesh material={seatMat} castShadow>
          <boxGeometry args={[0.76, 0.14, 0.28]} />
        </mesh>
        {/* Horizontal Heat-Pressed Ribbed Seams */}
        {[-0.26, -0.18, -0.1, -0.02, 0.06, 0.14, 0.22, 0.3].map((x, i) => (
          <mesh key={i} position={[x, 0.075, 0]}>
            <boxGeometry args={[0.02, 0.015, 0.27]} />
            <meshStandardMaterial color="#0A0A0A" roughness={0.8} />
          </mesh>
        ))}

        {/* White "HONDA" Stencil across Rear Seat */}
        <mesh position={[-0.382, 0.01, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.18, 0.04]} />
          <meshBasicMaterial color="#F8FAFC" side={THREE.DoubleSide} />
        </mesh>

        {/* Chrome Pillion Grab Rail wrapping around rear */}
        <mesh position={[-0.42, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.16, 0.014, 8, 20, Math.PI]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.98} roughness={0.06} />
        </mesh>

        {/* Rear Red Rectangular Taillight with Chrome Bracket */}
        <mesh position={[-0.46, -0.04, 0]}>
          <boxGeometry args={[0.08, 0.09, 0.14]} />
          <meshStandardMaterial color="#DC2626" roughness={0.2} metalness={0.2} emissive="#7F1D1D" emissiveIntensity={0.3} />
        </mesh>
        {/* Rear Rectangular Amber Turn Signals */}
        {[-0.14, 0.14].map((z, idx) => (
          <mesh key={idx} position={[-0.46, -0.04, z]}>
            <boxGeometry args={[0.05, 0.05, 0.06]} />
            <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.2} emissive="#B45309" emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 5. 18-INCH CHROME WIRE-SPOKE WHEELS & DRUM HUBS (wheels) */}
      {/* ========================================================================= */}
      <group
        onPointerDown={(e) => handlePartClick(e, "wheels")}
        onPointerOver={(e) => handlePointerOver(e, "wheels")}
        onPointerOut={handlePointerOut}
      >
        {/* FRONT WHEEL ASSEMBLY: Position [1.32, -0.14, 0] */}
        <group position={[1.32, -0.14, 0]}>
          {/* Deep-Tread Cafe Road Tire */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.38, 0.085, 16, 32]} />
            <meshStandardMaterial color="#1E232A" roughness={0.88} metalness={0.02} />
          </mesh>
          {/* 18" Chrome Wire Spoke Rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]} material={wheelsMat} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.06, 28]} />
          </mesh>
          {/* Center Aluminum Drum Brake Hub */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.14, 0.09, 20]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Front Chrome Mudguard with Twin Support Stays */}
          <mesh position={[-0.04, 0.18, 0]} rotation={[0, 0, 0.2]}>
            <torusGeometry args={[0.44, 0.055, 8, 24, Math.PI * 0.7]} />
            <meshStandardMaterial color="#FFFFFF" metalness={0.98} roughness={0.06} />
          </mesh>
        </group>

        {/* REAR WHEEL ASSEMBLY: Position [-1.22, -0.14, 0] */}
        <group position={[-1.22, -0.14, 0]}>
          {/* Rear Road Tire */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.38, 0.095, 16, 32]} />
            <meshStandardMaterial color="#1E232A" roughness={0.88} metalness={0.02} />
          </mesh>
          {/* 18" Chrome Wire Spoke Rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]} material={wheelsMat} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.08, 28]} />
          </mesh>
          {/* Center Rear Drum Brake & Sprocket Hub */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.11, 20]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.88} roughness={0.22} />
          </mesh>
          {/* Rear Chrome Mudguard */}
          <mesh position={[0.04, 0.18, 0]} rotation={[0, 0, -0.3]}>
            <torusGeometry args={[0.44, 0.06, 8, 24, Math.PI * 0.65]} />
            <meshStandardMaterial color="#FFFFFF" metalness={0.98} roughness={0.06} />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 6. OEM RECTANGULAR HEADLAMP & DUAL GAUGES CLUSTER (headlight) */}
      {/* ========================================================================= */}
      <group
        position={[1.16, 0.54, 0]}
        onPointerDown={(e) => handlePartClick(e, "headlight")}
        onPointerOver={(e) => handlePointerOver(e, "headlight")}
        onPointerOut={handlePointerOut}
      >
        {headlightStyle === "rectangular" ? (
          /* AUTHENTIC OEM HONDA RECTANGULAR HEADLAMP */
          <group>
            {/* Black Rectangular Housing Bucket */}
            <mesh castShadow>
              <boxGeometry args={[0.14, 0.15, 0.22]} />
              <meshStandardMaterial color="#18181B" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Chrome Bezel Surround */}
            <mesh position={[0.072, 0, 0]}>
              <boxGeometry args={[0.015, 0.16, 0.23]} />
              <meshStandardMaterial color="#FFFFFF" metalness={0.98} roughness={0.06} />
            </mesh>
            {/* Fluted Rectangular Glass Lens */}
            <mesh position={[0.08, 0, 0]} material={headlightMat}>
              <boxGeometry args={[0.01, 0.13, 0.2]} />
            </mesh>
            {/* Flanking Rectangular Amber Turn Signals with Chrome Stalks */}
            {[-0.17, 0.17].map((z, idx) => (
              <group key={idx} position={[0, 0, z]}>
                {/* Chrome Stalk */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.012, 0.012, 0.08, 8]} />
                  <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
                </mesh>
                {/* Amber Signal Indicator */}
                <mesh position={[0.02, 0, idx === 0 ? -0.04 : 0.04]}>
                  <boxGeometry args={[0.05, 0.05, 0.05]} />
                  <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.2} emissive="#B45309" emissiveIntensity={0.25} />
                </mesh>
              </group>
            ))}
          </group>
        ) : (
          /* CUSTOM 7-INCH ROUND CAFE RACER HEADLAMP */
          <group>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.14, 0.14, 0.14, 24]} />
              <meshStandardMaterial color="#18181B" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={headlightMat}>
              <cylinderGeometry args={[0.135, 0.135, 0.02, 24]} />
            </mesh>
            <mesh position={[0.085, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.13, 0.012, 8, 24]} />
              <meshStandardMaterial color="#FFFFFF" metalness={0.98} roughness={0.06} />
            </mesh>
          </group>
        )}

        {/* DUAL RECTANGULAR INSTRUMENT CLUSTER (Speedometer + Tachometer) */}
        <group position={[-0.14, 0.22, 0]} rotation={[-0.35, 0, 0]}>
          {/* Housing Pod */}
          <mesh castShadow>
            <boxGeometry args={[0.08, 0.1, 0.22]} />
            <meshStandardMaterial color="#18181B" roughness={0.5} />
          </mesh>
          {/* Left Speedometer & Right Tachometer Dials */}
          {[-0.06, 0.06].map((z, idx) => (
            <mesh key={idx} position={[0.042, 0.01, z]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[0.07, 0.07]} />
              <meshBasicMaterial color="#09090B" side={THREE.DoubleSide} />
            </mesh>
          ))}
          {/* Center Ignition Key Switch */}
          <mesh position={[0.042, 0.01, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.01, 12]} />
            <meshStandardMaterial color="#FFFFFF" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 7. CHASSIS FRAME, TELESCOPIC FORKS, REAR DUAL SHOCKS & CENTER STAND */}
      {/* ========================================================================= */}
      <group>
        {/* Front Telescopic Forks */}
        <group position={[1.06, 0.14, 0]} rotation={[0, 0, -0.36]}>
          {[-0.13, 0.13].map((z, idx) => (
            <group key={idx} position={[0, 0, z]}>
              {/* Chrome Stanchion Tube */}
              <mesh position={[0, 0.25, 0]} castShadow>
                <cylinderGeometry args={[0.024, 0.024, 0.65, 16]} />
                <meshStandardMaterial color="#FFFFFF" metalness={0.98} roughness={0.06} />
              </mesh>
              {/* Lower Aluminum Slider */}
              <mesh position={[0, -0.22, 0]} castShadow>
                <cylinderGeometry args={[0.034, 0.034, 0.55, 16]} />
                <meshStandardMaterial color="#CBD5E1" metalness={0.88} roughness={0.2} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Dual Rear Coil-Over Shocks */}
        {[-0.17, 0.17].map((z, idx) => (
          <group key={`shock-${idx}`} position={[-0.85, 0.16, z]} rotation={[0, 0, 0.32]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.026, 0.026, 0.48, 16]} />
              <meshStandardMaterial color="#FFFFFF" metalness={0.98} roughness={0.06} />
            </mesh>
          </group>
        ))}

        {/* Black Tubular Diamond Cradle Frame */}
        {[-0.11, 0.11].map((z, idx) => (
          <group key={`frame-${idx}`} position={[0, 0, z]}>
            <mesh position={[0.12, 0.3, 0]} rotation={[0, 0, -0.22]}>
              <cylinderGeometry args={[0.022, 0.022, 1.1, 12]} />
              <meshStandardMaterial color="#18181B" roughness={0.65} />
            </mesh>
            <mesh position={[0.22, 0.06, 0]} rotation={[0, 0, 0.62]}>
              <cylinderGeometry args={[0.02, 0.02, 0.74, 12]} />
              <meshStandardMaterial color="#18181B" roughness={0.65} />
            </mesh>
          </group>
        ))}

        {/* Chrome Commuter Handlebars with Grips & Dual Rectangular Mirrors */}
        <group position={[0.92, 0.72, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.74, 16]} />
            <meshStandardMaterial color="#FFFFFF" metalness={0.98} roughness={0.06} />
          </mesh>
          {/* Dual Rectangular Chrome Mirrors */}
          {[-0.32, 0.32].map((z, idx) => (
            <group key={idx} position={[0.04, 0.14, z]}>
              <mesh rotation={[0, 0, -0.2]}>
                <cylinderGeometry args={[0.008, 0.008, 0.22, 8]} />
                <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.08} />
              </mesh>
              <mesh position={[0, 0.11, 0]}>
                <boxGeometry args={[0.015, 0.07, 0.12]} />
                <meshStandardMaterial color="#18181B" metalness={0.5} roughness={0.5} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Authentic Center Stand touching the ground! */}
        <group position={[-0.1, -0.26, 0]}>
          {[-0.13, 0.13].map((z, idx) => (
            <mesh key={idx} position={[0, 0, z]} rotation={[0, 0, 0.15]} castShadow>
              <cylinderGeometry args={[0.018, 0.018, 0.28, 12]} />
              <meshStandardMaterial color="#18181B" roughness={0.8} />
            </mesh>
          ))}
          {/* Foot Lever */}
          <mesh position={[0, -0.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.014, 0.014, 0.28, 8]} />
            <meshStandardMaterial color="#18181B" roughness={0.8} />
          </mesh>
        </group>

        {/* Rider & Pillion Rubber Footpegs */}
        {[-0.19, 0.19].map((z, idx) => (
          <group key={idx}>
            {/* Rider Peg */}
            <mesh position={[0.04, -0.18, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.022, 0.022, 0.11, 12]} />
              <meshStandardMaterial color="#18181B" roughness={0.9} />
            </mesh>
            {/* Pillion Peg */}
            <mesh position={[-0.45, -0.06, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.018, 0.018, 0.09, 12]} />
              <meshStandardMaterial color="#18181B" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
