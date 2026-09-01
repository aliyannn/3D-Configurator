"use client";

import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import {
  useConfiguratorStore,
  PartKey,
  MATERIAL_PRESETS,
  MaterialType,
} from "@/store/useConfiguratorStore";
import { cyberAudio } from "@/lib/audio";

// Reusable Dynamic PBR Material Component
interface DynamicPBRMaterialProps {
  partKey: PartKey;
  wireframe?: boolean;
}

function DynamicPBRMaterial({ partKey, wireframe = false }: DynamicPBRMaterialProps) {
  const part = useConfiguratorStore((state) => state.parts[partKey]);
  const hoveredPart = useConfiguratorStore((state) => state.hoveredPart);
  const activePart = useConfiguratorStore((state) => state.activePart);

  const matConfig = MATERIAL_PRESETS[part.materialType];
  const isHovered = hoveredPart === partKey;
  const isActive = activePart === partKey;

  const color = useMemo(() => new THREE.Color(part.color), [part.color]);
  const emissiveColor = useMemo(() => {
    if (part.materialType === "neon") {
      return new THREE.Color(part.color);
    }
    if (isActive) {
      return new THREE.Color(part.color).multiplyScalar(0.2);
    }
    if (isHovered) {
      return new THREE.Color(part.color).multiplyScalar(0.15);
    }
    return new THREE.Color("#000000");
  }, [part.color, part.materialType, isActive, isHovered]);

  const emissiveIntensity = useMemo(() => {
    if (part.materialType === "neon") {
      return matConfig.emissiveIntensity;
    }
    if (isActive) return 0.5;
    if (isHovered) return 0.3;
    return 0;
  }, [part.materialType, matConfig.emissiveIntensity, isActive, isHovered]);

  return (
    <meshPhysicalMaterial
      color={color}
      roughness={matConfig.roughness}
      metalness={matConfig.metalness}
      clearcoat={matConfig.clearcoat}
      clearcoatRoughness={0.1}
      emissive={emissiveColor}
      emissiveIntensity={emissiveIntensity}
      wireframe={wireframe}
      envMapIntensity={part.materialType === "metallic" || part.materialType === "gloss" ? 1.8 : 1.0}
    />
  );
}

// 3D Interactive Hotspot Pin
interface HotspotPinProps {
  position: [number, number, number];
  partKey: PartKey;
  label: string;
}

