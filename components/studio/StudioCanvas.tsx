"use client";

import React, { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  AdaptiveDpr,
  AdaptiveEvents,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import {
  useStudioStore,
  StudioEnvironment,
  CameraPreset,
} from "@/store/useStudioStore";
import { SceneModelManager } from "./SceneModelManager";
import { Loader2, UploadCloud } from "lucide-react";
import { cyberAudio } from "@/lib/audio";
import { PartDefinition } from "@/data/modelsCatalog";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Smooth Camera Controller
function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cameraPreset = useStudioStore((state) => state.cameraPreset);
  const cameraTriggerCount = useStudioStore((state) => state.cameraTriggerCount);
  const autoRotate = useStudioStore((state) => state.autoRotate);
  const currentModel = useStudioStore((state) => state.getCurrentModel());

  useEffect(() => {
    const baseTarget = currentModel.cameraDefaults?.target || [0, 0.4, 0];
    const baseDist = Math.hypot(...currentModel.cameraDefaults.position);

    let targetPos: [number, number, number];
    switch (cameraPreset) {
      case "front_three_quarter":
        targetPos = [
          baseDist * 0.7,
          baseDist * 0.42,
          baseDist * 0.75,
        ];
        break;
      case "side_profile":
        targetPos = [0.01, baseDist * 0.25, baseDist * 0.95];
        break;
      case "top_down":
        targetPos = [0.01, baseDist * 1.15, 0.01];
        break;
      case "detail_close":
        targetPos = [
          baseDist * 0.4,
          baseDist * 0.25,
          baseDist * 0.45,
        ];
        break;
      default:
        targetPos = currentModel.cameraDefaults.position;
    }

    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(...targetPos);
    const targetEnd = new THREE.Vector3(...baseTarget);

    let startTime = performance.now();
    const duration = 750;

    const animateCamera = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      camera.position.lerpVectors(startPos, endPos, ease);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetEnd, ease);
        controlsRef.current.update();
      }

      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      }
    };

    requestAnimationFrame(animateCamera);
  }, [cameraPreset, cameraTriggerCount, currentModel, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={1.2}
      maxDistance={12}
      minPolarAngle={0.08}
      maxPolarAngle={Math.PI / 2 + 0.04}
      autoRotate={autoRotate}
      autoRotateSpeed={1.5}
      makeDefault
    />
  );
}

// Studio Lighting Rig
function StudioLighting() {
  const environment = useStudioStore((state) => state.environment);

  switch (environment) {
    case "studio_neutral":
      return (
        <>
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={2.0}
            color="#FFFFFF"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-5, 4, -5]} intensity={0.9} color="#E2E8F0" />
          <pointLight position={[0, 4, -4]} intensity={1.2} color="#FFFFFF" />
        </>
      );

    case "cyber_neon":
      return (
        <>
          <ambientLight intensity={0.35} />
          <directionalLight
            position={[4, 7, 4]}
            intensity={1.4}
            color="#E6F8FF"
            castShadow
          />
          <pointLight position={[-4, 3, 3]} intensity={4.5} color="#00F0FF" distance={12} />
          <pointLight position={[4, 2, -4]} intensity={4.0} color="#FF0055" distance={12} />
          <pointLight position={[0, -0.8, 0]} intensity={2.0} color="#00F0FF" distance={6} />
        </>
      );

    case "golden_hour":
      return (
        <>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[6, 6, 4]}
            intensity={2.5}
            color="#F59E0B"
            castShadow
          />
          <pointLight position={[-5, 2, 3]} intensity={2.8} color="#EF4444" distance={10} />
          <pointLight position={[3, 3, -5]} intensity={2.0} color="#8B5CF6" distance={10} />
        </>
      );

    case "deep_obsidian":
      return (
        <>
          <ambientLight intensity={0.18} />
          <spotLight
            position={[0, 9, 2]}
            intensity={4.5}
            angle={0.6}
            penumbra={0.8}
            color="#FFFFFF"
            castShadow
          />
          <pointLight position={[-4, 1, 2]} intensity={2.2} color="#3B82F6" distance={8} />
          <pointLight position={[4, 1, -2]} intensity={2.2} color="#A855F7" distance={8} />
        </>
      );

    default:
      return null;
  }
}

