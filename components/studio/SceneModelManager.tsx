"use client";

import React from "react";
import { useStudioStore } from "@/store/useStudioStore";
import { ProceduralCar } from "./models/ProceduralCar";
import { ProceduralBike } from "./models/ProceduralBike";
import { ProceduralSofa } from "./models/ProceduralSofa";
import { ProceduralSneaker } from "./models/ProceduralSneaker";
import { ProceduralHeadphones } from "./models/ProceduralHeadphones";
import { DynamicGlbViewer } from "./models/DynamicGlbViewer";

export function SceneModelManager() {
  const activeModelId = useStudioStore((state) => state.activeModelId);
  const customGlb = useStudioStore((state) => state.customGlb);

  switch (activeModelId) {
    case "car_gtx":
      return <ProceduralCar />;
    case "bike_valkyrie":
      return <ProceduralBike />;
    case "sofa_haven":
      return <ProceduralSofa />;
    case "sneaker_apex":
      return <ProceduralSneaker />;
    case "headphones_aura":
      return <ProceduralHeadphones />;
    case "custom":
      if (customGlb?.url) {
        return <DynamicGlbViewer url={customGlb.url} />;
      }
      return <ProceduralCar />;
    default:
      return <ProceduralCar />;
  }
}
