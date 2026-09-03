"use client";

import React, { useMemo } from "react";
import { useStudioStore } from "@/store/useStudioStore";
import { HondaCG125Model } from "./HondaCG125Model";
import { DynamicModelViewer } from "./DynamicModelViewer";
import { ProceduralCar } from "@/components/studio/models/ProceduralCar";
import { StudioMaterialType } from "@/data/modelsCatalog";

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

  // 1. Custom Uploaded .GLB / .GLTF
  if (activeModelId === "custom" && customGlb?.url) {
    return (
      <DynamicModelViewer
        url={customGlb.url}
        selectedPart={activePartId}
        partColors={partColors}
        partFinishes={partFinishes}
        onMeshListExtracted={updateDetectedMeshes}
        onMeshClick={setActivePartId}
      />
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
