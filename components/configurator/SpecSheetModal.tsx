"use client";

import React, { useState } from "react";
import { useStudioStore } from "@/store/useStudioStore";
import { STUDIO_MATERIALS } from "@/data/modelsCatalog";
import { X, Download, Printer, Wrench, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cyberAudio } from "@/lib/audio";

export function SpecSheetModal() {
  const specModalOpen = useStudioStore((state) => state.specModalOpen);
  const setSpecModalOpen = useStudioStore((state) => state.setSpecModalOpen);
  const currentModel = useStudioStore((state) => state.getCurrentModel());
  const configurations = useStudioStore((state) => state.configurations);
  const buildSerial = useStudioStore((state) => state.buildSerial);
  const capturedImage = useStudioStore((state) => state.capturedImage);
  const soundEnabled = useStudioStore((state) => state.soundEnabled);
  const calculateTotalPrice = useStudioStore((state) => state.calculateTotalPrice);
  const headlightStyle = useStudioStore((state) => state.headlightStyle);

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!specModalOpen) return null;

  const modelConfig = configurations[currentModel.id] || {};
  const totalPrice = calculateTotalPrice();

  // Trigger Print to PDF
  const handlePrint = () => {
    if (soundEnabled) cyberAudio.playSelect();
    window.print();
  };

  // Download Workshop Modification Sheet
  const handleDownloadSpec = () => {
    if (soundEnabled) cyberAudio.playSnap();

    let text = `================================================================================\n`;
    text += `          HONDA WORKSHOP SPECIFICATION & MODIFICATION BUILD-SHEET               \n`;
    text += `                       ALIYAN 3D AUTOMOTIVE STUDIO                             \n`;
    text += `================================================================================\n`;
    text += `VEHICLE: ${currentModel.title.toUpperCase()}\n`;
    text += `ENGINE SPEC: 124cc 4-Stroke OHV Single-Cylinder Pushrod\n`;
    text += `BUILD REFERENCE ID: #${buildSerial}\n`;
    text += `DATE: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n`;
    text += `STUDIO WATERMARK: Built via Aliyan 3D Studio\n`;
    text += `ESTIMATED BASE VALUATION: ${formatCurrency(totalPrice)}\n\n`;
    text += `--------------------------------------------------------------------------------\n`;
    text += `EXACT WORKSHOP MODIFICATION INSTRUCTIONS FOR MECHANIC / PAINTER\n`;
    text += `--------------------------------------------------------------------------------\n\n`;

    currentModel.parts.forEach((part, i) => {
      const pConfig = modelConfig[part.id] || {
        color: part.defaultColor,
        material: part.defaultMaterial,
      };
      const mat = STUDIO_MATERIALS[pConfig.material] || STUDIO_MATERIALS.gloss;

      text += `[${i + 1}] PART: ${part.name.toUpperCase()} (${part.icon || ""})\n`;
      text += `    • Specified Color Code: ${pConfig.color.toUpperCase()}\n`;
      text += `    • Surface Coating Finish: ${mat.name}\n`;
      text += `    • Technical Description: ${part.description}\n`;
      if (part.id === "headlight") {
        text += `    • Lamp Housing Architecture: ${
          headlightStyle === "rectangular"
            ? "OEM Rectangular with Fluted Glass & Amber Signals"
            : "Custom 7-Inch Round Cafe Racer Yellow Lens"
        }\n`;
      }
      text += `    • Coating Properties: Roughness ${mat.roughness}, Metalness ${mat.metalness}, Clearcoat ${mat.clearcoat}\n\n`;
    });

    text += `================================================================================\n`;
    text += `Present this specification sheet directly to your motorcycle mechanic, paint shop,\n`;
    text += `or custom tuning workshop. Verified via Aliyan 3D Studio.\n`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentModel.id}_${buildSerial}_Workshop_Spec.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-[0_25px_70px_rgba(30,41,59,0.25)] overflow-hidden flex flex-col text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                  HONDA GENUINE & CUSTOM SPEC
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Workshop Build & Modification Sheet
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              if (soundEnabled) cyberAudio.playTick();
              setSpecModalOpen(false);
            }}
            className="p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Snapshot with Clean Studio Watermark */}
          {capturedImage && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 p-2 flex items-center justify-center shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={capturedImage}
                alt="Honda CG 125 Build Angle"
                className="max-h-52 object-contain rounded-xl"
              />
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono tracking-wider shadow-md">
                Built via Aliyan 3D Studio
              </div>
            </div>
          )}

          {/* Reference & Model Banner */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase">Vehicle Spec</p>
              <h3 className="text-sm font-bold text-slate-900">{currentModel.title}</h3>
              <p className="text-xs text-slate-500 font-mono">124cc 4-Stroke OHV Pushrod Engine</p>
            </div>
            <div className="text-right font-mono">
              <span className="text-[11px] text-slate-400 block uppercase">Reference Code</span>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                #{buildSerial}
              </span>
            </div>
          </div>

          {/* Exact Modification Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Exact Modification Checklist for Shop
              </h3>
              <span className="text-xs font-semibold text-emerald-600 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Spec</span>
              </span>
            </div>

            <div className="divide-y divide-slate-100 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden">
              {currentModel.parts.map((part) => {
                const pConfig = modelConfig[part.id] || {
                  color: part.defaultColor,
                  material: part.defaultMaterial,
                };
                const mat = STUDIO_MATERIALS[pConfig.material] || STUDIO_MATERIALS.gloss;

                return (
                  <div
                    key={part.id}
                    className="flex items-center justify-between p-3.5 text-xs hover:bg-slate-100/70 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm shrink-0"
                        style={{ backgroundColor: pConfig.color }}
                      />
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <span>{part.icon}</span>
                          <span>{part.name}</span>
                          {part.id === "headlight" && (
                            <span className="text-[10px] text-red-600 font-mono bg-red-50 px-1.5 py-0.2 rounded border border-red-200">
                              {headlightStyle === "rectangular" ? "OEM Rectangular" : "Round Cafe"}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {mat.name} •{" "}
                          <span className="text-slate-800 font-bold uppercase">
                            Hex: {pConfig.color}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-[11px] font-mono text-slate-500 max-w-[220px]">
                      {part.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Suite: Print & Download */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto flex-1 py-3 px-5 rounded-full text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Printer className="w-4 h-4 text-slate-700" />
              <span>Print Specification Invoice</span>
            </button>

            <button
              onClick={handleDownloadSpec}
              className="w-full sm:w-auto flex-1 py-3 px-5 rounded-full text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-white" />
              <span>{downloadSuccess ? "Downloaded Spec Sheet!" : "Download PDF / Spec (.TXT)"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