// Stage Podium Floor & Contact Shadow
function StudioStage() {
  const environment = useStudioStore((state) => state.environment);

  return (
    <group position={[0, 0, 0]}>
      {/* Studio Radial Floor Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <ringGeometry args={[2.8, 2.85, 64]} />
        <meshBasicMaterial
          color={
            environment === "cyber_neon"
              ? "#00F0FF"
              : environment === "golden_hour"
              ? "#F59E0B"
              : "#64748B"
          }
          transparent
          opacity={0.3}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <ringGeometry args={[1.6, 1.63, 48]} />
        <meshBasicMaterial
          color={
            environment === "cyber_neon"
              ? "#FF0055"
              : environment === "golden_hour"
              ? "#EF4444"
              : "#475569"
          }
          transparent
          opacity={0.2}
        />
      </mesh>

      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.7}
        scale={8}
        blur={2.0}
        far={4}
        resolution={512}
        color={environment === "studio_neutral" ? "#000000" : "#050811"}
      />
    </group>
  );
}

// Loading Fallback
function StudioLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07090E]/80 backdrop-blur-md z-20">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <Loader2 className="w-6 h-6 text-cyan-400 animate-pulse" />
      </div>
      <p className="text-xs font-bold font-heading tracking-widest text-cyan-400 uppercase">
        LOADING 3D PRODUCT ASSET
      </p>
      <p className="text-[11px] text-slate-500 font-mono-code mt-1">
        Compiling PBR Geometries & Shaders...
      </p>
    </div>
  );
}

interface StudioCanvasProps {
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export function StudioCanvas({ canvasRef }: StudioCanvasProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const setCustomGlb = useStudioStore((state) => state.setCustomGlb);
  const soundEnabled = useStudioStore((state) => state.soundEnabled);

  // Drag and Drop GLB handler
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const glbFile = files.find(
        (f) => f.name.endsWith(".glb") || f.name.endsWith(".gltf")
      );

      if (!glbFile) return;

      const url = URL.createObjectURL(glbFile);
      const loader = new GLTFLoader();

      loader.load(url, (gltf) => {
        const detectedParts: PartDefinition[] = [];
        let index = 1;

        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const name = mesh.name || `Part ${index++}`;
            detectedParts.push({
              id: mesh.name || `part_${index}`,
              name,
              description: `Imported 3D mesh node: ${name}`,
              defaultColor: "#00F0FF",
              defaultMaterial: "gloss" as const,
            });
          }
        });

        setCustomGlb({
          url,
          name: glbFile.name.replace(/\.[^/.]+$/, ""),
          detectedParts: detectedParts.length > 0 ? detectedParts : [
            {
              id: "main_mesh",
              name: "Primary Mesh",
              description: "Root mesh node",
              defaultColor: "#00F0FF",
              defaultMaterial: "gloss" as const,
            },
          ],
        });

        if (soundEnabled) cyberAudio.playSuccess();
      });
    },
    [setCustomGlb, soundEnabled]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className="relative w-full h-full select-none overflow-hidden"
    >
      {/* Visual Drag Over Indicator */}
      {isDragOver && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-cyan-950/70 border-4 border-dashed border-cyan-400 backdrop-blur-md animate-in fade-in duration-200">
          <UploadCloud className="w-16 h-16 text-cyan-400 mb-3 animate-bounce" />
          <h3 className="text-xl font-bold font-heading text-white">
            DROP .GLB / .GLTF FILE HERE
          </h3>
          <p className="text-xs text-cyan-300 font-mono-code mt-1">
            Studio will instantly extract mesh nodes & bind PBR shaders
          </p>
        </div>
      )}

      <Suspense fallback={<StudioLoader />}>
        <Canvas
          ref={canvasRef}
          camera={{ position: [4.2, 2.2, 4.8], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
            powerPreference: "high-performance",
          }}
          shadows
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <StudioLighting />
          <StudioStage />
          <SceneModelManager />
          <CameraController />
        </Canvas>
      </Suspense>
    </div>
  );
}
