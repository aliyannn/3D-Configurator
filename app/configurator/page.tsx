import dynamic from 'next/dynamic';

const ConfiguratorCanvas = dynamic(
  () => import('@/components/configurator/ConfiguratorCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-500">Initializing 3D Studio...</p>
        </div>
      </div>
    ),
  }
);

export default function ConfiguratorPage() {
  return (
    <main className="w-full h-screen overflow-hidden relative bg-slate-50">
      <ConfiguratorCanvas />
    </main>
  );
}

