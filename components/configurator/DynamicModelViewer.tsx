"use client";

import React, { useEffect, useMemo } from "react";
import { useGLTF, Center, Bounds } from "@react-three/drei";
import * as THREE from "three";
import { StudioMaterialType } from "@/data/modelsCatalog";
import { cyberAudio } from "@/lib/audio";
import { useStudioStore } from "@/store/useStudioStore";

interface DynamicModelProps {
  url: string;
  selectedPart: string | null;
  partColors: Record<string, string>;
  partFinishes: Record<string, StudioMaterialType>;
  onMeshListExtracted: (meshNames: string[]) => void;
  onMeshClick: (meshName: string) => void;
}

export function DynamicModelViewer({
  url,
  selectedPart,
  partColors,
  partFinishes,
  onMeshListExtracted,
  onMeshClick,
}: DynamicModelProps) {
  // Load any generic GLB/GLTF via URL
  const { scene } = useGLTF(url);

  // Deep clone scene so multiple uploads don't cross-pollute cached memory
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  const soundEnabled = useStudioStore((state) => state.soundEnabled);

  // Extract all customizable meshes dynamically
  useEffect(() => {
    const detectedMeshes: string[] = [];
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        // Generate a readable part name
        const name = mesh.name || `Part_${detectedMeshes.length + 1}`;
        mesh.name = name;
        if (!detectedMeshes.includes(name)) {
          detectedMeshes.push(name);
        }
        // Enable shadows
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    onMeshListExtracted(detectedMeshes);
  }, [clonedScene, onMeshListExtracted]);

  // Apply real-time dynamic materials to the clicked/selected meshes
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const color = partColors[mesh.name];
        const finish = partFinishes[mesh.name] || "gloss";

        if (color) {
          // Clone original material to prevent affecting other meshes
          mesh.material = (mesh.material as THREE.Material).clone();
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.color = new THREE.Color(color);

          if (finish === "chrome") {
            mat.roughness = 0.08;
            mat.metalness = 0.95;
            mat.envMapIntensity = 2.5;
          } else if (finish === "matte") {
            mat.roughness = 0.82;
            mat.metalness = 0.15;
            mat.envMapIntensity = 1.0;
          } else {
            // High Gloss
            mat.roughness = 0.15;
            mat.metalness = 0.65;
            mat.envMapIntensity = 2.0;
          }

          // Subtle emissive highlight on currently selected mesh
          if (mesh.name === selectedPart) {
            mat.emissive = new THREE.Color(color).multiplyScalar(0.2);
          } else {
            mat.emissive = new THREE.Color(0x000000);
          }

          mat.needsUpdate = true;
        }
      }
    });
  }, [clonedScene, partColors, partFinishes, selectedPart]);

  return (
    <Bounds fit clip margin={1.2} observe>
      <Center top>
        <primitive
          object={clonedScene}
          onClick={(e: any) => {
            e.stopPropagation();
            if (e.object?.name) {
              if (soundEnabled) cyberAudio.playSelect();
              onMeshClick(e.object.name);
            }
          }}
          onPointerOver={(e: any) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
          }}
        />
      </Center>
    </Bounds>
  );
}

export default DynamicModelViewer;
