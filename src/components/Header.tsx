import React from 'react';
import { Sparkles, Wand2, RotateCcw, Shirt, Layers, HelpCircle, Download } from 'lucide-react';

interface HeaderProps {
  activeLayersCount: number;
  onResetOutfit: () => void;
  onOpenPresets: () => void;
  onOpenHelp: () => void;
  onQuickExport: () => void;
  isProcessing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeLayersCount,
  onResetOutfit,
  onOpenPresets,
  onOpenHelp,
  onQuickExport,
  isProcessing,
}) => {
  return (
    <header className="border-b border-zinc-200 bg-white/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-md shadow-zinc-900/10">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900">
                Atelier Virtual
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                IA Try-On 2.0
              </span>
            </div>
            <p className="text-xs text-zinc-500 hidden md:block">
              Probador interactivo de alta fidelidad con capas y ajuste fotorrealista
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Presets button */}
          <button
            id="btn-quick-presets"
            onClick={onOpenPresets}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors border border-zinc-200"
            title="Explorar looks completos prediseñados"
          >
            <Wand2 className="w-3.5 h-3.5 text-zinc-600" />
            <span className="hidden sm:inline">Looks Recomendados</span>
            <span className="sm:hidden">Presets</span>
          </button>

          {/* Active layers badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 bg-zinc-50 rounded-lg border border-zinc-200">
            <Layers className="w-3.5 h-3.5 text-zinc-500" />
            <span>{activeLayersCount} {activeLayersCount === 1 ? 'capa activa' : 'capas activas'}</span>
          </div>

          {/* Quick Reset */}
          <button
            id="btn-reset-outfit"
            onClick={onResetOutfit}
            disabled={activeLayersCount === 0 || isProcessing}
            className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-transparent rounded-lg transition-colors"
            title="Reiniciar outfit completo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Help button */}
          <button
            id="btn-help-guide"
            onClick={onOpenHelp}
            className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
            title="Guía de uso y atajos"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Quick Download */}
          <button
            id="btn-quick-download"
            onClick={onQuickExport}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar Look</span>
          </button>
        </div>
      </div>
    </header>
  );
};
