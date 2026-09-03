"use client";

import React, { useMemo, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useStudioStore } from "@/store/useStudioStore";
import { STUDIO_MATERIALS } from "@/data/modelsCatalog";
import { cyberAudio } from "@/lib/audio";
import { ProceduralCar } from "@/components/studio/models/ProceduralCar";
import { ProceduralBike } from "@/components/studio/models/ProceduralBike";
import { ProceduralSofa } from "@/components/studio/models/ProceduralSofa";
import { ProceduralSneaker } from "@/components/studio/models/ProceduralSneaker";

const FERRARI_GLB_URL =
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/ferrari.glb";

// Preload Ferrari GLB
try {
  useGLTF.preload(FERRARI_GLB_URL);
} catch {
  // Graceful preload fallback
}

function FerrariRealModel() {
  const gltf = useGLTF(FERRARI_GLB_URL);
  const activeModelId = useStudioStore((state) => state.activeModelId);
  const configurations = useStudioStore((state) => state.configurations);
  const activePartId = useStudioStore((state) => state.activePartId);
  const setActivePartId = useStudioStore((state) => state.setActivePartId);
  const soundEnabled = useStudioStore((state) => state.soundEnabled);

  const modelConfig = configurations[activeModelId] || {};
  const paintConfig = modelConfig["paint"] || { color: "#D40000", material: "gloss" };
  const rimsConfig = modelConfig["rims"] || { color: "#52565E", material: "metallic" };
  const calipersConfig = modelConfig["calipers"] || { color: "#FFD700", material: "gloss" };
  const tintConfig = modelConfig["tint"] || { color: "#0F1115", material: "gloss" };

  const paintMatDef = STUDIO_MATERIALS[paintConfig.material] || STUDIO_MATERIALS.gloss;
  const rimsMatDef = STUDIO_MATERIALS[rimsConfig.material] || STUDIO_MATERIALS.metallic;

  // Clone scene so materials can be individually manipulated
  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    clone.scale.setScalar(0.95);
    clone.position.set(0, 0, 0);
    return clone;
  }, [gltf.scene]);

  // Reactive Automotive Materials
  const materials = useMemo(() => {
    // 1. Clearcoat Automotive Paint
    const paintColor = new THREE.Color(paintConfig.color);
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: paintColor,
      roughness: paintConfig.material === "matte" ? 0.65 : 0.14,
      metalness: paintConfig.material === "matte" ? 0.2 : 0.88,
      clearcoat: paintConfig.material === "matte" ? 0.0 : 1.0,
      clearcoatRoughness: 0.08,
      envMapIntensity: 2.2,
    });

    // 2. Alloy Rims Material
    const rimsColor = new THREE.Color(rimsConfig.color);
    const rimMaterial = new THREE.MeshPhysicalMaterial({
      color: rimsColor,
      roughness: rimsMatDef.roughness,
      metalness: rimsMatDef.metalness,
      clearcoat: 0.4,
      clearcoatRoughness: 0.1,
      envMapIntensity: 2.0,
    });

    // 3. Brake Caliper Material
    const calipersColor = new THREE.Color(calipersConfig.color);
    const caliperMaterial = new THREE.MeshPhysicalMaterial({
      color: calipersColor,
      roughness: 0.2,
      metalness: 0.6,
      clearcoat: 0.8,
      envMapIntensity: 1.5,
    });

    // 4. Tinted Windshield Glass Material
    const tintColor = new THREE.Color(tintConfig.color);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: tintColor,
      transmission: 0.85,
      opacity: 0.4,
      transparent: true,
      roughness: 0.04,
      metalness: 0.1,
      ior: 1.5,
      thickness: 0.05,
      envMapIntensity: 2.5,
    });

    // 5. Authentic Rubber Tire Material
    const tireMaterial = new THREE.MeshStandardMaterial({
      color: "#181A1F",
      roughness: 0.85,
      metalness: 0.05,
    });

    // 6. Carbon Fiber Trim
    const carbonMaterial = new THREE.MeshPhysicalMaterial({
      color: "#111317",
      roughness: 0.3,
      metalness: 0.6,
      clearcoat: 0.8,
    });

    return {
      bodyMaterial,
      rimMaterial,
      caliperMaterial,
      glassMaterial,
      tireMaterial,
      carbonMaterial,
    };
  }, [paintConfig, rimsConfig, calipersConfig, tintConfig, paintMatDef, rimsMatDef]);

  // Bind Materials to Named Meshes
  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = (mesh.name || "").toLowerCase();

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (name.includes("body") || name.includes("paint") || name.includes("hood") || name.includes("door")) {
          mesh.material = materials.bodyMaterial;
        } else if (name.includes("rim") || name.includes("wheel")) {
          mesh.material = materials.rimMaterial;
        } else if (name.includes("caliper") || name.includes("brake")) {
          mesh.material = materials.caliperMaterial;
        } else if (name.includes("glass") || name.includes("windshield") || name.includes("window")) {
          mesh.material = materials.glassMaterial;
        } else if (name.includes("tire") || name.includes("tyre") || name.includes("rubber")) {
          mesh.material = materials.tireMaterial;
        } else if (name.includes("carbon") || name.includes("trim") || name.includes("diffuser")) {
          mesh.material = materials.carbonMaterial;
        } else {
          // Default automotive trim
          mesh.material = materials.carbonMaterial;
        }
      }
    });
  }, [clonedScene, materials]);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    const name = (e.object?.name || "").toLowerCase();

    if (name.includes("rim") || name.includes("wheel")) {
      setActivePartId("rims");
    } else if (name.includes("caliper") || name.includes("brake")) {
      setActivePartId("calipers");
    } else if (name.includes("glass") || name.includes("window")) {
      setActivePartId("tint");
    } else {
      setActivePartId("paint");
    }

    if (soundEnabled) cyberAudio.playSelect();
  };

  return (
    <primitive
      object={clonedScene}
      onPointerDown={handlePointerDown}
      position={[0, 0, 0]}
    />
  );
}

// Fallback Container if GLB fails or while loading
class ErrorBoundaryFallback extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export function ModelViewer() {
  const activeModelId = useStudioStore((state) => state.activeModelId);

  if (activeModelId === "car_gtx") {
    return (
      <ErrorBoundaryFallback fallback={<ProceduralCar />}>
        <FerrariRealModel />
      </ErrorBoundaryFallback>
    );
  }

  if (activeModelId === "bike_valkyrie") {
    return <ProceduralBike />;
  }

  if (activeModelId === "sofa_haven") {
    return <ProceduralSofa />;
  }

  if (activeModelId === "sneaker_apex") {
    return <ProceduralSneaker />;
  }

  return <ProceduralCar />;
}
