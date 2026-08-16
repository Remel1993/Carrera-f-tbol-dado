import React from 'react';
import { OutfitPreset } from '../types';
import { Wand2, X, Check, ArrowRight } from 'lucide-react';

interface PresetsModalProps {
  isOpen: boolean;
  presets: OutfitPreset[];
  onApplyPreset: (preset: OutfitPreset) => void;
  onClose: () => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  presets,
  onApplyPreset,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-zinc-900 text-white">
              <Wand2 className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">
                Looks Recomendados del Atelier
              </h3>
              <p className="text-xs text-zinc-500">
                Aplica combinaciones completas seleccionadas por estilistas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="group rounded-xl border border-zinc-200 hover:border-zinc-300 p-3 bg-white hover:bg-zinc-50/50 flex flex-col justify-between transition-all shadow-xs"
            >
              <div>
                <div className="aspect-square rounded-lg overflow-hidden bg-zinc-100 mb-2.5">
                  <img
                    src={preset.thumbnailUrl}
                    alt={preset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-xs font-bold text-zinc-900 leading-tight">
                  {preset.name}
                </h4>
                <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">
                  {preset.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {preset.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  onApplyPreset(preset);
                  onClose();
                }}
                className="mt-3 w-full py-1.5 px-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition-colors"
              >
                <span>Cargar Look</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-zinc-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
