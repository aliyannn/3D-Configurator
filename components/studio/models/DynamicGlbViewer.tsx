"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useStudioStore } from "@/store/useStudioStore";
import { STUDIO_MATERIALS } from "@/data/modelsCatalog";
import { cyberAudio } from "@/lib/audio";

interface DynamicGlbViewerProps {
  url: string;
}

export function DynamicGlbViewer({ url }: DynamicGlbViewerProps) {
  const gltf = useGLTF(url);
  const rootRef = useRef<THREE.Group>(null);

  const configurations = useStudioStore((state) => state.configurations.custom);
  const activePartId = useStudioStore((state) => state.activePartId);
  const hoveredPartId = useStudioStore((state) => state.hoveredPartId);
  const setActivePartId = useStudioStore((state) => state.setActivePartId);
  const setHoveredPartId = useStudioStore((state) => state.setHoveredPartId);
  const soundEnabled = useStudioStore((state) => state.soundEnabled);
  const wireframe = useStudioStore((state) => state.wireframe);

  // Clone scene so multiple mounts or modifications don't corrupt cached GLTF
  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);

    // Auto-center and normalize bounding box scale
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? 2.5 / maxDim : 1;

    clone.position.x = -center.x * scale;
    clone.position.y = -box.min.y * scale; // Sit flush on ground
    clone.position.z = -center.z * scale;
    clone.scale.setScalar(scale);

    return clone;
  }, [gltf.scene]);

  // Update materials on every render when configuration changes
  useEffect(() => {
    if (!clonedScene) return;

    let idx = 0;
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const partId = mesh.name || `mesh_${idx++}`;
        const partState = configurations?.[partId] || {
          color: "#00F0FF",
          material: "gloss",
        };
        const matDef = STUDIO_MATERIALS[partState.material] || STUDIO_MATERIALS.gloss;

        const isActive = activePartId === partId;
        const isHovered = hoveredPartId === partId;

        const color = new THREE.Color(partState.color);
        const emissive = isActive
          ? new THREE.Color(partState.color).multiplyScalar(0.25)
          : isHovered
          ? new THREE.Color(partState.color).multiplyScalar(0.15)
          : new THREE.Color(0x000000);

        mesh.material = new THREE.MeshPhysicalMaterial({
          color,
          roughness: matDef.roughness,
          metalness: matDef.metalness,
          clearcoat: matDef.clearcoat,
          clearcoatRoughness: 0.08,
          emissive,
          emissiveIntensity: isActive ? 0.6 : isHovered ? 0.3 : 0.0,
          wireframe,
        });

        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [clonedScene, configurations, activePartId, hoveredPartId, wireframe]);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    if (e.object?.name) {
      setActivePartId(e.object.name);
      if (soundEnabled) cyberAudio.playSelect();
    }
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    if (e.object?.name) {
      document.body.style.cursor = "pointer";
      setHoveredPartId(e.object.name);
      if (soundEnabled) cyberAudio.playTick();
    }
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = "auto";
    setHoveredPartId(null);
  };

  return (
    <primitive
      ref={rootRef}
      object={clonedScene}
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  );
}
