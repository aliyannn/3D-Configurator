"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { useStudioStore } from "@/store/useStudioStore";
import { STUDIO_MATERIALS } from "@/data/modelsCatalog";

interface StudioMeshMaterialProps {
  modelId: string;
  partId: string;
  wireframe?: boolean;
}

export function StudioMeshMaterial({
  modelId,
  partId,
  wireframe = false,
}: StudioMeshMaterialProps) {
  const modelConfig = useStudioStore((state) => state.configurations[modelId]);
  const activePartId = useStudioStore((state) => state.activePartId);
  const hoveredPartId = useStudioStore((state) => state.hoveredPartId);

  const partState = modelConfig?.[partId] || {
    color: "#00F0FF",
    material: "gloss",
  };
  const matDef = STUDIO_MATERIALS[partState.material] || STUDIO_MATERIALS.gloss;

  const isActive = activePartId === partId;
  const isHovered = hoveredPartId === partId;

  const color = useMemo(() => new THREE.Color(partState.color), [partState.color]);

  const emissive = useMemo(() => {
    if (isActive) {
      return new THREE.Color(partState.color).multiplyScalar(0.25);
    }
    if (isHovered) {
      return new THREE.Color(partState.color).multiplyScalar(0.15);
    }
    return new THREE.Color("#000000");
  }, [isActive, isHovered, partState.color]);

  return (
    <meshPhysicalMaterial
      color={color}
      roughness={matDef.roughness}
      metalness={matDef.metalness}
      clearcoat={matDef.clearcoat}
      clearcoatRoughness={0.08}
      emissive={emissive}
      emissiveIntensity={isActive ? 0.6 : isHovered ? 0.3 : 0.0}
      wireframe={wireframe}
      envMapIntensity={matDef.metalness > 0.5 ? 2.0 : 1.2}
    />
  );
}