function HotspotPin({ position, partKey, label }: HotspotPinProps) {
  const activePart = useConfiguratorStore((state) => state.activePart);
  const setActivePart = useConfiguratorStore((state) => state.setActivePart);
  const setHoveredPart = useConfiguratorStore((state) => state.setHoveredPart);
  const soundEnabled = useConfiguratorStore((state) => state.soundEnabled);
  const showHotspots = useConfiguratorStore((state) => state.showHotspots);
  const [hovered, setHovered] = useState(false);

  const isActive = activePart === partKey;

  if (!showHotspots) return null;

  return (
    <group position={position}>
      <Html
        center
        distanceFactor={6.5}
        zIndexRange={[100, 0]}
        style={{ pointerEvents: "auto" }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActivePart(partKey);
            if (soundEnabled) cyberAudio.playSelect();
          }}
          onPointerEnter={() => {
            setHovered(true);
            setHoveredPart(partKey);
            if (soundEnabled) cyberAudio.playTick();
          }}
          onPointerLeave={() => {
            setHovered(false);
            setHoveredPart(null);
          }}
          className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300 transform backdrop-blur-md cursor-pointer border ${
            isActive
              ? "bg-cyan-500/90 text-black border-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.8)] scale-110"
              : hovered
              ? "bg-slate-900/90 text-cyan-400 border-cyan-500/80 shadow-[0_0_10px_rgba(0,240,255,0.4)] scale-105"
              : "bg-slate-950/70 text-slate-300 border-slate-700/60 hover:border-cyan-500/50"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full animate-ping ${
              isActive ? "bg-black" : "bg-cyan-400"
            }`}
          />
          <span className="font-heading">{label}</span>
        </button>
      </Html>
    </group>
  );
}

export function ModelViewer() {
  const setActivePart = useConfiguratorStore((state) => state.setActivePart);
  const setHoveredPart = useConfiguratorStore((state) => state.setHoveredPart);
  const soundEnabled = useConfiguratorStore((state) => state.soundEnabled);
  const wireframe = useConfiguratorStore((state) => state.wireframe);
  const explodedView = useConfiguratorStore((state) => state.explodedView);

  // Group references for exploded animation lerping
  const soleGroup = useRef<THREE.Group>(null);
  const airPodsGroup = useRef<THREE.Group>(null);
  const upperMeshGroup = useRef<THREE.Group>(null);
  const collarGroup = useRef<THREE.Group>(null);
  const lacesGroup = useRef<THREE.Group>(null);
  const accentsGroup = useRef<THREE.Group>(null);
  const heelVentGroup = useRef<THREE.Group>(null);

  // Sneaker procedural base group
  const mainRig = useRef<THREE.Group>(null);

  // Animation frame loop for smooth exploded view transitions and floating levitation
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Subtle breathing floating animation
    if (mainRig.current) {
      mainRig.current.position.y = Math.sin(t * 1.5) * 0.04;
    }

    const expFactor = explodedView ? 1 : 0;
    const lerpSpeed = 5 * delta;

    if (soleGroup.current) {
      soleGroup.current.position.y = THREE.MathUtils.lerp(
        soleGroup.current.position.y,
        -0.45 * expFactor,
        lerpSpeed
      );
    }

    if (airPodsGroup.current) {
      airPodsGroup.current.position.y = THREE.MathUtils.lerp(
        airPodsGroup.current.position.y,
        -0.22 * expFactor,
        lerpSpeed
      );
      airPodsGroup.current.position.z = THREE.MathUtils.lerp(
        airPodsGroup.current.position.z,
        0.18 * expFactor,
        lerpSpeed
      );
    }

    if (upperMeshGroup.current) {
      upperMeshGroup.current.position.y = THREE.MathUtils.lerp(
        upperMeshGroup.current.position.y,
        0.15 * expFactor,
        lerpSpeed
      );
    }

    if (collarGroup.current) {
      collarGroup.current.position.y = THREE.MathUtils.lerp(
        collarGroup.current.position.y,
        0.45 * expFactor,
        lerpSpeed
      );
      collarGroup.current.position.x = THREE.MathUtils.lerp(
        collarGroup.current.position.x,
        -0.2 * expFactor,
        lerpSpeed
      );
    }

    if (lacesGroup.current) {
      lacesGroup.current.position.y = THREE.MathUtils.lerp(
        lacesGroup.current.position.y,
        0.5 * expFactor,
        lerpSpeed
      );
      lacesGroup.current.position.x = THREE.MathUtils.lerp(
        lacesGroup.current.position.x,
        0.2 * expFactor,
        lerpSpeed
      );
    }

    if (accentsGroup.current) {
      accentsGroup.current.position.z = THREE.MathUtils.lerp(
        accentsGroup.current.position.z,
        0.4 * expFactor,
        lerpSpeed
      );
      accentsGroup.current.position.y = THREE.MathUtils.lerp(
        accentsGroup.current.position.y,
        0.2 * expFactor,
        lerpSpeed
      );
    }

    if (heelVentGroup.current) {
      heelVentGroup.current.position.x = THREE.MathUtils.lerp(
        heelVentGroup.current.position.x,
        -0.45 * expFactor,
        lerpSpeed
      );
    }
  });

  const handlePointerDown = (e: any, partKey: PartKey) => {
    e.stopPropagation();
    setActivePart(partKey);
    if (soundEnabled) cyberAudio.playSelect();
  };

  const handlePointerOver = (e: any, partKey: PartKey) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
    setHoveredPart(partKey);
    if (soundEnabled) cyberAudio.playTick();
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = "auto";
    setHoveredPart(null);
  };

  // Construct Procedural Geometries for CyberSneaker
  // 1. Sole Base & Midsole Contour
  const soleGeom = useMemo(() => {
    const shape = new THREE.Shape();
    // Profile of high-tech futuristic curved sneaker sole
    shape.moveTo(-1.5, -0.1);
    shape.lineTo(1.4, -0.1);
    shape.quadraticCurveTo(1.7, 0.1, 1.6, 0.35); // Sweeping toe kick
    shape.lineTo(1.1, 0.38);
    shape.quadraticCurveTo(0.2, 0.22, -0.5, 0.28); // Arch curve
    shape.lineTo(-1.3, 0.42); // Heel cup rise
    shape.quadraticCurveTo(-1.65, 0.25, -1.5, -0.1);

    const extrudeSettings = {
      steps: 2,
      depth: 0.9,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.08,
      bevelSegments: 4,
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  // 2. Outsole Tread Blocks
  const treadGeoms = useMemo(() => {
    const geoms = [];
    for (let i = 0; i < 7; i++) {
      const g = new THREE.BoxGeometry(0.12, 0.06, 0.82);
      g.translate(-1.1 + i * 0.38, -0.32, 0);
      geoms.push(g);
    }
    return geoms;
  }, []);

  // 3. Upper Main Aerodynamic Body
  const upperGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1.25, 0.0);
    shape.lineTo(1.1, 0.0);
    shape.quadraticCurveTo(1.45, 0.2, 1.25, 0.45); // Toe box dome
    shape.quadraticCurveTo(0.8, 0.6, 0.2, 0.85); // Instep slope
    shape.lineTo(-0.25, 1.05); // Tongue rise
    shape.quadraticCurveTo(-0.8, 0.9, -1.15, 0.7); // Ankle dip
    shape.quadraticCurveTo(-1.35, 0.4, -1.25, 0.0); // Heel counter

    const extrudeSettings = {
      steps: 3,
      depth: 0.76,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 5,
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  // 4. Collar & Inner Liner
  const collarGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.8, 0.4);
    shape.lineTo(-0.1, 0.75);
    shape.quadraticCurveTo(-0.3, 1.05, -0.7, 1.05);
    shape.quadraticCurveTo(-1.05, 0.9, -0.8, 0.4);

    const extrudeSettings = {
      steps: 2,
      depth: 0.65,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 4,
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  // 5. Angular Cyber Accents / Swoosh Wings
  const accentGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.9, 0.1);
    shape.lineTo(0.5, 0.25);
    shape.lineTo(0.2, 0.48);
    shape.lineTo(-0.6, 0.38);
    shape.lineTo(-0.85, 0.55);
    shape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 3,
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  // 6. Rear Exhaust Diffuser / Vent
  const ventFins = useMemo(() => {
    const geoms = [];
    for (let i = 0; i < 4; i++) {
      const g = new THREE.BoxGeometry(0.08, 0.04, 0.55);
      g.translate(-1.45, 0.15 + i * 0.12, 0);
      geoms.push(g);
    }
    return geoms;
  }, []);

  return (
    <group ref={mainRig} position={[0, 0.15, 0]}>
      {/* 1. OUTSOLE & TREAD (sole) */}
      <group
        ref={soleGroup}
        onPointerDown={(e) => handlePointerDown(e, "sole")}
        onPointerOver={(e) => handlePointerOver(e, "sole")}
        onPointerOut={handlePointerOut}
      >
        <mesh geometry={soleGeom} position={[0, -0.15, 0]} castShadow receiveShadow>
          <DynamicPBRMaterial partKey="sole" wireframe={wireframe} />
        </mesh>
        {treadGeoms.map((g, idx) => (
          <mesh key={idx} geometry={g} castShadow receiveShadow>
            <DynamicPBRMaterial partKey="sole" wireframe={wireframe} />
          </mesh>
        ))}
      </group>

      {/* 2. KINETIC AIR PODS (airPods) */}
      <group
        ref={airPodsGroup}
        onPointerDown={(e) => handlePointerDown(e, "airPods")}
        onPointerOver={(e) => handlePointerOver(e, "airPods")}
        onPointerOut={handlePointerOut}
      >
        {/* Forefoot & Heel Dual Dampener Cylinders */}
        {[-0.8, -0.4, 0.3, 0.7].map((xPos, idx) => (
          <group key={idx} position={[xPos, -0.12, 0]}>
            {/* Outer Lateral Pod */}
            <mesh position={[0, 0, 0.44]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <capsuleGeometry args={[0.1, 0.16, 8, 16]} />
              <DynamicPBRMaterial partKey="airPods" wireframe={wireframe} />
            </mesh>
            {/* Outer Medial Pod */}
            <mesh position={[0, 0, -0.44]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <capsuleGeometry args={[0.1, 0.16, 8, 16]} />
              <DynamicPBRMaterial partKey="airPods" wireframe={wireframe} />
            </mesh>
            {/* Internal Glowing Energy Core Rod */}
            <mesh position={[0, 0, 0.44]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.22, 12]} />
              <meshBasicMaterial color={useConfiguratorStore.getState().parts.airPods.color} />
            </mesh>
            <mesh position={[0, 0, -0.44]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.22, 12]} />
              <meshBasicMaterial color={useConfiguratorStore.getState().parts.airPods.color} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 3. UPPER AEROMESH (upperMesh) */}
      <group
        ref={upperMeshGroup}
        onPointerDown={(e) => handlePointerDown(e, "upperMesh")}
        onPointerOver={(e) => handlePointerOver(e, "upperMesh")}
        onPointerOut={handlePointerOut}
      >
        <mesh geometry={upperGeom} position={[0, 0.32, 0]} castShadow receiveShadow>
          <DynamicPBRMaterial partKey="upperMesh" wireframe={wireframe} />
        </mesh>
        {/* Front Toe Cap Accent Guard */}
        <mesh position={[1.1, 0.28, 0]} rotation={[0, 0, -0.3]} castShadow>
          <boxGeometry args={[0.25, 0.16, 0.72]} />
          <DynamicPBRMaterial partKey="upperMesh" wireframe={wireframe} />
        </mesh>
      </group>

      {/* 4. ANKLE COLLAR & INNER LINER (collar) */}
      <group
        ref={collarGroup}
        position={[-0.45, 0.48, 0]}
        onPointerDown={(e) => handlePointerDown(e, "collar")}
        onPointerOver={(e) => handlePointerOver(e, "collar")}
        onPointerOut={handlePointerOut}
      >
        <mesh geometry={collarGeom} castShadow receiveShadow>
          <DynamicPBRMaterial partKey="collar" wireframe={wireframe} />
        </mesh>
        {/* Rear Heel Pull Tab */}
        <mesh position={[-0.68, 0.58, 0]} rotation={[0, 0, 0.4]} castShadow>
          <boxGeometry args={[0.08, 0.24, 0.15]} />
          <DynamicPBRMaterial partKey="collar" wireframe={wireframe} />
        </mesh>
      </group>

      {/* 5. KINETIC LACES (laces) */}
      <group
        ref={lacesGroup}
        onPointerDown={(e) => handlePointerDown(e, "laces")}
        onPointerOver={(e) => handlePointerOver(e, "laces")}
        onPointerOut={handlePointerOut}
      >
        {/* Diagonal Cross Lace Bands */}
        {[-0.1, 0.15, 0.4, 0.65].map((x, i) => (
          <group key={i} position={[x, 0.58 + (4 - i) * 0.05, 0]}>
            {/* Main Lace Strap Bar */}
            <mesh rotation={[0, 0, -0.22]} castShadow>
              <boxGeometry args={[0.08, 0.04, 0.52]} />
              <DynamicPBRMaterial partKey="laces" wireframe={wireframe} />
            </mesh>
            {/* Lateral Eyelet Fastener Ring */}
            <mesh position={[0, 0, 0.28]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.035, 0.015, 8, 16]} />
              <DynamicPBRMaterial partKey="accents" wireframe={wireframe} />
            </mesh>
            {/* Medial Eyelet Fastener Ring */}
            <mesh position={[0, 0, -0.28]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.035, 0.015, 8, 16]} />
              <DynamicPBRMaterial partKey="accents" wireframe={wireframe} />
            </mesh>
          </group>
        ))}
        {/* Central Magnetic Lace Lock Module */}
        <mesh position={[0.25, 0.78, 0]} rotation={[0, 0, -0.25]} castShadow>
          <boxGeometry args={[0.18, 0.08, 0.22]} />
          <DynamicPBRMaterial partKey="laces" wireframe={wireframe} />
        </mesh>
      </group>

      {/* 6. SIDE WINGS / AERO FIN ACCENTS (accents) */}
      <group
        ref={accentsGroup}
        onPointerDown={(e) => handlePointerDown(e, "accents")}
        onPointerOver={(e) => handlePointerOver(e, "accents")}
        onPointerOut={handlePointerOut}
      >
        {/* Lateral Accent Wing */}
        <mesh geometry={accentGeom} position={[0, 0.38, 0.42]} castShadow>
          <DynamicPBRMaterial partKey="accents" wireframe={wireframe} />
        </mesh>
        {/* Medial Accent Wing */}
        <mesh
          geometry={accentGeom}
          position={[0, 0.38, -0.42]}
          rotation={[0, Math.PI, 0]}
          castShadow
        >
          <DynamicPBRMaterial partKey="accents" wireframe={wireframe} />
        </mesh>
      </group>

      {/* 7. REAR HEEL EXHAUST VENT (heelVent) */}
      <group
        ref={heelVentGroup}
        onPointerDown={(e) => handlePointerDown(e, "heelVent")}
        onPointerOver={(e) => handlePointerOver(e, "heelVent")}
        onPointerOut={handlePointerOut}
      >
        {/* Exhaust Housing Bezel */}
        <mesh position={[-1.4, 0.32, 0]} rotation={[0, 0, 0.25]} castShadow>
          <boxGeometry args={[0.12, 0.5, 0.62]} />
          <DynamicPBRMaterial partKey="sole" wireframe={wireframe} />
        </mesh>
        {/* Glowing Heat-Sink Radiator Fins */}
        {ventFins.map((fin, idx) => (
          <mesh key={idx} geometry={fin} castShadow>
            <DynamicPBRMaterial partKey="heelVent" wireframe={wireframe} />
          </mesh>
        ))}
      </group>

      {/* INTERACTIVE 3D HOTSPOT PINS */}
      <HotspotPin position={[0.4, -0.38, 0.6]} partKey="sole" label="Sole & Tread" />
      <HotspotPin position={[-0.6, -0.2, 0.65]} partKey="airPods" label="Air Pods" />
      <HotspotPin position={[0.7, 0.45, 0.55]} partKey="upperMesh" label="Upper Mesh" />
      <HotspotPin position={[-0.6, 1.1, 0.4]} partKey="collar" label="Ankle Collar" />
      <HotspotPin position={[0.2, 0.9, 0.2]} partKey="laces" label="Kinetic Laces" />
      <HotspotPin position={[0.0, 0.55, 0.55]} partKey="accents" label="Aero Fins" />
      <HotspotPin position={[-1.6, 0.45, 0.0]} partKey="heelVent" label="Rear Exhaust" />
    </group>
  );
}
