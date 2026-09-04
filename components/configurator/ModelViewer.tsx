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
  const currentModel = useStudioStore((state) => state.getCurrentModel());
  const configurations = useStudioStore((state) => state.configurations);
  const activePartId = useStudioStore((state) => state.activePartId);
  const setActivePartId = useStudioStore((state) => state.setActivePartId);

  // Extract color and finish dictionaries for the active model
  const { partColors, partFinishes } = useMemo(() => {
    const colors: Record<string, string> = {};
    const finishes: Record<string, StudioMaterialType> = {};
    const modelConfig = configurations[activeModelId] || {};

    Object.entries(modelConfig).forEach(([partId, state]) => {
      colors[partId] = state.color;
      finishes[partId] = state.material;
    });

    return { partColors: colors, partFinishes: finishes };
  }, [configurations, activeModelId]);

  // 1. Custom Uploaded .GLB / .GLTF (Safely Isolated in Error Boundary)
  if (activeModelId === "custom" && customGlb?.url) {
    return (
      <ModelErrorBoundary fallback={<HondaCG125Model />}>
        <React.Suspense fallback={null}>
          <DynamicModelViewer
            key={customGlb.url}
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

  // 2. Catalog Models with static GLB asset (Honda CG 125, CBR 650R, S2000, etc.)
  if (currentModel?.modelUrl) {
    return (
      <ModelErrorBoundary fallback={<HondaCG125Model />}>
        <React.Suspense fallback={null}>
          <DynamicModelViewer
            key={currentModel.id}
            url={currentModel.modelUrl}
            selectedPart={activePartId}
            partColors={partColors}
            partFinishes={partFinishes}
            onMeshClick={setActivePartId}
          />
        </React.Suspense>
      </ModelErrorBoundary>
    );
  }

  // 3. Procedural Fallback Models
  if (currentModel?.category === "motorcycles") {
    return <HondaCG125Model />;
  }
  return <ProceduralCar />;
}

export default ModelViewer;

