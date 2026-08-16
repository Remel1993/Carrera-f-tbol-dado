import React from 'react';
import { HelpCircle, X, CheckCircle, Layers, Wand2, Upload, Camera, Download } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-zinc-100 text-zinc-800">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">
                Guía del Probador Virtual
              </h3>
              <p className="text-xs text-zinc-500">
                Aprende a combinar prendas y exportar tus looks
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

        <div className="space-y-3.5 mt-4 text-xs text-zinc-600">
          <div className="flex gap-3 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0 font-bold">
              1
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 mb-0.5">Selecciona el Modelo</h4>
              <p>Elige entre los 3 modelos calibrados de estudio o sube tu propia fotografía/captura de cámara.</p>
            </div>
          </div>

          <div className="flex gap-3 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0 font-bold">
              2
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 mb-0.5">Equipa Prendas por Capas</h4>
              <p>Navega por las categorías (Superior, Inferior, Calzado, Accesorios) o arrastra tus propias prendas PNG sin fondo.</p>
            </div>
          </div>

          <div className="flex gap-3 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0 font-bold">
              3
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 mb-0.5">Ajusta el Orden y la Posición</h4>
              <p>En el panel derecho puedes reordenar capas (subir/bajar Z-Index), ocultar prendas temporalmente y ajustar micro-escalas.</p>
            </div>
          </div>

          <div className="flex gap-3 p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center shrink-0 font-bold">
              4
            </div>
            <div>
              <h4 className="font-bold text-zinc-900 mb-0.5">Prueba Virtual y Exportación</h4>
              <p>Presiona "Probar Outfit" para ejecutar el procesamiento de mapeo e iluminación, y luego descarga la imagen final en alta definición.</p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-zinc-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
