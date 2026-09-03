"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  AdaptiveDpr,
  AdaptiveEvents,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { useStudioStore, CameraPreset } from "@/store/useStudioStore";
import { SceneModelManager } from "@/components/studio/SceneModelManager";
import { Loader2 } from "lucide-react";

// Smooth Camera Controller with Clamped Angles
function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cameraPreset = useStudioStore((state) => state.cameraPreset);
  const cameraTriggerCount = useStudioStore((state) => state.cameraTriggerCount);
  const autoRotate = useStudioStore((state) => state.autoRotate);
  const toggleAutoRotate = useStudioStore((state) => state.toggleAutoRotate);
  const currentModel = useStudioStore((state) => state.getCurrentModel());

  useEffect(() => {
    const baseTarget = currentModel.cameraDefaults?.target || [0, 0.35, 0];
    const baseDist = Math.hypot(...currentModel.cameraDefaults.position);

    let targetPos: [number, number, number];
    switch (cameraPreset) {
      case "front_three_quarter":
        targetPos = [
          baseDist * 0.72,
          baseDist * 0.4,
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
      dampingFactor={0.06}
      minDistance={1.4}
      maxDistance={10}
      minPolarAngle={0.1}
      maxPolarAngle={Math.PI / 2 - 0.02} // Prevent slipping below ground
      autoRotate={autoRotate}
      autoRotateSpeed={1.2}
      onStart={() => {
        // Seamlessly stop auto-rotation on user interaction
        if (autoRotate) {
          toggleAutoRotate();
        }
      }}
      makeDefault
    />
  );
}

// Clean Apple-Style Studio Lighting Rig
function CleanStudioLighting() {
  return (
    <>
      <ambientLight intensity={0.8} />
      {/* Key Directional Light */}
      <directionalLight
        position={[6, 9, 6]}
        intensity={2.2}
        color="#FFFFFF"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      {/* Soft Fill Light */}
      <directionalLight position={[-6, 4, -4]} intensity={0.9} color="#E2E8F0" />
      {/* Subtle Rim Accent */}
      <pointLight position={[0, 4, -5]} intensity={1.2} color="#F8FAFC" distance={15} />
    </>
  );
}

// Clean Contact Shadow Stage (No harsh neon lines)
function CleanStage() {
  return (
    <group position={[0, 0, 0]}>
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.65}
        scale={7}
        blur={2.4}
        far={3.5}
        resolution={512}
        color="#080B12"
      />
    </group>
  );
}

// Elegant Minimalist Studio Loader
function MinimalLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#090B10]/80 backdrop-blur-md z-20">
      <div className="relative flex items-center justify-center mb-3">
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-white animate-spin" />
        <Loader2 className="w-5 h-5 text-white animate-pulse" />
      </div>
      <p className="text-xs font-medium text-zinc-400 font-mono tracking-wider">
        Loading 3D Product...
      </p>
    </div>
  );
}

interface StudioViewportProps {
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export function StudioViewport({ canvasRef }: StudioViewportProps) {
  const autoRotate = useStudioStore((state) => state.autoRotate);
  const toggleAutoRotate = useStudioStore((state) => state.toggleAutoRotate);

  // Enable auto-rotation by default on load for that smooth product spin
  useEffect(() => {
    if (!autoRotate) {
      toggleAutoRotate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      <Suspense fallback={<MinimalLoader />}>
        <Canvas
          ref={canvasRef}
          camera={{ position: [4.2, 2.2, 4.8], fov: 42 }}
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
          <CleanStudioLighting />
          <CleanStage />
          <SceneModelManager />
          <CameraController />
        </Canvas>
      </Suspense>
    </div>
  );
}
