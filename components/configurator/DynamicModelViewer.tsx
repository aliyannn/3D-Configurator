"use client";

import React, { useEffect, useState } from "react";
import { Center, Bounds } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { StudioMaterialType } from "@/data/modelsCatalog";
import { useStudioStore } from "@/store/useStudioStore";
import { cyberAudio } from "@/lib/audio";

interface DynamicViewerProps {
  url: string;
  onMeshListExtracted?: (meshNames: string[]) => void;
  onMeshClick?: (meshName: string) => void;
  selectedPart?: string | null;
  partColors: Record<string, string>;
  partFinishes: Record<string, StudioMaterialType>;
}

export function DynamicModelViewer({
  url,
  onMeshListExtracted,
  onMeshClick,
  selectedPart,
  partColors,
  partFinishes,
}: DynamicViewerProps) {
  const [modelScene, setModelScene] = useState<THREE.Group | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const soundEnabled = useStudioStore((state) => state.soundEnabled);

  useEffect(() => {
    if (!url) return;

    let isMounted = true;
    const loader = new GLTFLoader();

    // Configure Draco Loader for compressed Sketchfab models
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      url,
      (gltf) => {
        if (!isMounted) {
          dracoLoader.dispose();
          return;
        }

        const scene = gltf.scene;
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

        setModelScene(scene);
        setLoadError(null);
        if (onMeshListExtracted) {
          onMeshListExtracted(detectedMeshes);
        }
      },
      undefined,
      (err) => {
        if (!isMounted) return;
        console.error("Error loading GLTF:", err);
        setLoadError("Failed to parse 3D file. Please ensure it is a valid .glb or .gltf model.");
      }
    );

    return () => {
      isMounted = false;
      dracoLoader.dispose();
    };
  }, [url, onMeshListExtracted]);

  // Apply real-time material & color updates
  useEffect(() => {
    if (!modelScene) return;

    modelScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const color = partColors[mesh.name];
        const finish = partFinishes[mesh.name] || "gloss";

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

          if (mesh.name === selectedPart) {
            mat.emissive = new THREE.Color(color).multiplyScalar(0.2);
          } else {
            mat.emissive = new THREE.Color(0x000000);
          }

          mat.needsUpdate = true;
        }
      }
    });
  }, [modelScene, partColors, partFinishes, selectedPart]);

  if (loadError) return null;
  if (!modelScene) return null;

  return (
    <Bounds fit clip margin={1.2} observe>
      <Center top>
        <primitive
          object={modelScene}
          onClick={(e: any) => {
            e.stopPropagation();
            if (e.object?.name && onMeshClick) {
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
