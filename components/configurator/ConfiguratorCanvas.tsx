"use client";

import React, { Suspense, useEffect, useRef, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Environment,
  AdaptiveDpr,
  AdaptiveEvents,
  useProgress,
  useGLTF,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { useStudioStore, CameraPreset } from "@/store/useStudioStore";
import { MODELS_CATALOG } from "@/data/modelsCatalog";
import { ModelViewer } from "./ModelViewer";
import { UIOverlay } from "./UIOverlay";
import { SpecSheetModal } from "./SpecSheetModal";
import { FileUploader } from "./FileUploader";
import { Loader2 } from "lucide-react";

// Camera Controller with Real-World Honda CG 125 Angles
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

    if (currentModel.category === "motorcycles") {
      switch (cameraPreset) {
        case "left_profile":
          // Authentic Left Side View (Photo #1 in reference sheet)
          targetPos = [0.01, 0.65, -3.1];
          targetLookAt = [0, 0.45, 0];
          break;
        case "right_profile":
          // Authentic Right Side View (Photo #2 in reference sheet)
          targetPos = [0.01, 0.65, 3.1];
          targetLookAt = [0, 0.45, 0];
          break;
        case "front_three_quarter":
          // Right Front 3/4 View (Photo #5 in reference sheet)
          targetPos = [2.4, 1.25, 2.5];
          targetLookAt = [0, 0.45, 0];
          break;
        case "rear_three_quarter":
          // Right Rear 3/4 View (Photo #8 in reference sheet)
          targetPos = [-2.4, 1.25, 2.4];
          targetLookAt = [0, 0.45, 0];
          break;
        case "engine_closeup":
          // Authentic Engine & Cylinder Fin Zoom (Photo #23 in reference sheet)
          targetPos = [0.55, 0.52, 1.15];
          targetLookAt = [0.06, 0.45, 0];
          break;
        case "tank_closeup":
          // Authentic Fuel Tank & Decals Zoom (Photo #19 in reference sheet)
          targetPos = [0.65, 1.05, 1.05];
          targetLookAt = [0.16, 0.78, 0];
          break;
        default:
          targetPos = [2.4, 1.25, 2.5];
          targetLookAt = [0, 0.45, 0];
      }
    } else {
      // Cars (Toyota Supra)
      switch (cameraPreset) {
        case "left_profile":
          targetPos = [0.01, 0.9, -4.6];
          targetLookAt = [0, 0.35, 0];
          break;
        case "right_profile":
          targetPos = [0.01, 0.9, 4.6];
          targetLookAt = [0, 0.35, 0];
          break;
        case "front_three_quarter":
          targetPos = [3.8, 1.6, 3.8];
          targetLookAt = [0, 0.35, 0];
          break;
        case "rear_three_quarter":
          targetPos = [-3.8, 1.6, 3.8];
          targetLookAt = [0, 0.35, 0];
          break;
        default:
          targetPos = [3.8, 1.6, 3.8];
          targetLookAt = [0, 0.35, 0];
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
      minDistance={1.1}
      maxDistance={8.5}
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

// High-End Pure White Studio Lighting Rig
function WhiteStudioLighting() {
  return (
    <>
      <ambientLight intensity={0.85} />
      {/* Overhead Softbox Key Light */}
      <directionalLight
        position={[4, 8, 5]}
        intensity={2.6}
        color="#FFFFFF"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      {/* Soft Fill Light to eliminate harsh shadows on left engine side */}
      <directionalLight position={[-5, 5, -4]} intensity={1.4} color="#F1F5F9" />
      {/* Rim Light for chrome edge highlights */}
      <pointLight position={[0, 3.5, -5]} intensity={1.6} color="#FFFFFF" distance={15} />
      {/* Authentic Studio HDRI Environment for chrome silencer reflections */}
      <Environment preset="studio" />
    </>
  );
}

// Elegant Studio Loader for initial WebGL mount
function StudioLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md z-20 select-none">
      <div className="relative flex items-center justify-center mb-3">
        <div className="w-12 h-12 rounded-full border-2 border-slate-300 border-t-red-600 animate-spin" />
        <Loader2 className="w-5 h-5 text-red-600 animate-pulse" />
      </div>
      <p className="text-xs font-bold text-slate-800 font-mono tracking-wider uppercase">
        Initializing 3D Showroom...
      </p>
    </div>
  );
}

// Live Real-Time 3D Asset Loading Overlay with Percentage
function StudioProgressOverlay() {
  const { active, progress } = useProgress();
  const currentModel = useStudioStore((state) => state.getCurrentModel());
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 350);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!visible) return null;

  const pct = Math.min(100, Math.round(progress));

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md z-30 select-none animate-in fade-in duration-200">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-red-600 animate-spin" />
        <span className="absolute text-xs font-mono font-bold text-slate-800">
          {pct}%
        </span>
      </div>
      <p className="text-xs font-bold text-slate-900 font-mono tracking-wider uppercase mb-2">
        Loading {currentModel.title}
      </p>
      <div className="w-56 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
        <div
          className="h-full bg-red-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] text-slate-400 font-mono mt-2">
        {pct}% streaming 3D showroom geometry & textures
      </p>
    </div>
  );
}

