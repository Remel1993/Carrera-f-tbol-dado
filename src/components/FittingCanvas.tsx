import React, { useState } from 'react';
import { Model, BackgroundScene, OutfitLayer, AIFitAssessment } from '../types';
import { CompareSlider } from './CompareSlider';
import {
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Layers,
  Split,
  Activity,
  CheckCircle2,
  Loader2,
  Maximize2,
  Info,
  ShieldCheck,
} from 'lucide-react';

interface FittingCanvasProps {
  model: Model;
  customModelImage: string | null;
  equippedLayers: OutfitLayer[];
  activeScene: BackgroundScene;
  isProcessing: boolean;
  processingStage: string;
  processingProgress: number;
  renderedResultUrl: string | null;
  fitAssessment?: AIFitAssessment | null;
  isAiGenerative?: boolean;
  aiEngineUsed?: string;
  onOpenSceneModal: () => void;
  onSelectLayerToEdit?: (layer: OutfitLayer) => void;
}

export const FittingCanvas: React.FC<FittingCanvasProps> = ({
  model,
  customModelImage,
  equippedLayers,
  activeScene,
  isProcessing,
  processingStage,
  processingProgress,
  renderedResultUrl,
  fitAssessment,
  isAiGenerative,
  aiEngineUsed = 'Gemini AI Try-On',
  onOpenSceneModal,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState<'layers' | 'rendered' | 'split'>('layers');
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [showAiDiagnostics, setShowAiDiagnostics] = useState(false);
  const [activePin, setActivePin] = useState<'shoulders' | 'torso' | 'waist' | 'proportions' | null>(null);

  const modelImageSrc = customModelImage || model.imageUrl;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 1.8));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  // Auto-switch to rendered view when try-on finishes
  React.useEffect(() => {
    if (renderedResultUrl) {
      setViewMode('rendered');
    }
  }, [renderedResultUrl]);

  // Sorted layers
  const visibleLayers = [...equippedLayers]
    .filter((l) => l.visible)
    .sort((a, b) => a.order - b.order);

  const stages = [
    'Segmentando silueta y puntos clave...',
    'Alineando textura y drapeado textil...',
    'Sintetizando iluminación y oclusión...',
    'Renderizando prueba virtual de alta fidelidad con IA...',
  ];

  return (
    <div className="relative w-full h-full min-h-[520px] lg:min-h-[640px] flex flex-col bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl select-none">
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-zinc-900/90 backdrop-blur-md p-1 rounded-xl border border-zinc-700/60 shadow-lg pointer-events-auto">
          <button
            id="btn-view-layers"
            onClick={() => setViewMode('layers')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              viewMode === 'layers'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Vista de prendas seleccionadas"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prendas Seleccionadas</span>
          </button>

          {renderedResultUrl && (
            <button
              id="btn-view-rendered"
              onClick={() => setViewMode('rendered')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'rendered'
                  ? 'bg-emerald-400 text-zinc-950 font-bold shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Resultado con ropa cambiada por IA"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
              <span className="hidden sm:inline">Persona con Ropa Nueva (IA)</span>
            </button>
          )}

          {renderedResultUrl && (
            <button
              id="btn-view-split"
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === 'split'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Comparador antes y después"
            >
              <Split className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Antes / Después</span>
            </button>
          )}
        </div>

        {/* Right Side: Diagnostics Toggle & Scene Selector */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {renderedResultUrl && (
            <button
              id="btn-toggle-diagnostics"
              onClick={() => setShowAiDiagnostics((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl border backdrop-blur-md transition-all ${
                showAiDiagnostics
                  ? 'bg-amber-400 text-zinc-950 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                  : 'bg-zinc-900/90 text-zinc-300 border-zinc-700/60 hover:text-white'
              }`}
              title="Ver análisis de ajuste anatómico sobre el cuerpo"
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Diagnóstico IA</span>
            </button>
          )}

          {/* Scene Selector Floating Button */}
          <button
            id="btn-open-scene-selector"
            onClick={onOpenSceneModal}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/90 hover:bg-zinc-800 backdrop-blur-md text-white text-xs font-semibold rounded-xl border border-zinc-700/60 shadow-lg transition-all group"
          >
            <div className="w-4 h-4 rounded-md overflow-hidden bg-zinc-800">
              <img
                src={activeScene.thumbnailUrl || activeScene.imageUrl}
                alt={activeScene.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden md:inline text-zinc-300 group-hover:text-white">
              {activeScene.name}
            </span>
            <span className="md:hidden text-zinc-300">Fondo</span>
            <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Main Visualizer Stage Area */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden">
        {/* Background scene image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 pointer-events-none"
          style={{
            backgroundImage: `url(${activeScene.imageUrl})`,
            filter: 'brightness(0.85) contrast(1.05)',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: activeScene.ambientTint || 'rgba(0,0,0,0.2)',
              mixBlendMode: 'multiply',
            }}
          />
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60" />
        </div>

        {/* View Mode 1: Split Slider */}
        {viewMode === 'split' && renderedResultUrl ? (
          <div className="relative z-10 w-full h-full p-4 flex items-center justify-center">
            <CompareSlider
              beforeImage={modelImageSrc}
              afterImage={renderedResultUrl}
              beforeLabel={`Foto Original (${customModelImage ? 'Foto Subida' : model.name})`}
              afterLabel="Ropa Reemplazada con IA"
            />
          </div>
        ) : viewMode === 'rendered' && renderedResultUrl ? (
          /* View Mode 2: AI Rendered Result with Landmark Overlay */
          <div
            className="relative z-10 max-h-full flex items-center justify-center transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <div className="relative">
              <img
                src={renderedResultUrl}
                alt="Rendered Outfit"
                className="max-h-[580px] w-auto object-contain rounded-xl shadow-2xl border border-white/10"
              />

              {/* AI Landmark Interactive Pins (Anatomical Fitting Verification) */}
              {showAiDiagnostics && fitAssessment && (
                <div className="absolute inset-0 pointer-events-auto">
                  {/* Pin 1: Shoulders */}
                  <div
                    className="absolute top-[22%] left-[48%] -translate-x-1/2 cursor-pointer group"
                    onClick={() => setActivePin(activePin === 'shoulders' ? null : 'shoulders')}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/30 animate-ping absolute" />
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold text-[10px] shadow-lg border border-white">
                        1
                      </div>
                    </div>
                    {/* Tooltip */}
                    {(activePin === 'shoulders' || true) && (
                      <div className="absolute left-6 top-0 bg-zinc-900/95 text-white p-2.5 rounded-xl border border-emerald-500/60 shadow-xl text-xs w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                        <p className="font-bold text-emerald-400 text-[11px] mb-0.5">
                          Ajuste Acromial (Hombros)
                        </p>
                        <p className="text-[10px] text-zinc-300">
                          {fitAssessment.anatomicalAdjustments.shoulders}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Pin 2: Torso */}
                  <div
                    className="absolute top-[36%] left-[50%] -translate-x-1/2 cursor-pointer group"
                    onClick={() => setActivePin(activePin === 'torso' ? null : 'torso')}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/30 animate-ping absolute" />
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold text-[10px] shadow-lg border border-white">
                        2
                      </div>
                    </div>
                    <div className="absolute right-6 top-0 bg-zinc-900/95 text-white p-2.5 rounded-xl border border-emerald-500/60 shadow-xl text-xs w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                      <p className="font-bold text-emerald-400 text-[11px] mb-0.5">
                        Drapeado y Torsión Textil
                      </p>
                      <p className="text-[10px] text-zinc-300">
                        {fitAssessment.anatomicalAdjustments.torso}
                      </p>
                    </div>
                  </div>

                  {/* Pin 3: Waist */}
                  <div
                    className="absolute top-[52%] left-[48%] -translate-x-1/2 cursor-pointer group"
                    onClick={() => setActivePin(activePin === 'waist' ? null : 'waist')}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/30 animate-ping absolute" />
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold text-[10px] shadow-lg border border-white">
                        3
                      </div>
                    </div>
                    <div className="absolute left-6 top-0 bg-zinc-900/95 text-white p-2.5 rounded-xl border border-emerald-500/60 shadow-xl text-xs w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                      <p className="font-bold text-emerald-400 text-[11px] mb-0.5">
                        Línea de Cintura y Caída
                      </p>
                      <p className="text-[10px] text-zinc-300">
                        {fitAssessment.anatomicalAdjustments.waist}
                      </p>
                    </div>
                  </div>

                  {/* Pin 4: Proportions / Hem */}
                  <div
                    className="absolute top-[75%] left-[50%] -translate-x-1/2 cursor-pointer group"
                    onClick={() => setActivePin(activePin === 'proportions' ? null : 'proportions')}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/30 animate-ping absolute" />
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold text-[10px] shadow-lg border border-white">
                        4
                      </div>
                    </div>
                    <div className="absolute right-6 top-0 bg-zinc-900/95 text-white p-2.5 rounded-xl border border-emerald-500/60 shadow-xl text-xs w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                      <p className="font-bold text-emerald-400 text-[11px] mb-0.5">
                        Proporciones & Calzado
                      </p>
                      <p className="text-[10px] text-zinc-300">
                        {fitAssessment.anatomicalAdjustments.proportions}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* View Mode 3: Live Interactive Layers Mode */
          <div
            className="relative z-10 h-full max-h-[640px] flex items-center justify-center transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Ground shadow under model */}
            <div className="absolute bottom-4 w-48 h-6 bg-black/40 rounded-full blur-md" />

            {/* Base Model Image */}
            <div className="relative h-full max-h-[580px] flex items-center justify-center">
              <img
                src={modelImageSrc}
                alt={model.name}
                className="h-full w-auto max-w-[340px] object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
              />

              {/* Garment Layers Overlay */}
              {visibleLayers.map((layer) => {
                const isSelected = selectedLayerId === layer.garment.id;
                const { garment } = layer;

                let topPercent = '22%';
                let widthPercent = '60%';

                if (garment.category === 'superior') {
                  topPercent = `${18 + (layer.position?.y || 0)}%`;
                  widthPercent = `${58 * (layer.scale || 1)}%`;
                } else if (garment.category === 'inferior') {
                  topPercent = `${48 + (layer.position?.y || 0)}%`;
                  widthPercent = `${52 * (layer.scale || 1)}%`;
                } else if (garment.category === 'calzado') {
                  topPercent = `${76 + (layer.position?.y || 0)}%`;
                  widthPercent = `${44 * (layer.scale || 1)}%`;
                } else if (garment.category === 'accesorios') {
                  topPercent = `${10 + (layer.position?.y || 0)}%`;
                  widthPercent = `${32 * (layer.scale || 1)}%`;
                }

                return (
                  <div
                    key={garment.id}
                    id={`canvas-layer-${garment.id}`}
                    onClick={() => setSelectedLayerId(isSelected ? null : garment.id)}
                    className={`absolute cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black/50 rounded-lg'
                        : 'hover:brightness-105'
                    }`}
                    style={{
                      top: topPercent,
                      left: `calc(50% + ${(layer.position?.x || 0)}px)`,
                      transform: 'translateX(-50%)',
                      width: widthPercent,
                      zIndex: layer.order * 10,
                      opacity: layer.opacity ?? 1,
                    }}
                  >
                    <img
                      src={garment.imageUrl}
                      alt={garment.name}
                      className="w-full h-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]"
                    />

                    {isSelected && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-lg border border-amber-400 whitespace-nowrap">
                        {garment.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Processing Holographic Scanner Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white animate-in fade-in duration-300">
            <div className="relative w-52 h-68 mb-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 overflow-hidden flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.25)]">
              {/* Laser Line */}
              <div
                className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_18px_#34d399]"
                style={{
                  top: `${processingProgress * 0.9 + 5}%`,
                  transition: 'top 0.3s ease-out',
                }}
              />
              <div className="text-center p-4">
                <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto mb-2" />
                <span className="text-xs font-mono tracking-widest text-emerald-300 uppercase block font-bold">
                  Motor de IA Textil
                </span>
                <span className="text-[10px] text-zinc-400 mt-1 block font-mono">
                  {Math.round(processingProgress)}% COMPLETADO
                </span>
              </div>
            </div>

            {/* Progress Bar & Stage Status */}
            <div className="w-full max-w-xs space-y-2 text-center">
              <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden border border-zinc-700">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_#10b981]"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
              <p className="text-xs font-semibold text-emerald-300 animate-pulse">
                {processingStage || stages[0]}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Canvas Toolbar */}
      <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Garments & Fit Score Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/90 backdrop-blur-md rounded-xl border border-zinc-700/60 text-white text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              {equippedLayers.length} {equippedLayers.length === 1 ? 'prenda' : 'prendas'}
            </span>
          </div>

          {fitAssessment && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/80 backdrop-blur-md rounded-xl border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ajuste IA: {fitAssessment.fitScore}%</span>
            </div>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-zinc-900/90 backdrop-blur-md p-1 rounded-xl border border-zinc-700/60 shadow-lg pointer-events-auto text-zinc-300">
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            title="Reducir zoom"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="px-2 py-1 text-[11px] font-mono hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            title="Restablecer zoom al 100%"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            title="Aumentar zoom"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
