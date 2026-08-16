import React from 'react';
import { BackgroundScene } from '../types';
import { Image as ImageIcon, X, Check, SunMedium } from 'lucide-react';

interface SceneSelectorModalProps {
  isOpen: boolean;
  scenes: BackgroundScene[];
  activeScene: BackgroundScene;
  customModelImage?: string | null;
  onSelectScene: (scene: BackgroundScene) => void;
  onClose: () => void;
}

export const SceneSelectorModal: React.FC<SceneSelectorModalProps> = ({
  isOpen,
  scenes,
  activeScene,
  customModelImage,
  onSelectScene,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-zinc-100 text-zinc-800">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">
                Escenario & Fondo
              </h3>
              <p className="text-xs text-zinc-500">
                Conserva el fondo de tu foto o cámbialo a un nuevo escenario
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {scenes.map((scene) => {
            const isSelected = activeScene.id === scene.id;
            const imgSrc = scene.isOriginal && customModelImage ? customModelImage : (scene.thumbnailUrl || scene.imageUrl);

            return (
              <button
                key={scene.id}
                id={`scene-option-${scene.id}`}
                onClick={() => {
                  onSelectScene(scene);
                  onClose();
                }}
                className={`group relative rounded-xl border text-left overflow-hidden transition-all ${
                  isSelected
                    ? 'border-zinc-900 ring-2 ring-zinc-900/10 shadow-sm'
                    : 'border-zinc-200 hover:border-zinc-300 hover:shadow-xs'
                }`}
              >
                <div className="aspect-16/10 overflow-hidden bg-zinc-100 relative">
                  <img
                    src={imgSrc}
                    alt={scene.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
                    <p className="text-xs font-bold truncate">{scene.name}</p>
                  </div>
                </div>
                <div className="p-2 bg-white flex items-start gap-1.5">
                  <SunMedium className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-zinc-500 leading-tight line-clamp-2">
                    {scene.lightingDescription}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <span>La iluminación ambiental se adaptará automáticamente.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
