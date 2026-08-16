import React, { useRef } from 'react';
import { Model, ModelGender } from '../types';
import { User, Upload, Camera, Check, Sparkles, RefreshCw } from 'lucide-react';

interface ModelSelectorProps {
  models: Model[];
  selectedModel: Model;
  customModelImage: string | null;
  onSelectModel: (model: Model) => void;
  onUploadCustomModel: (dataUrl: string) => void;
  onClearCustomModel: () => void;
  onOpenLiveCamera: () => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  customModelImage,
  onSelectModel,
  onUploadCustomModel,
  onClearCustomModel,
  onOpenLiveCamera,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUploadCustomModel(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUploadCustomModel(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-zinc-700" />
          <h3 className="text-sm font-bold tracking-tight text-zinc-900">
            1. Selección de Modelo
          </h3>
        </div>
        {customModelImage && (
          <button
            onClick={onClearCustomModel}
            className="text-xs text-amber-700 hover:text-amber-800 font-medium inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200"
          >
            <RefreshCw className="w-3 h-3" />
            Usar predeterminado
          </button>
        )}
      </div>

      {/* Model Cards Grid: 3 default models */}
      <div className="grid grid-cols-3 gap-2">
        {models.map((model) => {
          const isSelected = !customModelImage && selectedModel.id === model.id;
          return (
            <button
              key={model.id}
              id={`model-btn-${model.id}`}
              onClick={() => onSelectModel(model)}
              className={`relative group rounded-xl p-1.5 border transition-all text-left overflow-hidden ${
                isSelected
                  ? 'border-zinc-900 bg-zinc-900/5 ring-2 ring-zinc-900/10 shadow-sm'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50'
              }`}
            >
              <div className="aspect-3/4 rounded-lg overflow-hidden bg-zinc-100 relative mb-1.5">
                <img
                  src={model.thumbnailUrl}
                  alt={model.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center shadow">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 text-white text-[10px] font-medium leading-tight">
                  <span className="capitalize">{model.gender}</span>
                </div>
              </div>
              <div className="px-0.5">
                <p className="text-xs font-semibold text-zinc-900 truncate">
                  {model.name.split(' ')[0]}
                </p>
                <p className="text-[10px] text-zinc-500 truncate">
                  {model.height}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Model Upload & Camera section */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed p-3 text-center transition-all ${
          customModelImage
            ? 'border-emerald-300 bg-emerald-50/30'
            : 'border-zinc-200 bg-zinc-50/60 hover:bg-zinc-100/50 hover:border-zinc-300'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        {customModelImage ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-300 shrink-0 relative">
                <img
                  src={customModelImage}
                  alt="Modelo personal"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-emerald-500/20"></div>
              </div>
              <div className="text-left min-w-0">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <p className="text-xs font-bold text-zinc-900 truncate">
                    Foto Personal Activa
                  </p>
                </div>
                <p className="text-[10px] text-zinc-500 truncate">
                  Alineación de pose habilitada
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2 py-1 text-[11px] font-medium text-zinc-700 bg-white hover:bg-zinc-50 rounded border border-zinc-200 shadow-xs"
              >
                Cambiar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-zinc-600 font-medium">
              ¿Quieres probar en tu propio cuerpo?
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                id="btn-upload-model-photo"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-800 bg-white hover:bg-zinc-100 rounded-lg border border-zinc-200 shadow-xs transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-zinc-600" />
                Subir foto
              </button>
              <button
                id="btn-open-camera-modal"
                type="button"
                onClick={onOpenLiveCamera}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-800 bg-white hover:bg-zinc-100 rounded-lg border border-zinc-200 shadow-xs transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-zinc-600" />
                Cámara
              </button>
            </div>
            <p className="text-[10px] text-zinc-400">
              Arrastra una foto JPG o PNG de cuerpo entero
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