interface ConfiguratorCanvasProps {
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export function ConfiguratorCanvas({ canvasRef: externalCanvasRef }: ConfiguratorCanvasProps = {}) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;
  const autoRotate = useStudioStore((state) => state.autoRotate);
  const toggleAutoRotate = useStudioStore((state) => state.toggleAutoRotate);
  const setCapturedImage = useStudioStore((state) => state.setCapturedImage);
  const buildSerial = useStudioStore((state) => state.buildSerial);
  const currentModel = useStudioStore((state) => state.getCurrentModel());

  // Turntable enabled on initial mount
  useEffect(() => {
    if (!autoRotate) {
      toggleAutoRotate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Idle sequential background cache warming: Pre-fetches remaining catalog models
  // only after initial mount has settled, spaced out by 2.5s to avoid network contention
  useEffect(() => {
    if (typeof window === "undefined") return;

    const startTimer = setTimeout(() => {
      const remainingModels = MODELS_CATALOG.filter(
        (m) => m.modelUrl && m.id !== currentModel.id
      );

      let idx = 0;
      const interval = setInterval(() => {
        if (idx >= remainingModels.length) {
          clearInterval(interval);
          return;
        }
        const model = remainingModels[idx];
        if (model?.modelUrl) {
          try {
            useGLTF.preload(model.modelUrl);
          } catch {
            // safe ignore
          }
        }
        idx++;
      }, 2500);

      return () => clearInterval(interval);
    }, 4500);

    return () => clearTimeout(startTimer);
  }, [currentModel.id]);

  // Instant Snapshot Capture with Clean Studio Watermark
  const handleCaptureSnapshot = useCallback((download = true) => {
    const canvas = canvasRef.current || document.querySelector("canvas");
    if (!canvas) return;

    try {
      // Create offscreen canvas to stamp clean watermark
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const ctx = exportCanvas.getContext("2d");

      if (ctx) {
        // Draw 3D scene
        ctx.drawImage(canvas, 0, 0);

        // Draw clean studio watermark
        const fontSize = Math.max(16, Math.round(canvas.width / 45));
        ctx.font = `600 ${fontSize}px sans-serif`;
        ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
        ctx.textAlign = "right";
        ctx.fillText("Built via Aliyan 3D Studio", canvas.width - 30, canvas.height - 30);

        const dataUrl = exportCanvas.toDataURL("image/png");
        setCapturedImage(dataUrl);

        // Download trigger
        if (download) {
          const link = document.createElement("a");
          link.download = `${currentModel.id}_${buildSerial}_AliyanStudio.png`;
          link.href = dataUrl;
          link.click();
        }
      }
    } catch (err) {
      console.error("Snapshot capture failed:", err);
    }
  }, [canvasRef, setCapturedImage, buildSerial, currentModel.id]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-white">
      {/* Clean White Studio Photography Radial Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#FFFFFF_0%,#F8FAFC_65%,#EEF2F6_100%)] pointer-events-none" />

      <Suspense fallback={<StudioLoader />}>
        <Canvas
          ref={canvasRef}
          camera={{ position: [2.4, 1.25, 2.5], fov: 38 }}
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
          <WhiteStudioLighting />

          {/* Realistic Soft Ground Shadow Beneath Wheels & Center Stand */}
          <ContactShadows
            position={[0, -0.01, 0]}
            opacity={0.65}
            scale={16}
            blur={1.8}
            far={4.0}
            resolution={1024}
            color="#1E293B"
          />

          {/* Authentic Honda CG 125 3D Model */}
          <ModelViewer />

          {/* Camera Rig with Multi-Angle View Presets */}
          <CameraRig />
        </Canvas>
      </Suspense>

      {/* Real-Time 3D Asset Loading Progress Bar */}
      <StudioProgressOverlay />

      {/* Floating UI HUD (Brand & Model Pickers, Bottom Floating Dock) */}
      <UIOverlay onCaptureSnapshot={handleCaptureSnapshot} />

      {/* Mechanic-Ready Printable Spec Sheet Modal */}
      <SpecSheetModal />

      {/* Universal Generic 3D Model File Uploader */}
      <FileUploader />
    </div>
  );
}

export default ConfiguratorCanvas;

