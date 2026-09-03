"use client";

import React from "react";
import { useStudioStore } from "@/store/useStudioStore";
import { HondaCG125Model } from "./HondaCG125Model";
import { ProceduralCar } from "@/components/studio/models/ProceduralCar";

export function ModelViewer() {
  const activeModelId = useStudioStore((state) => state.activeModelId);

  if (activeModelId === "honda_cg125") {
    return <HondaCG125Model />;
  }

  // Toyota GR Supra or Corolla GR
  return <ProceduralCar />;
}
