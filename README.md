# 👟 CyberSneaker Pro X — 3D Custom Configurator

A production-grade, ultra-responsive **3D Custom Footwear Configurator** web application built with **Next.js 14+ (App Router)**, **React Three Fiber (R3F)**, **@react-three/drei**, **Three.js**, **Zustand**, **Tailwind CSS**, and **Lucide Icons**.

![CyberSneaker Pro X](https://img.shields.io/badge/Status-Production%20Ready-00F0FF?style=for-the-badge)
![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![React Three Fiber](https://img.shields.io/badge/R3F-Three.js-blue?style=for-the-badge&logo=three.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## ⚡ Features & Capabilities

- 🕶️ **3D WebGL Viewport (R3F & Drei)**:
  - Custom procedural aerodynamic sneaker geometry with 7 modular mesh zones (`Sole & Tread`, `Kinetic Air Pods`, `Upper Aeromesh`, `Ankle Collar & Liner`, `Kinetic Laces`, `Aero Fin Accents`, `Rear Exhaust Heat-Sink`).
  - Physically Based Rendering (PBR) dynamic materials:
    - *Matte Cyber-Leather* (Roughness: 0.82, Metalness: 0.08)
    - *Anodized Titanium* (Roughness: 0.22, Metalness: 0.88, Clearcoat: 0.4)
    - *Forged Carbon Fiber* (Roughness: 0.32, Metalness: 0.65, Clearcoat: 0.7)
    - *High-Gloss Patent Polymer* (Roughness: 0.06, Metalness: 0.15, Clearcoat: 1.0)
    - *Overclocked Neon Glow* (Emissive Intensity: 2.4)
- 💥 **Exploded Layer Breakdown**:
  - Smooth animation lerping all shoe layers outward in 3D along their respective axes.
- 🎯 **Interactive 3D Hotspots**:
  - Floating 3D HTML hotspot pins positioned on the sneaker that highlight and switch the active configuration zone on hover/click.
- 💡 **Dynamic Studio Lighting Rigs**:
  - Preset studio environments: *Cyber Neon Grid*, *Studio Clean White*, *Deep Obsidian*, and *Holographic Synth Sunset*.
- 🎥 **Smooth Camera Lerping**:
  - Clamped polar angles (preventing flips beneath the ground) with preset camera docks (*Isometric*, *Lateral Profile*, *Top-Down*, *Sole Underside*, *Quarter Front*).
- 💰 **Live Dynamic Price Engine**:
  - Base price calculation with instant material surcharge tracking and animated counter.
- 🎨 **Curated Cyber Themes**:
  - One-click aesthetics: *Neo Tokyo 2077*, *Stealth Obsidian*, *Hyper Titanium*, *Solar Flare*, *Synthwave Sunset*, and *Toxic Emerald*.
- 📷 **High-Res Snapshot Capture**:
  - Instant canvas snapshot generator producing downloadable `.png` renders with `preserveDrawingBuffer`.
- 📋 **Spec Sheet & Checkout Suite**:
  - Serialized Build Number (`CSPX-XXXX-XXXX`), itemized Bill of Materials (BOM), spec download (`.txt`), and a 3-step interactive checkout flow with confetti celebrations.
- 🔊 **Procedural Web Audio SFX**:
  - Synthesized sci-fi clicks, color ticks, snaps, and success fanfares without external audio asset dependencies.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, TypeScript)
- **3D Graphics**: [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects & Exports**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/aliyannn/3D-Configurator.git
cd 3D-Configurator
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production
```bash
npm run build
npm run start
```

---

## 📄 License
MIT License. Built with precision for next-generation web 3D product customization.
