"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Environment,
  AdaptiveDpr,
  AdaptiveEvents,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { useStudioStore, CameraPreset } from "@/store/useStudioStore";
import { ModelViewer } from "./ModelViewer";
import { Loader2 } from "lucide-react";

// Camera Controller with Real-World Vehicle Presets (including Engine Close-Up)
function CameraRig() {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cameraPreset = useStudioStore((state) => state.cameraPreset);
  const cameraTriggerCount = useStudioStore((state) => state.cameraTriggerCount);
  const autoRotate = useStudioStore((state) => state.autoRotate);
  const toggleAutoRotate = useStudioStore((state) => state.toggleAutoRotate);
  const currentModel = useStudioStore((state) => state.getCurrentModel());

  useEffect(() => {
    let targetPos: [number, number, number];
    let targetLookAt: [number, number, number] = [0, 0.45, 0];

    if (currentModel.id === "honda_cg125") {
      switch (cameraPreset) {
        case "front_three_quarter":
          targetPos = [2.6, 1.4, 2.7];
          targetLookAt = [0, 0.45, 0];
          break;
        case "side_profile":
          targetPos = [0.01, 0.85, 3.4];
          targetLookAt = [0, 0.45, 0];
          break;
        case "engine_closeup":
          targetPos = [0.95, 0.65, 1.35];
          targetLookAt = [0.1, 0.45, 0]; // Focused on engine & cylinder head
          break;
        case "top_down":
          targetPos = [0.01, 3.8, 0.01];
          targetLookAt = [0, 0.4, 0];
          break;
        default:
          targetPos = [2.6, 1.4, 2.7];
      }
    } else {
      // Cars (Toyota Supra / Corolla GR)
      switch (cameraPreset) {
        case "front_three_quarter":
          targetPos = [3.8, 1.6, 3.9];
          targetLookAt = [0, 0.35, 0];
          break;
        case "side_profile":
          targetPos = [0.01, 0.9, 4.8];
          targetLookAt = [0, 0.35, 0];
          break;
        case "engine_closeup":
          targetPos = [1.8, 1.2, 1.6];
          targetLookAt = [0.8, 0.4, 0]; // Focused on front wheel & caliper
          break;
        case "top_down":
          targetPos = [0.01, 5.2, 0.01];
          targetLookAt = [0, 0.35, 0];
          break;
        default:
          targetPos = [3.8, 1.6, 3.9];
      }
    }

    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(...targetPos);
    const targetEnd = new THREE.Vector3(...targetLookAt);

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
  }, [cameraPreset, cameraTriggerCount, currentModel.id, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={1.2}
      maxDistance={9.0}
      minPolarAngle={0.1}
      maxPolarAngle={Math.PI / 2 - 0.02} // Ground-locked
      autoRotate={autoRotate}
      autoRotateSpeed={0.8}
      onStart={() => {
        if (autoRotate) {
          toggleAutoRotate();
        }
      }}
      makeDefault
    />
  );
}

// White Showroom Lighting Rig
function WhiteShowroomLighting() {
  return (
    <>
      <ambientLight intensity={0.7} />
      {/* Warm Main Overhead Key Light */}
      <spotLight
        position={[5, 9, 6]}
        intensity={2.8}
        angle={0.65}
        penumbra={0.7}
        color="#FFFBF5"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      {/* Soft Cool Fill Light for chrome reflections */}
      <directionalLight position={[-6, 6, -4]} intensity={1.2} color="#EDF2F7" />
      {/* High-Key Rim Light */}
      <pointLight position={[0, 4, -6]} intensity={1.5} color="#FFFFFF" distance={16} />
      {/* High-End Showroom HDRI Reflections */}
      <Environment preset="studio" />
    </>
  );
}

// Minimal Clean Showroom Loader
function ShowroomLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F8FAFC]/90 backdrop-blur-md z-20 select-none">
      <div className="relative flex items-center justify-center mb-3">
        <div className="w-12 h-12 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
        <Loader2 className="w-5 h-5 text-slate-800 animate-pulse" />
      </div>
      <p className="text-xs font-semibold text-slate-700 font-mono tracking-wider uppercase">
        Loading Showroom Model...
      </p>
    </div>
  );
}

interface ConfiguratorCanvasProps {
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export function ConfiguratorCanvas({ canvasRef }: ConfiguratorCanvasProps) {
  const autoRotate = useStudioStore((state) => state.autoRotate);
  const toggleAutoRotate = useStudioStore((state) => state.toggleAutoRotate);

  // Turntable enabled on initial mount
  useEffect(() => {
    if (!autoRotate) {
      toggleAutoRotate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]">
      {/* Subtle Studio Lighting Radial Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.9)_0%,rgba(226,232,240,0.6)_80%)] pointer-events-none" />

      <Suspense fallback={<ShowroomLoader />}>
        <Canvas
          ref={canvasRef}
          camera={{ position: [2.8, 1.4, 3.0], fov: 38 }}
          dpr={[1, 1.5]}
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.12,
            powerPreference: "high-performance",
          }}
          shadows
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <WhiteShowroomLighting />

          {/* Soft Ground Contact Shadows on Slate White Floor */}
          <ContactShadows
            position={[0, -0.01, 0]}
            opacity={0.65}
            scale={20}
            blur={1.8}
            far={4.5}
            resolution={1024}
            color="#1E293B"
          />

          {/* Real-World Vehicle 3D Model */}
          <ModelViewer />

          {/* Smooth Camera Rig */}
          <CameraRig />
        </Canvas>
      </Suspense>
    </div>
  );
}
