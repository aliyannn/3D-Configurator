"use client";

import React, { useState } from "react";
import {
  useConfiguratorStore,
  PartKey,
  MATERIAL_PRESETS,
  BASE_PRICE,
} from "@/store/useConfiguratorStore";
import {
  X,
  Download,
  CheckCircle2,
  Package,
  CreditCard,
  Truck,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  FileCheck,
} from "lucide-react";
import confetti from "canvas-confetti";
import { formatCurrency } from "@/lib/utils";
import { cyberAudio } from "@/lib/audio";

export function SpecSheetModal() {
  const specSheetOpen = useConfiguratorStore((state) => state.specSheetOpen);
  const setSpecSheetOpen = useConfiguratorStore((state) => state.setSpecSheetOpen);
  const parts = useConfiguratorStore((state) => state.parts);
  const capturedImage = useConfiguratorStore((state) => state.capturedImage);
  const configSerialNumber = useConfiguratorStore((state) => state.configSerialNumber);
  const soundEnabled = useConfiguratorStore((state) => state.soundEnabled);
  const getTotalPrice = useConfiguratorStore((state) => state.getTotalPrice);

  const [checkoutStep, setCheckoutStep] = useState<"spec" | "shipping" | "confirmed">("spec");
  const [shoeSize, setShoeSize] = useState("US M 10.5 / W 12");
  const [customerName, setCustomerName] = useState("Alex Vance");
  const [customerEmail, setCustomerEmail] = useState("cyber.operative@apex.net");
  const [customerAddress, setCustomerAddress] = useState("Sector 4, Neon Plaza, Cyber City");

  if (!specSheetOpen) return null;

  const totalPrice = getTotalPrice();
  const surchargesTotal = totalPrice - BASE_PRICE;

  const handleDownloadSpec = () => {
    if (soundEnabled) cyberAudio.playSnap();
    
    // Construct text spec sheet download
    let content = `========================================\n`;
    content += `   CYBERSNEAKER PRO X - BUILD SPEC SHEET\n`;
    content += `========================================\n`;
    content += `SERIAL NUMBER: ${configSerialNumber}\n`;
    content += `TIMESTAMP: ${new Date().toISOString()}\n`;
    content += `BASE PRICE: ${formatCurrency(BASE_PRICE)}\n`;
    content += `SURCHARGES: ${formatCurrency(surchargesTotal)}\n`;
    content += `TOTAL VALUATION: ${formatCurrency(totalPrice)}\n\n`;
    content += `--- BILL OF MATERIALS (BOM) ---\n`;

    (Object.keys(parts) as PartKey[]).forEach((key) => {
      const p = parts[key];
      const mat = MATERIAL_PRESETS[p.materialType];
      content += `[${p.label.toUpperCase()}]\n`;
      content += `  - Finish: ${mat.name} (Surcharge: ${formatCurrency(mat.surcharge)})\n`;
      content += `  - Color Hex: ${p.color}\n`;
      content += `  - Spec Notes: Roughness: ${mat.roughness}, Metalness: ${mat.metalness}\n\n`;
    });

    content += `========================================\n`;
    content += `Apex Advanced Footwear Fabrication Labs\n`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CyberSneaker_${configSerialNumber}_Spec.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep("confirmed");
    if (soundEnabled) cyberAudio.playSuccess();

    // Trigger celebratory confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#00F0FF", "#FF0055", "#FFE600", "#00FF66", "#FFFFFF"],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300 select-none">
      <div className="relative w-full max-w-3xl max-h-[90vh] cyber-glass rounded-3xl border border-cyan-500/40 shadow-[0_0_50px_rgba(0,240,255,0.3)] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-cyan-500/20 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <FileCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base md:text-xl font-bold font-heading text-white tracking-wider flex items-center gap-2">
                CUSTOM SPECIFICATION & ORDER
              </h2>
              <p className="text-xs font-mono-code text-cyan-400">
                SERIAL BUILD ID: {configSerialNumber}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (soundEnabled) cyberAudio.playTick();
              setSpecSheetOpen(false);
              setCheckoutStep("spec");
            }}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {checkoutStep === "spec" && (
            <>
              {/* Snapshot Preview Bar if available */}
              {capturedImage && (
                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-950/80 p-2 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={capturedImage}
                    alt="CyberSneaker Pro X Snapshot"
                    className="max-h-48 object-contain rounded-xl"
                  />
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-slate-900/90 border border-cyan-500/50 text-[10px] font-mono-code text-cyan-300">
                    LIVE CANVAS SNAPSHOT
                  </div>
                </div>
              )}

              {/* Bill of Materials Table */}
              <div>
                <h3 className="text-xs font-heading uppercase tracking-widest text-slate-400 mb-3 flex items-center justify-between">
                  <span>BILL OF MATERIALS & SHADER SPECS</span>
                  <span className="text-cyan-400 font-mono-code">7 CUSTOM ZONES</span>
                </h3>
                <div className="divide-y divide-slate-800/80 rounded-2xl bg-slate-950/60 border border-slate-800 overflow-hidden">
                  {(Object.keys(parts) as PartKey[]).map((key) => {
                    const part = parts[key];
                    const mat = MATERIAL_PRESETS[part.materialType];
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 text-xs hover:bg-slate-900/40 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 rounded-lg border border-white/30 shrink-0 shadow-sm"
                            style={{ backgroundColor: part.color }}
                          />
                          <div>
                            <p className="font-bold text-white font-heading">{part.label}</p>
                            <p className="text-[11px] text-slate-400 font-mono-code">
                              {mat.name} • <span className="text-cyan-300 uppercase">{part.color}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono-code font-bold text-slate-200">
                            {mat.surcharge > 0 ? `+${formatCurrency(mat.surcharge)}` : "$0.00"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Summary Breakdown */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/30 space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>CyberSneaker Base Platform</span>
                  <span className="font-mono-code font-medium">{formatCurrency(BASE_PRICE)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>PBR Material Finishes & Surcharges</span>
                  <span className="font-mono-code font-medium">+{formatCurrency(surchargesTotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Custom Fabrication & Holographic Boxing</span>
                  <span className="text-emerald-400 font-mono-code font-bold">COMPLIMENTARY</span>
                </div>
                <div className="border-t border-cyan-500/30 pt-2 flex justify-between items-baseline">
                  <span className="text-sm font-heading font-bold text-white">TOTAL VALUATION</span>
                  <span className="text-2xl font-black font-heading text-cyan-400">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handleDownloadSpec}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs font-heading font-bold hover:bg-slate-800 flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>EXPORT SPEC SHEET (.TXT)</span>
                </button>
                <button
                  onClick={() => {
                    if (soundEnabled) cyberAudio.playSelect();
                    setCheckoutStep("shipping");
                  }}
                  className="w-full flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-heading font-bold text-xs tracking-wider uppercase hover:brightness-110 shadow-[0_0_20px_rgba(0,240,255,0.5)] flex items-center justify-center gap-2 transition-all"
                >
                  <span>PROCEED TO SIZING & CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {checkoutStep === "shipping" && (
            <form onSubmit={handleConfirmOrder} className="space-y-4">
              <h3 className="text-sm font-heading font-bold text-cyan-300 tracking-wider">
                CUSTOM SIZING & DISPATCH DESTINATION
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Size Selector */}
                <div>
                  <label className="text-xs text-slate-400 font-heading uppercase block mb-1.5">
                    Select Fit Size
                  </label>
                  <select
                    value={shoeSize}
                    onChange={(e) => setShoeSize(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono-code text-white outline-none focus:border-cyan-400"
                  >
                    {[
                      "US M 7.0 / W 8.5",
                      "US M 8.0 / W 9.5",
                      "US M 9.0 / W 10.5",
                      "US M 10.0 / W 11.5",
                      "US M 10.5 / W 12.0",
                      "US M 11.0 / W 12.5",
                      "US M 12.0 / W 13.5",
                      "US M 13.0 / W 14.5",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Recipient Name */}
                <div>
                  <label className="text-xs text-slate-400 font-heading uppercase block mb-1.5">
                    Operative Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs text-slate-400 font-heading uppercase block mb-1.5">
                    Encrypted Comms Email
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Dispatch Address */}
                <div>
                  <label className="text-xs text-slate-400 font-heading uppercase block mb-1.5">
                    Delivery Coordinates / Address
                  </label>
                  <input
                    type="text"
                    required
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Payment Mock Card */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-xs font-bold text-white font-heading">
                      CyberPay Zero-Latency Checkout
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono-code">
                      Quantum Secured • 256-Bit Mesh Token
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold font-heading text-cyan-400">
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCheckoutStep("spec")}
                  className="px-5 py-3 rounded-xl bg-slate-900 text-slate-300 text-xs font-heading hover:bg-slate-800 transition-all border border-slate-800"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-heading font-bold text-xs tracking-wider uppercase hover:brightness-110 shadow-[0_0_25px_rgba(0,255,102,0.5)] flex items-center justify-center gap-2 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>AUTHORIZE BUILD & PLACE ORDER</span>
                </button>
              </div>
            </form>
          )}

          {checkoutStep === "confirmed" && (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,255,102,0.6)] animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading text-white tracking-wider">
                  ORDER TRANSMISSION AUTHORIZED!
                </h3>
                <p className="text-xs text-slate-400 font-mono-code mt-1">
                  BUILD ORDER TICKET: <span className="text-cyan-400 font-bold">{configSerialNumber}</span>
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 max-w-md mx-auto text-left text-xs space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span>Fit Size:</span>
                  <span className="font-bold text-white">{shoeSize}</span>
                </div>
                <div className="flex justify-between">
                  <span>Recipient:</span>
                  <span className="font-bold text-white">{customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fabrication Status:</span>
                  <span className="text-cyan-400 font-mono-code font-bold">QUEUED IN 3D PRINT LAB</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Dispatch:</span>
                  <span className="text-slate-200">4-6 Business Days</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSpecSheetOpen(false);
                  setCheckoutStep("spec");
                }}
                className="px-8 py-3 rounded-xl bg-cyan-500 text-black font-heading font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all"
              >
                RETURN TO CONFIGURATOR
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
