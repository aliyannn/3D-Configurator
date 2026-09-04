"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Center, Bounds, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { StudioMaterialType } from "@/data/modelsCatalog";
import { useStudioStore } from "@/store/useStudioStore";
import { cyberAudio } from "@/lib/audio";

interface DynamicViewerProps {
  url: string;
  onMeshClick?: (meshName: string) => void;
  selectedPart?: string | null;
  partColors: Record<string, string>;
  partFinishes: Record<string, StudioMaterialType>;
}

export function DynamicModelViewer({
  url,
  onMeshClick,
  selectedPart,
  partColors,
  partFinishes,
}: DynamicViewerProps) {
  const soundEnabled = useStudioStore((state) => state.soundEnabled);
  const lastExtractedUrlRef = useRef<string | null>(null);

  // Load asset via useGLTF with built-in cache, progress reporting, and DRACO
  const { scene: rawScene } = useGLTF(url);

  // Clone scene so multiple instances or material mutations do not mutate cache
  const scene = useMemo(() => {
    if (!rawScene) return null;
    return rawScene.clone(true);
  }, [rawScene]);

  // Extract detected meshes and register with Zustand store safely outside the render loop
  useEffect(() => {
    if (!scene || lastExtractedUrlRef.current === url) return;
    lastExtractedUrlRef.current = url;

    const detectedMeshes: string[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = mesh.name || `Part_${detectedMeshes.length + 1}`;
        mesh.name = name;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (!detectedMeshes.includes(name)) {
          detectedMeshes.push(name);
        }
      }
    });

    // Schedule state update outside R3F render loop to prevent concurrency conflicts
    const timeoutId = setTimeout(() => {
      useStudioStore.getState().updateDetectedMeshes(detectedMeshes);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [scene, url]);

  // Apply real-time material & color updates with pattern-based matching
  useEffect(() => {
    if (!scene) return;
    const currentModel = useStudioStore.getState().getCurrentModel();

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const meshName = mesh.name || "";
        const matName = (mesh.material as THREE.Material)?.name || "";
        const searchKey = `${meshName} ${matName}`.toLowerCase();

        let color = partColors[meshName];
        let finish = partFinishes[meshName] || "gloss";
        let isSelected = selectedPart === meshName;

        // If no direct mesh name match, match against active model's part definitions & patterns
        if (!color && currentModel?.parts) {
          for (const part of currentModel.parts) {
            const isIdMatch = part.id.toLowerCase() === meshName.toLowerCase();
            const isPatternMatch = part.meshPatterns?.some((p) =>
              searchKey.includes(p.toLowerCase())
            );

            if (isIdMatch || isPatternMatch) {
              color = partColors[part.id] || part.defaultColor;
              finish = partFinishes[part.id] || part.defaultMaterial || "gloss";
              if (selectedPart === part.id) {
                isSelected = true;
              }
              break;
            }
          }
        }

        if (color) {
          mesh.material = (mesh.material as THREE.Material).clone();
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.color = new THREE.Color(color);

          if (finish === "chrome") {
            mat.roughness = 0.08;
            mat.metalness = 0.95;
            mat.envMapIntensity = 2.5;
          } else if (finish === "matte") {
            mat.roughness = 0.85;
            mat.metalness = 0.05;
            mat.envMapIntensity = 1.0;
          } else {
            // High Gloss
            mat.roughness = 0.15;
            mat.metalness = 0.65;
            mat.envMapIntensity = 2.0;
          }

          if (isSelected) {
            mat.emissive = new THREE.Color(color).multiplyScalar(0.25);
          } else {
            mat.emissive = new THREE.Color(0x000000);
          }

          mat.needsUpdate = true;
        }
      }
    });
  }, [scene, partColors, partFinishes, selectedPart]);

  if (!scene) return null;

  return (
    <Bounds fit clip margin={1.2} observe>
      <Center top>
        <primitive
          object={scene}
          onClick={(e: any) => {
            e.stopPropagation();
            if (soundEnabled) cyberAudio.playSelect();

            const meshName = e.object?.name || "";
            const matName = (e.object?.material as THREE.Material)?.name || "";
            const searchKey = `${meshName} ${matName}`.toLowerCase();

            let targetPartId = meshName;
            const currentModel = useStudioStore.getState().getCurrentModel();
            if (currentModel?.parts) {
              const found = currentModel.parts.find(
                (p) =>
                  p.id.toLowerCase() === meshName.toLowerCase() ||
                  p.meshPatterns?.some((pattern) =>
                    searchKey.includes(pattern.toLowerCase())
                  )
              );
              if (found) {
                targetPartId = found.id;
              }
            }

            if (onMeshClick) {
              onMeshClick(targetPartId);
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

