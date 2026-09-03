"use client";

import React, { useState } from "react";
import { useStudioStore } from "@/store/useStudioStore";
import { STUDIO_MATERIALS } from "@/data/modelsCatalog";
import { X, Download, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { formatCurrency } from "@/lib/utils";
import { cyberAudio } from "@/lib/audio";

export function MinimalSpecModal() {
  const specModalOpen = useStudioStore((state) => state.specModalOpen);
  const setSpecModalOpen = useStudioStore((state) => state.setSpecModalOpen);
  const currentModel = useStudioStore((state) => state.getCurrentModel());
  const configurations = useStudioStore((state) => state.configurations);
  const buildSerial = useStudioStore((state) => state.buildSerial);
  const capturedImage = useStudioStore((state) => state.capturedImage);
  const soundEnabled = useStudioStore((state) => state.soundEnabled);
  const calculateTotalPrice = useStudioStore((state) => state.calculateTotalPrice);

  const [orderSent, setOrderSent] = useState(false);

  if (!specModalOpen) return null;

  const modelConfig = configurations[currentModel.id] || {};
  const totalPrice = calculateTotalPrice();

  // Download Formatted Technical Spec Sheet
  const handleDownloadSpec = () => {
    if (soundEnabled) cyberAudio.playSnap();

    let text = `====================================================\n`;
    text += `   APEX STUDIO • CUSTOM BUILD SPEC SHEET\n`;
    text += `====================================================\n`;
    text += `PRODUCT: ${currentModel.title} (${currentModel.badge})\n`;
    text += `SERIAL ID: ${buildSerial}\n`;
    text += `GENERATED: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
    text += `TOTAL VALUATION: ${formatCurrency(totalPrice)}\n\n`;
    text += `--- CUSTOMIZED COMPONENT SPECIFICATIONS ---\n`;

    currentModel.parts.forEach((part) => {
      const pConfig = modelConfig[part.id] || {
        color: part.defaultColor,
        material: part.defaultMaterial,
      };
      const mat = STUDIO_MATERIALS[pConfig.material] || STUDIO_MATERIALS.gloss;
      text += `[${part.name.toUpperCase()}]\n`;
      text += `  • Finish: ${mat.name}\n`;
      text += `  • Color Hex: ${pConfig.color}\n`;
      text += `  • Details: Roughness: ${mat.roughness}, Metalness: ${mat.metalness}\n`;
      text += `  • Surcharge: ${formatCurrency(mat.surcharge)}\n\n`;
    });

    text += `====================================================\n`;
    text += `Verified by Apex Universal Design & Fabrication Lab\n`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentModel.id}_${buildSerial}_SpecSheet.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSimulateOrder = () => {
    setOrderSent(true);
    if (soundEnabled) cyberAudio.playSuccess();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFFFFF", "#00F0FF", "#38BDF8", "#F59E0B"],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl max-h-[88vh] bg-zinc-950 border border-white/10 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-zinc-900/50">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
              Build Specification
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              {currentModel.title} • {buildSerial}
            </p>
          </div>

          <button
            onClick={() => {
              if (soundEnabled) cyberAudio.playTick();
              setSpecModalOpen(false);
              setOrderSent(false);
            }}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!orderSent ? (
            <>
              {/* Snapshot Preview Card */}
              {capturedImage ? (
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/40 p-2 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={capturedImage}
                    alt="Custom Product Render"
                    className="max-h-48 object-contain rounded-xl"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-zinc-950/80 border border-white/10 text-[10px] text-zinc-300 font-mono">
                    3D Render Preview
                  </span>
                </div>
              ) : null}

              {/* Parts Breakdown */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Customized Components
                </h3>

                <div className="divide-y divide-white/[0.06] rounded-2xl bg-zinc-900/40 border border-white/[0.08] overflow-hidden">
                  {currentModel.parts.map((part) => {
                    const pConfig = modelConfig[part.id] || {
                      color: part.defaultColor,
                      material: part.defaultMaterial,
                    };
                    const mat =
                      STUDIO_MATERIALS[pConfig.material] || STUDIO_MATERIALS.gloss;

                    return (
                      <div
                        key={part.id}
                        className="flex items-center justify-between p-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: pConfig.color }}
                          />
                          <div>
                            <p className="font-medium text-white">{part.name}</p>
                            <p className="text-[11px] text-zinc-400 font-mono">
                              {mat.name} •{" "}
                              <span className="text-zinc-200 uppercase">
                                {pConfig.color}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="text-right font-mono text-zinc-400">
                          {mat.surcharge > 0
                            ? `+${formatCurrency(mat.surcharge)}`
                            : "Standard"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Summary */}
              <div className="flex items-baseline justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <span className="text-sm font-medium text-zinc-300">Total Valuation</span>
                <span className="text-2xl font-bold font-mono text-white">
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handleDownloadSpec}
                  className="w-full sm:w-auto flex-1 py-3 px-5 rounded-full text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 border border-white/15 flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Spec Sheet (.TXT)</span>
                </button>

                <button
                  onClick={handleSimulateOrder}
                  className="w-full sm:w-auto flex-1 py-3 px-5 rounded-full text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-100 shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-zinc-950" />
                  <span>Send Build to Shop</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            /* Order Confirmed View */
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Build Specification Transmitted!
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  ORDER REFERENCE: <span className="text-white font-bold">{buildSerial}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10 max-w-sm mx-auto text-left text-xs space-y-2 text-zinc-300">
                <div className="flex justify-between">
                  <span>Product Model:</span>
                  <span className="font-semibold text-white">{currentModel.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valuation:</span>
                  <span className="font-mono font-semibold text-white">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Fabrication Status:</span>
                  <span className="text-emerald-400 font-mono">SPEC QUEUED</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSpecModalOpen(false);
                  setOrderSent(false);
                }}
                className="px-6 py-2.5 rounded-full bg-white text-zinc-950 font-semibold text-xs transition-all"
              >
                Return to 3D Viewport
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
