"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Float,
  AdaptiveDpr,
  AdaptiveEvents,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { useConfiguratorStore, CameraPreset, StudioEnvironment } from "@/store/useConfiguratorStore";
import { ModelViewer } from "./ModelViewer";
import { Loader2 } from "lucide-react";

// Camera Rig for Smooth Animated View Transitions
function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cameraPreset = useConfiguratorStore((state) => state.cameraPreset);
  const cameraTriggerCount = useConfiguratorStore((state) => state.cameraTriggerCount);
  const autoRotate = useConfiguratorStore((state) => state.autoRotate);

  const PRESET_COORDINATES: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
    isometric: { pos: [3.2, 1.8, 3.4], target: [0, 0.25, 0] },
    side_profile: { pos: [0, 0.4, 4.4], target: [0, 0.25, 0] },
    top_down: { pos: [0.1, 4.6, 0.2], target: [0, 0.2, 0] },
    sole_view: { pos: [0.1, -2.4, 3.2], target: [0, 0.1, 0] },
    front_angle: { pos: [3.4, 0.8, 0.4], target: [0, 0.25, 0] },
  };

  useEffect(() => {
    const config = PRESET_COORDINATES[cameraPreset];
    if (!config) return;

    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(...config.pos);
    const targetEnd = new THREE.Vector3(...config.target);

    let startTime = performance.now();
    const duration = 800; // ms

    const animateCamera = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth easeInOutCubic
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
  }, [cameraPreset, cameraTriggerCount, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={1.8}
      maxDistance={8.5}
      minPolarAngle={0.1}
      maxPolarAngle={Math.PI / 2 + 0.08}
      autoRotate={autoRotate}
      autoRotateSpeed={1.8}
      makeDefault
    />
  );
}

// Studio Lighting Rig responding to environment presets
function StudioLighting() {
  const environment = useConfiguratorStore((state) => state.environment);

  switch (environment) {
    case "cyber_neon_grid":
      return (
        <>
          <ambientLight intensity={0.4} />
          {/* Key Light */}
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.5}
            color="#E6F8FF"
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0001}
          />
          {/* Cyan Rim Accent */}
          <pointLight position={[-4, 3, 3]} intensity={4.5} color="#00F0FF" distance={12} />
          {/* Magenta Rim Accent */}
          <pointLight position={[4, 2, -4]} intensity={4.0} color="#FF0055" distance={12} />
          {/* Bottom Under-Glow */}
          <pointLight position={[0, -1, 0]} intensity={2.5} color="#00F0FF" distance={5} />
        </>
      );

    case "studio_clean":
      return (
        <>
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[6, 10, 6]}
            intensity={2.2}
            color="#FFFFFF"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-6, 4, -4]} intensity={1.2} color="#D6E4F0" />
          <pointLight position={[0, 4, -3]} intensity={1.5} color="#FFFFFF" />
        </>
      );

    case "deep_obsidian":
      return (
        <>
          <ambientLight intensity={0.15} />
          <spotLight
            position={[0, 9, 2]}
            intensity={4.0}
            angle={0.5}
            penumbra={0.8}
            color="#FFFFFF"
            castShadow
          />
          <pointLight position={[-4, 1, 2]} intensity={2.0} color="#3B82F6" distance={8} />
          <pointLight position={[4, 1, -2]} intensity={2.0} color="#8B5CF6" distance={8} />
        </>
      );

    case "holographic_sunset":
      return (
        <>
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 6, 4]}
            intensity={2.2}
            color="#FFAA00"
            castShadow
          />
          <pointLight position={[-5, 3, 3]} intensity={4.0} color="#FF007F" distance={12} />
          <pointLight position={[3, 2, -5]} intensity={3.5} color="#7B2CBF" distance={12} />
          <pointLight position={[0, -1, 0]} intensity={2.0} color="#FFAA00" distance={6} />
        </>
      );

    default:
      return null;
  }
}

// Futuristic Holographic Podium Stage
function CyberStage() {
  const environment = useConfiguratorStore((state) => state.environment);

  return (
    <group position={[0, -0.48, 0]}>
      {/* Outer Hologram Perimeter Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.0, 2.05, 64]} />
        <meshBasicMaterial
          color={
            environment === "holographic_sunset"
              ? "#FF007F"
              : environment === "studio_clean"
              ? "#64748B"
              : "#00F0FF"
          }
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Inner Accent Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.3, 1.33, 48]} />
        <meshBasicMaterial
          color={
            environment === "holographic_sunset"
              ? "#FFE600"
              : environment === "studio_clean"
              ? "#94A3B8"
              : "#FF0055"
          }
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Soft Contact Shadow Plane */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.75}
        scale={6}
        blur={1.8}
        far={3.5}
        resolution={512}
        color={environment === "studio_clean" ? "#000000" : "#020408"}
      />
    </group>
  );
}

// Cyberpunk Initializing Fallback Loader
function CanvasLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#030407]/90 z-20 backdrop-blur-md">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-20 h-20 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <div className="absolute w-12 h-12 rounded-full border-2 border-pink-500/20 border-b-pink-500 animate-spin animate-reverse" />
        <Loader2 className="w-6 h-6 text-cyan-400 animate-pulse" />
      </div>
      <div className="text-center font-heading">
        <p className="text-cyan-400 font-bold text-sm tracking-[0.2em] uppercase animate-pulse">
          INITIALIZING WEBGL 3D ENGINE
        </p>
        <p className="text-slate-500 text-xs font-mono-code mt-1">
          Compiling PBR Shaders & Geometry Meshes...
        </p>
      </div>
    </div>
  );
}

interface ConfiguratorCanvasProps {
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export function ConfiguratorCanvas({ canvasRef }: ConfiguratorCanvasProps) {
  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-radial-gradient">
      <Suspense fallback={<CanvasLoader />}>
        <Canvas
          ref={canvasRef}
          camera={{ position: [3.2, 1.8, 3.4], fov: 45 }}
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
          <CyberStage />
          <ModelViewer />
          <CameraController />
        </Canvas>
      </Suspense>
    </div>
  );
}
