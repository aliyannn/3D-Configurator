"use client";

import React, { useState } from "react";
import { useStudioStore } from "@/store/useStudioStore";
import { PartDefinition } from "@/data/modelsCatalog";
import {
  X,
  UploadCloud,
  Link2,
  CheckCircle2,
  FileCode,
  Loader2,
  Sparkles,
} from "lucide-react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { cyberAudio } from "@/lib/audio";

const SAMPLE_GLB_MODELS = [
  {
    name: "Sci-Fi Battle Helmet",
    url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
    category: "Tech Gear",
  },
  {
    name: "Classic Duck Model",
    url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb",
    category: "Sculpture",
  },
  {
    name: "Avocado Organic Prop",
    url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb",
    category: "Organic",
  },
];

export function GlbUploadModal() {
  const glbUploadModalOpen = useStudioStore((state) => state.glbUploadModalOpen);
  const setGlbUploadModalOpen = useStudioStore((state) => state.setGlbUploadModalOpen);
  const setCustomGlb = useStudioStore((state) => state.setCustomGlb);
  const soundEnabled = useStudioStore((state) => state.soundEnabled);

  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!glbUploadModalOpen) return null;

  const processAndLoadGlb = (url: string, name: string) => {
    setLoading(true);
    setErrorMsg("");

    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        const detectedParts: PartDefinition[] = [];
        let index = 1;

        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const partName = mesh.name || `Node_${index++}`;
            detectedParts.push({
              id: mesh.name || `node_${index}`,
              name: partName,
              description: `Custom mesh node: ${partName}`,
              defaultColor: "#00F0FF",
              defaultMaterial: "gloss" as const,
            });
          }
        });

        const finalParts: PartDefinition[] =
          detectedParts.length > 0
            ? detectedParts
            : [
                {
                  id: "root_mesh",
                  name: "Primary Mesh",
                  description: "Model root geometry",
                  defaultColor: "#00F0FF",
                  defaultMaterial: "gloss" as const,
                },
              ];

        setCustomGlb({
          url,
          name,
          detectedParts: finalParts,
        });

        setLoading(false);
        if (soundEnabled) cyberAudio.playSuccess();
      },
      undefined,
      (err) => {
        console.error("Failed to load GLB:", err);
        setErrorMsg("Failed to parse GLB model. Please verify the URL or file.");
        setLoading(false);
      }
    );
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    const modelName = inputUrl.split("/").pop()?.replace(/\.[^/.]+$/, "") || "Custom Model";
    processAndLoadGlb(inputUrl.trim(), modelName);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const modelName = file.name.replace(/\.[^/.]+$/, "");
    processAndLoadGlb(url, modelName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300 select-none">
      <div className="relative w-full max-w-lg cyber-glass rounded-3xl border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-purple-500/20 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <UploadCloud className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-bold font-heading text-white tracking-wide">
                LOAD CUSTOM .GLB MODEL
              </h2>
              <p className="text-xs font-mono-code text-purple-300">
                Universal Dynamic Scene Graph Traversal
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (soundEnabled) cyberAudio.playTick();
              setGlbUploadModalOpen(false);
            }}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-mono-code">
              {errorMsg}
            </div>
          )}

          {/* Option 1: File Dropzone */}
          <div>
            <label className="text-[10px] font-heading uppercase text-slate-400 tracking-wider block mb-2">
              UPLOAD LOCAL 3D FILE (.GLB / .GLTF)
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-purple-500/40 bg-purple-950/10 hover:bg-purple-950/20 hover:border-purple-400 transition-all cursor-pointer">
              <UploadCloud className="w-8 h-8 text-purple-400 mb-2" />
              <span className="text-xs font-heading font-medium text-slate-200">
                Click to browse or drag & drop file
              </span>
              <span className="text-[10px] font-mono-code text-slate-500 mt-0.5">
                Supported formats: Binary .glb or .gltf
              </span>
              <input
                type="file"
                accept=".glb,.gltf"
                onChange={handleFileUpload}
                disabled={loading}
                className="hidden"
              />
            </label>
          </div>

          {/* Option 2: Direct URL */}
          <form onSubmit={handleUrlSubmit} className="space-y-2">
            <label className="text-[10px] font-heading uppercase text-slate-400 tracking-wider block">
              OR ENTER DIRECT .GLB URL
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="https://example.com/asset.glb"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  disabled={loading}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !inputUrl.trim()}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-heading font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center gap-1.5"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Load URL"}
              </button>
            </div>
          </form>

          {/* Option 3: Quick Sample Models */}
          <div className="pt-2 border-t border-slate-800">
            <label className="text-[10px] font-heading uppercase text-slate-400 tracking-wider block mb-2">
              TEST WITH OPEN-SOURCE GLTF SAMPLES
            </label>
            <div className="space-y-1.5">
              {SAMPLE_GLB_MODELS.map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => processAndLoadGlb(sample.url, sample.name)}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900 text-left transition-all text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span className="font-semibold text-slate-200">{sample.name}</span>
                  </div>
                  <span className="text-[10px] font-mono-code text-purple-300 px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40">
                    {sample.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
