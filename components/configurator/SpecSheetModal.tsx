"use client";

import React, { useState } from "react";
import { useStudioStore } from "@/store/useStudioStore";
import { STUDIO_MATERIALS } from "@/data/modelsCatalog";
import { X, Download, Printer, CheckCircle2, ShieldCheck, Wrench } from "lucide-react";
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

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!specModalOpen) return null;

  const modelConfig = configurations[currentModel.id] || {};
  const totalPrice = calculateTotalPrice();

  // Print Mechanic Invoice
  const handlePrint = () => {
    if (soundEnabled) cyberAudio.playSelect();
    window.print();
  };

  // Download Mechanic Specification Document
  const handleDownloadSpec = () => {
    if (soundEnabled) cyberAudio.playSnap();

    let text = `=================================================================\n`;
    text += `    ALIYAN 3D STUDIO • MECHANIC & BUILDER MODIFICATION SHEET    \n`;
    text += `=================================================================\n`;
    text += `VEHICLE BRAND: ${currentModel.brand}\n`;
    text += `VEHICLE MODEL: ${currentModel.title}\n`;
    text += `SPECIFICATION CODE: ${buildSerial}\n`;
    text += `GENERATED: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
    text += `STUDIO WATERMARK: Built via Aliyan 3D Studio\n`;
    text += `ESTIMATED BUILD VALUATION: ${formatCurrency(totalPrice)}\n\n`;
    text += `--- EXACT MODIFICATION CHECKLIST FOR SHOP / MECHANIC ---\n\n`;

    currentModel.parts.forEach((part, i) => {
      const pConfig = modelConfig[part.id] || {
        color: part.defaultColor,
        material: part.defaultMaterial,
      };
      const mat = STUDIO_MATERIALS[pConfig.material] || STUDIO_MATERIALS.gloss;

      text += `[${i + 1}] ${part.name.toUpperCase()} (${part.icon})\n`;
      text += `    • Color Specification: ${pConfig.color}\n`;
      text += `    • Surface Finish: ${mat.name}\n`;
      text += `    • Part Notes: ${part.description}\n`;
      text += `    • Material Parameters: Roughness ${mat.roughness}, Metalness ${mat.metalness}\n\n`;
    });

    text += `=================================================================\n`;
    text += `Take this specification sheet directly to your mechanic, tuner, or paint shop.\n`;
    text += `Verified by Aliyan 3D Automotive Customizer Studio\n`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentModel.id}_${buildSerial}_MechanicSpec.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white border border-slate-200 rounded-3xl shadow-[0_25px_70px_rgba(30,41,59,0.25)] overflow-hidden flex flex-col text-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <Wrench className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Mechanic & Builder Spec Sheet
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                {currentModel.title} • Reference #{buildSerial}
              </p>
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

        {/* Printable Card Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Snapshot Preview with Studio Watermark */}
          {capturedImage && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 p-2 flex items-center justify-center shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={capturedImage}
                alt="Vehicle Build Render"
                className="max-h-48 object-contain rounded-xl"
              />
              {/* Clean Studio Watermark */}
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono tracking-wider shadow-md">
                Built via Aliyan 3D Studio
              </div>
            </div>
          )}

          {/* Exact Modification Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Exact Modification Checklist
              </h3>
              <span className="text-xs font-semibold text-emerald-600 font-mono">
                Shop Verified Spec
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
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {mat.name} •{" "}
                          <span className="text-slate-700 font-bold uppercase">
                            Hex: {pConfig.color}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-[11px] font-mono text-slate-500">
                      {part.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Valuation Card */}
          <div className="flex items-baseline justify-between p-4 rounded-2xl bg-slate-100 border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 block uppercase font-medium">
                Estimated Build Valuation
              </span>
              <span className="text-xl font-bold font-mono text-slate-900">
                {formatCurrency(totalPrice)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 font-mono">
                Watermark: Built via Aliyan 3D Studio
              </span>
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
              className="w-full sm:w-auto flex-1 py-3 px-5 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
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
