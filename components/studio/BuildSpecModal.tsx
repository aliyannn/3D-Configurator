"use client";

import React, { useState } from "react";
import { useStudioStore } from "@/store/useStudioStore";
import { STUDIO_MATERIALS } from "@/data/modelsCatalog";
import {
  X,
  Download,
  CheckCircle2,
  FileCode,
  Copy,
  Check,
  Send,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";
import confetti from "canvas-confetti";
import { formatCurrency } from "@/lib/utils";
import { cyberAudio } from "@/lib/audio";

export function BuildSpecModal() {
  const specModalOpen = useStudioStore((state) => state.specModalOpen);
  const setSpecModalOpen = useStudioStore((state) => state.setSpecModalOpen);
  const currentModel = useStudioStore((state) => state.getCurrentModel());
  const configurations = useStudioStore((state) => state.configurations);
  const buildSerial = useStudioStore((state) => state.buildSerial);
  const capturedImage = useStudioStore((state) => state.capturedImage);
  const soundEnabled = useStudioStore((state) => state.soundEnabled);
  const calculateTotalPrice = useStudioStore((state) => state.calculateTotalPrice);
  const exportConfigJSON = useStudioStore((state) => state.exportConfigJSON);

  const [copied, setCopied] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  if (!specModalOpen) return null;

  const modelConfig = configurations[currentModel.id] || {};
  const totalPrice = calculateTotalPrice();

  // Handle Spec Sheet TXT Download
  const handleDownloadSpec = () => {
    if (soundEnabled) cyberAudio.playSnap();

    let text = `====================================================\n`;
    text += `   UNIVERSAL 3D PRODUCT CUSTOMIZER - BUILD SPEC SHEET\n`;
    text += `====================================================\n`;
    text += `MODEL: ${currentModel.title} (${currentModel.category.toUpperCase()})\n`;
    text += `SERIAL NUMBER: ${buildSerial}\n`;
    text += `DATE: ${new Date().toISOString()}\n`;
    text += `TOTAL VALUATION: ${formatCurrency(totalPrice)}\n\n`;
    text += `--- COMPONENT SPECIFICATIONS (BOM) ---\n`;

    currentModel.parts.forEach((part) => {
      const pConfig = modelConfig[part.id] || {
        color: part.defaultColor,
        material: part.defaultMaterial,
      };
      const mat = STUDIO_MATERIALS[pConfig.material] || STUDIO_MATERIALS.gloss;
      text += `[${part.name.toUpperCase()}]\n`;
      text += `  - Surface Finish: ${mat.name}\n`;
      text += `  - Hex Color Code: ${pConfig.color}\n`;
      text += `  - Roughness: ${mat.roughness} | Metalness: ${mat.metalness}\n`;
      text += `  - Surcharge: ${formatCurrency(mat.surcharge)}\n\n`;
    });

    text += `====================================================\n`;
    text += `Apex Universal Fabrication Labs • Precision 3D Engine\n`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentModel.id}_${buildSerial}_SpecSheet.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Handle JSON Configuration File Download
  const handleDownloadJSON = () => {
    if (soundEnabled) cyberAudio.playTick();
    const jsonStr = exportConfigJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentModel.id}_${buildSerial}_Config.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Handle Copy JSON string to Clipboard
  const handleCopyJSON = () => {
    if (soundEnabled) cyberAudio.playTick();
    navigator.clipboard.writeText(exportConfigJSON());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle Simulated Order Checkout
  const handlePlaceOrder = () => {
    setOrderConfirmed(true);
    if (soundEnabled) cyberAudio.playSuccess();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#00F0FF", "#FF0055", "#F59E0B", "#10B981", "#FFFFFF"],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300 select-none">
      <div className="relative w-full max-w-3xl max-h-[90vh] cyber-glass rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-cyan-500/20 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <PackageCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold font-heading text-white tracking-wide">
                BUILD SPECIFICATION & EXPORT
              </h2>
              <p className="text-xs font-mono-code text-cyan-400">
                {currentModel.title} • SERIAL: {buildSerial}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (soundEnabled) cyberAudio.playTick();
              setSpecModalOpen(false);
              setOrderConfirmed(false);
            }}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
          {!orderConfirmed ? (
            <>
              {/* Snapshot Image Preview (if taken) */}
              {capturedImage && (
                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-950/80 p-2 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={capturedImage}
                    alt="Custom Product Render"
                    className="max-h-48 object-contain rounded-xl"
                  />
                  <div className="absolute top-4 left-4 px-2 py-0.5 rounded bg-slate-900/90 border border-cyan-500/40 text-[9px] font-mono-code text-cyan-300">
                    4K STUDIO CANVAS RENDER
                  </div>
                </div>
              )}

              {/* Bill of Materials (BOM) */}
              <div>
                <h3 className="text-xs font-heading uppercase tracking-widest text-slate-400 mb-2.5 flex items-center justify-between">
                  <span>BILL OF MATERIALS & FINISH SPECS</span>
                  <span className="text-cyan-400 font-mono-code">
                    {currentModel.parts.length} CUSTOMIZED ZONES
                  </span>
                </h3>

                <div className="divide-y divide-slate-800/80 rounded-2xl bg-slate-950/60 border border-slate-800 overflow-hidden">
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
                        className="flex items-center justify-between p-3 text-xs hover:bg-slate-900/40 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 rounded-lg border border-white/20 shrink-0 shadow-sm"
                            style={{ backgroundColor: pConfig.color }}
                          />
                          <div>
                            <p className="font-bold text-white font-heading">{part.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono-code">
                              {mat.name} •{" "}
                              <span className="text-cyan-400 uppercase font-medium">
                                {pConfig.color}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-mono-code font-bold text-slate-200">
                            {mat.surcharge > 0
                              ? `+${formatCurrency(mat.surcharge)}`
                              : "Standard"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/30 space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Base Product Platform</span>
                  <span className="font-mono-code">{formatCurrency(currentModel.basePrice)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>PBR Finishes & Customization Surcharges</span>
                  <span className="font-mono-code">
                    +{formatCurrency(totalPrice - currentModel.basePrice)}
                  </span>
                </div>
                <div className="border-t border-cyan-500/30 pt-2 flex justify-between items-baseline">
                  <span className="text-sm font-heading font-bold text-white">
                    TOTAL ESTIMATED VALUATION
                  </span>
                  <span className="text-2xl font-black font-heading text-cyan-400">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Export Suite Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <button
                  onClick={handleDownloadSpec}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-heading font-bold hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>EXPORT SPEC (.TXT)</span>
                </button>

                <button
                  onClick={handleDownloadJSON}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-heading font-bold hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-all"
                >
                  <FileCode className="w-4 h-4 text-purple-400" />
                  <span>SAVE CONFIG (.JSON)</span>
                </button>

                <button
                  onClick={handleCopyJSON}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-heading font-bold hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-all"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-amber-400" />
                  )}
                  <span>{copied ? "COPIED JSON!" : "COPY JSON DATA"}</span>
                </button>
              </div>

              {/* Place Order CTA */}
              <button
                onClick={handlePlaceOrder}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-black font-heading font-bold text-xs tracking-wider uppercase hover:brightness-110 shadow-[0_0_25px_rgba(0,255,102,0.4)] flex items-center justify-center gap-2 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>SEND BUILD TO FABRICATION LAB & SHOP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            /* Order Confirmed View */
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,255,102,0.6)] animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading text-white tracking-wider">
                  BUILD ORDER REGISTERED!
                </h3>
                <p className="text-xs text-slate-400 font-mono-code mt-1">
                  SERIALIZED BUILD CODE:{" "}
                  <span className="text-cyan-400 font-bold">{buildSerial}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 max-w-md mx-auto text-left text-xs space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span>Product Model:</span>
                  <span className="font-bold text-white">{currentModel.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-mono-code uppercase text-cyan-400">
                    {currentModel.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Fabrication Status:</span>
                  <span className="text-emerald-400 font-mono-code font-bold">
                    SPEC SHEET TRANSMITTED
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Order Value:</span>
                  <span className="font-bold text-white font-heading">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSpecModalOpen(false);
                  setOrderConfirmed(false);
                }}
                className="px-8 py-3 rounded-xl bg-cyan-500 text-black font-heading font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all"
              >
                RETURN TO 3D STUDIO
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
