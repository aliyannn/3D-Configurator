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

// Camera Controller with Smooth Lerping & Auto-Orbit
function CameraRig() {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cameraPreset = useStudioStore((state) => state.cameraPreset);
  const cameraTriggerCount = useStudioStore((state) => state.cameraTriggerCount);
  const autoRotate = useStudioStore((state) => state.autoRotate);
  const toggleAutoRotate = useStudioStore((state) => state.toggleAutoRotate);
  const currentModel = useStudioStore((state) => state.getCurrentModel());

  useEffect(() => {
    const baseTarget = currentModel.cameraDefaults?.target || [0, 0.4, 0];
    const baseDist = Math.hypot(...currentModel.cameraDefaults.position);

    let targetPos: [number, number, number];
    switch (cameraPreset) {
      case "front_three_quarter":
        targetPos = [baseDist * 0.72, baseDist * 0.38, baseDist * 0.75];
        break;
      case "side_profile":
        targetPos = [0.01, baseDist * 0.22, baseDist * 0.95];
        break;
      case "top_down":
        targetPos = [0.01, baseDist * 1.15, 0.01];
        break;
      case "detail_close":
        targetPos = [baseDist * 0.38, baseDist * 0.22, baseDist * 0.42];
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
      dampingFactor={0.06}
      minDistance={1.4}
      maxDistance={9.5}
      minPolarAngle={0.1}
      maxPolarAngle={Math.PI / 2 - 0.02} // Anchors firmly above the floor
      autoRotate={autoRotate}
      autoRotateSpeed={0.8} // Gentle ~0.5 rpm showroom turntable
      onStart={() => {
        // Pauses turntable immediately on user drag or touch
        if (autoRotate) {
          toggleAutoRotate();
        }
      }}
      makeDefault
    />
  );
}

// Showroom Studio Lighting Rig
function ShowroomLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      {/* Soft Overhead Key Spotlight for authentic car paint highlights */}
      <spotLight
        position={[4, 8, 4]}
        intensity={2.5}
        angle={0.6}
        penumbra={0.7}
        color="#FFFFFF"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      {/* Soft Studio Directional Fill */}
      <directionalLight position={[-6, 5, -4]} intensity={1.0} color="#E2E8F0" />
      {/* Subtle Rim Accent */}
      <pointLight position={[0, 3, -6]} intensity={1.5} color="#F8FAFC" distance={15} />
      {/* Realistic Showroom HDRI Environment Reflections */}
      <Environment preset="city" />
    </>
  );
}

// Elegant Studio Loading Screen
function ShowroomLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0D0F14]/90 backdrop-blur-md z-20">
      <div className="relative flex items-center justify-center mb-3">
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-white animate-spin" />
        <Loader2 className="w-5 h-5 text-white animate-pulse" />
      </div>
      <p className="text-xs font-medium text-zinc-300 font-mono tracking-wider">
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

  // Enable gentle turntable by default on load
  useEffect(() => {
    if (!autoRotate) {
      toggleAutoRotate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      <Suspense fallback={<ShowroomLoader />}>
        <Canvas
          ref={canvasRef}
          camera={{ position: [4.2, 1.6, 4.6], fov: 38 }}
          dpr={[1, 1.5]}
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
            powerPreference: "high-performance",
          }}
          shadows
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <ShowroomLighting />

          {/* High-Resolution Contact Shadows Anchoring to Floor */}
          <ContactShadows
            position={[0, -0.01, 0]}
            opacity={0.75}
            scale={20}
            blur={2}
            far={4.5}
            resolution={1024}
            color="#000000"
          />

          {/* 3D Model Viewer with Clearcoat Automotive Shaders */}
          <ModelViewer />

          {/* Interactive Camera Rig */}
          <CameraRig />
        </Canvas>
      </Suspense>
    </div>
  );
}
