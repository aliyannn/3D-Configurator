"use client";

import React, { useState, useRef, useCallback } from "react";
import { useStudioStore } from "@/store/useStudioStore";
import { Upload, X, FileBox, CheckCircle2, AlertCircle, Link2, Sparkles } from "lucide-react";
import { cyberAudio } from "@/lib/audio";

const SAMPLE_MODELS = [
  {
    name: "Ferrari 458 Italia",
    url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/ferrari.glb",
    desc: "Official Three.js sports car with paint, wheels & glass meshes",
  },
  {
    name: "Cyber Sneaker Pro",
    url: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/MaterialsVariantsShoe/glTF/MaterialsVariantsShoe.gltf",
    desc: "Multi-material athletic sneaker asset",
  },
  {
    name: "Damaged Helmet (PBR Benchmark)",
    url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
    desc: "Khronos standard PBR roughness/metalness test model",
  },
];

export function FileUploader() {
  const glbUploadModalOpen = useStudioStore((state) => state.glbUploadModalOpen);
  const setGlbUploadModalOpen = useStudioStore((state) => state.setGlbUploadModalOpen);
  const setCustomGlb = useStudioStore((state) => state.setCustomGlb);
  const customGlb = useStudioStore((state) => state.customGlb);
  const soundEnabled = useStudioStore((state) => state.soundEnabled);

  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevBlobUrlRef = useRef<string | null>(null);

  // Memory management: Revoke previous blob URL when creating a new one
  const cleanupPrevUrl = useCallback(() => {
    if (prevBlobUrlRef.current && prevBlobUrlRef.current.startsWith("blob:")) {
      URL.revokeObjectURL(prevBlobUrlRef.current);
      prevBlobUrlRef.current = null;
    }
  }, []);

  const handleFile = (file: File) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate file extension
    if (!file.name.match(/\.(glb|gltf)$/i)) {
      setErrorMsg("Please upload a valid .glb or .gltf 3D file");
      if (soundEnabled) cyberAudio.playTick();
      return;
    }

    try {
      // Revoke previous blob URL
      cleanupPrevUrl();

      // Create new blob object URL
      const blobUrl = URL.createObjectURL(file);
      prevBlobUrlRef.current = blobUrl;

      const cleanName = file.name.replace(/\.[^/.]+$/, "");

      setCustomGlb({
        name: cleanName,
        url: blobUrl,
        detectedParts: [],
      });

      setSuccessMsg(`Successfully loaded: ${cleanName}`);
      if (soundEnabled) cyberAudio.playSelect();

      setTimeout(() => {
        setGlbUploadModalOpen(false);
      }, 700);
    } catch (err: any) {
      setErrorMsg(`Failed to load file: ${err.message || "Unknown error"}`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    cleanupPrevUrl();

    const cleanName = urlInput.split("/").pop()?.replace(/\.[^/.]+$/, "") || "Custom Web Model";

    setCustomGlb({
      name: cleanName,
      url: urlInput.trim(),
      detectedParts: [],
    });

    setSuccessMsg(`Loaded URL: ${cleanName}`);
    if (soundEnabled) cyberAudio.playSelect();

    setTimeout(() => {
      setGlbUploadModalOpen(false);
    }, 700);
  };

  const loadSample = (sample: typeof SAMPLE_MODELS[0]) => {
    cleanupPrevUrl();
    setCustomGlb({
      name: sample.name,
      url: sample.url,
      detectedParts: [],
    });
    setSuccessMsg(`Loaded sample: ${sample.name}`);
    if (soundEnabled) cyberAudio.playSelect();

    setTimeout(() => {
      setGlbUploadModalOpen(false);
    }, 700);
  };

  if (!glbUploadModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-[0_25px_70px_rgba(15,23,42,0.3)] overflow-hidden flex flex-col text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Universal 3D Model Ingestion
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Supports any .GLB / .GLTF from Sketchfab, Blender, or CAD
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (soundEnabled) cyberAudio.playTick();
              setGlbUploadModalOpen(false);
            }}
            className="p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Status feedback */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? "border-purple-600 bg-purple-50/70 scale-[1.01]"
                : "border-slate-300 hover:border-purple-500 hover:bg-slate-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".glb,.gltf"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3 shadow-inner">
              <FileBox className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Drag & drop your .GLB or .GLTF file here
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              or <span className="text-purple-600 font-semibold underline">browse from your computer</span>
            </p>
            <span className="text-[10px] font-mono text-slate-400 mt-2">
              Auto-scales & centers coordinates automatically
            </span>
          </div>

          {/* 2. Direct Web URL Ingestion */}
          <form onSubmit={handleUrlSubmit} className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Or load from Web URL</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/model.glb"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={!urlInput.trim()}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                Load
              </button>
            </div>
          </form>

          {/* 3. One-Click Sample Models for Instant Testing */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant Test Samples</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_MODELS.map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => loadSample(sample)}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50/50 hover:border-purple-300 text-left transition-all"
                >
                  <p className="text-xs font-bold text-slate-800 truncate">{sample.name}</p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{sample.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileUploader;
