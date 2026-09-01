import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CYBERSNEAKER PRO X | 3D Custom Configurator",
  description: "Next-gen 3D custom footwear configurator with real-time PBR material rendering, dynamic pricing, and studio lighting powered by WebGL & React Three Fiber.",
  keywords: ["3D Configurator", "Cyberpunk Sneaker", "Three.js", "React Three Fiber", "Web3D", "PBR Materials"],
  authors: [{ name: "CyberSneaker Lab" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#030407] text-slate-100 antialiased overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
