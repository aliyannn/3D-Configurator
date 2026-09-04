"use client";

import React, { useMemo } from "react";
import { useStudioStore } from "@/store/useStudioStore";
import { HondaCG125Model } from "./HondaCG125Model";
import { DynamicModelViewer } from "./DynamicModelViewer";
import { ProceduralCar } from "@/components/studio/models/ProceduralCar";
import { StudioMaterialType } from "@/data/modelsCatalog";

// Error Boundary to prevent any corrupt custom 3D file from crashing React Suspense
class ModelErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.error("Custom 3D Model Render Caught:", error);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export function ModelViewer() {
  const activeModelId = useStudioStore((state) => state.activeModelId);
  const customGlb = useStudioStore((state) => state.customGlb);
  const configurations = useStudioStore((state) => state.configurations);
  const activePartId = useStudioStore((state) => state.activePartId);
  const setActivePartId = useStudioStore((state) => state.setActivePartId);
  const updateDetectedMeshes = useStudioStore((state) => state.updateDetectedMeshes);

  // Extract color and finish dictionaries for custom model
  const { partColors, partFinishes } = useMemo(() => {
    const colors: Record<string, string> = {};
    const finishes: Record<string, StudioMaterialType> = {};
    const customConfig = configurations.custom || {};

    Object.entries(customConfig).forEach(([meshName, state]) => {
      colors[meshName] = state.color;
      finishes[meshName] = state.material;
    });

    return { partColors: colors, partFinishes: finishes };
  }, [configurations.custom]);

  // 1. Custom Uploaded .GLB / .GLTF (Safely Isolated in Error Boundary)
  if (activeModelId === "custom" && customGlb?.url) {
    return (
      <ModelErrorBoundary fallback={<HondaCG125Model />}>
        <React.Suspense fallback={null}>
          <DynamicModelViewer
            url={customGlb.url}
            selectedPart={activePartId}
            partColors={partColors}
            partFinishes={partFinishes}
            onMeshClick={setActivePartId}
          />
        </React.Suspense>
      </ModelErrorBoundary>
    );
  }

  // 2. Authentic Honda CG 125 Model
  if (activeModelId === "honda_cg125") {
    return <HondaCG125Model />;
  }

  // 3. Toyota GR Series
  return <ProceduralCar />;
}

export default ModelViewer;
