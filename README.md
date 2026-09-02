# 🌐 Universal 3D Product Customizer Studio

A production-grade, ultra-responsive **Universal 3D Product Customizer Studio** inspired by Sketchfab's multi-model configurators. Built with **Next.js 14+ (App Router)**, **React Three Fiber (R3F)**, **@react-three/drei**, **Three.js**, **Zustand**, **Tailwind CSS**, and **Lucide Icons**.

![Universal 3D Studio](https://img.shields.io/badge/Status-Production%20Ready-00F0FF?style=for-the-badge)
![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![React Three Fiber](https://img.shields.io/badge/R3F-Three.js-blue?style=for-the-badge&logo=three.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## ⚡ Multi-Model Catalog & Features

### 1. 🗂️ Built-in Multi-Category 3D Models
- 🚗 **Vehicles — Apex GT-X Hypercar**:
  - Zones: `Exterior Body`, `Forged Aero Rims`, `Cockpit Glass`, `Brake Calipers`, `Aero Splitters & Wing`.
- 🏍️ **Two-Wheelers — Valkyrie R9 Cafe Racer**:
  - Zones: `Fuel Tank & Cowl`, `Stitched Leather Saddle`, `Trellis Chassis Frame`, `Titanium Exhaust`, `Spoked Wheels`.
- 🛋️ **Furniture — Nordic Haven 3-Seater Sofa**:
  - Zones: `Main Upholstery Fabric`, `Accent Bolster Cushions`, `Tapered Support Legs`, `Perimeter Base Trim`.
- 👟 **Footwear — CyberSneaker Pro X**:
  - Zones: `Aeromesh Upper`, `Outsole & Tread`, `Kinetic Air Pods`, `Laces & Fasteners`, `Aero Fins`.
- 🎧 **Tech Gear — Aura Pro Studio Wireless Headphones**:
  - Zones: `Acoustic Earcups`, `Structural Headband`, `Memory Foam Cushions`, `Gimbal Ring & Badges`.
- 📂 **Custom .GLB / .GLTF Drag & Drop & Direct URL**:
  - Direct file drop onto the 3D canvas or paste any remote `.glb` URL.
  - Automatic scene graph traversal (`scene.traverse`) with smart mesh node detection and dynamic PBR binding.

---

### 2. 🎨 Sketchfab-Grade Minimalist UI & Navigation
- **Top Navigation Bar**:
  - Category Switcher Pill Carousel: `[ 🚗 Vehicles ] [ 🏍️ Bikes ] [ 🛋️ Furniture ] [ 👟 Footwear ] [ 🎧 Tech ] [ 📂 Upload .GLB ]`.
  - Studio Lighting Rig: `Studio Neutral`, `Cyber Neon`, `Golden Hour Daylight`, `Deep Obsidian`.
  - Wireframe toggle, Cyber audio feedback toggle, and reset button.
- **Bottom Customization Dock**:
  - Dynamic Part Selector specific to the active model with live color indicator dots.
  - PBR Material Finish selector:
    * `Matte Finish` (Roughness: 0.85, Metalness: 0.05)
    * `Metallic / Anodized` (Roughness: 0.22, Metalness: 0.90, Clearcoat: 0.5)
    * `High Gloss / Clearcoat` (Roughness: 0.08, Metalness: 0.15, Clearcoat: 1.0)
    * `Leather / Textured Fabric` (Roughness: 0.95, Metalness: 0.02)
    * `Forged Carbon Weave` (Roughness: 0.35, Metalness: 0.60, Clearcoat: 0.7)
  - Color Swatches: 10 curated tones + custom Hex Color Picker.
  - Camera Quick Presets: `Front 3/4`, `Side View`, `Top Down`, `Detail Zoom`, and `Auto Orbit`.

---

### 3. 💾 "Save My Build" & Export System
- 📸 **4K Snapshot Render**: Captures high-res transparent or studio-background PNG of the customized item.
- 📋 **Build Spec Sheet & Buy Guide Modal**:
  - Itemized Bill of Materials (BOM) with finishes, hex codes, and individual surcharges.
  - Serialized Build ID (`APX-XXXX-XXXX`).
  - **Export Technical Spec (.TXT)**: Formatted engineering specification sheet download.
  - **Save Configuration (.JSON)**: Serialized build state for persistence or sharing.
  - **Copy JSON Config**: Instant clipboard copy.
  - **Send to Fabrication Lab**: Simulated order placement with celebratory confetti fireworks.

---

## 📁 Source Architecture

```
CyberSneaker_Configurator/
├── app/
│   ├── layout.tsx                # Studio layout with viewport & font tokens
│   ├── page.tsx                  # Root entry rendering StudioPage
│   ├── studio/
│   │   └── page.tsx              # Universal 3D Product Customizer Studio
│   └── configurator/
│       └── page.tsx              # CyberSneaker dedicated configurator
├── components/
│   └── studio/
│       ├── StudioCanvas.tsx      # R3F Canvas, CameraController, Lighting, & Drag-Drop GLB
│       ├── SceneModelManager.tsx # Dynamic model switcher
│       ├── TopCategoryNav.tsx    # Category pills, environments, & quick actions
│       ├── CustomizerDock.tsx    # Sketchfab-style bottom customizer dock
│       ├── BuildSpecModal.tsx    # BOM table, spec download, JSON export, checkout
│       ├── GlbUploadModal.tsx    # Custom GLB URL loader & sample models
│       └── models/
│           ├── ProceduralCar.tsx         # Apex GT-X hypercar
│           ├── ProceduralBike.tsx        # Valkyrie R9 motorcycle
│           ├── ProceduralSofa.tsx        # Nordic Haven Scandinavian sofa
│           ├── ProceduralSneaker.tsx     # CyberSneaker kinetic footwear
│           ├── ProceduralHeadphones.tsx  # Aura Pro studio headphones
│           ├── DynamicGlbViewer.tsx      # Universal GLB mesh traversal & material binder
│           └── StudioMeshMaterial.tsx    # Reactive PBR physical material
├── data/
│   └── modelsCatalog.ts          # Catalog definitions, materials, & color swatches
├── store/
│   ├── useStudioStore.ts         # Universal Studio Zustand state engine
│   └── useConfiguratorStore.ts   # Sneaker dedicated store
├── lib/
│   ├── audio.ts                  # Web Audio procedural sound effects
│   └── utils.ts                  # Currency & class utilities
└── package.json
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to launch the studio.
