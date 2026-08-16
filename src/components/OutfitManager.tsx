import React, { useState } from 'react';
import { OutfitLayer, Garment, AIFitAssessment } from '../types';
import {
  Layers,
  Eye,
  EyeOff,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Download,
  Sliders,
  RotateCcw,
  ShieldCheck,
  Activity,
  CheckCircle,
  Lightbulb,
  Palette,
} from 'lucide-react';

interface OutfitManagerProps {
  equippedLayers: OutfitLayer[];
  fitAssessment?: AIFitAssessment | null;
  onToggleLayerVisibility: (garmentId: string) => void;
  onRemoveLayer: (garmentId: string) => void;
  onMoveLayerUp: (index: number) => void;
  onMoveLayerDown: (index: number) => void;
  onUpdateLayerScale: (garmentId: string, scale: number) => void;
  onUpdateLayerOffset: (garmentId: string, offsetY: number) => void;
  onClearOutfit: () => void;
  onProcessTryOn: () => void;
  onExportLook: () => void;
  isProcessing: boolean;
  hasRenderedResult: boolean;
}

export const OutfitManager: React.FC<OutfitManagerProps> = ({
  equippedLayers,
  fitAssessment,
  onToggleLayerVisibility,
  onRemoveLayer,
  onMoveLayerUp,
  onMoveLayerDown,
  onUpdateLayerScale,
  onUpdateLayerOffset,
  onClearOutfit,
  onProcessTryOn,
  onExportLook,
  isProcessing,
  hasRenderedResult,
}) => {
  const [expandedLayerId, setExpandedLayerId] = useState<string | null>(null);
  const [showFullAiReport, setShowFullAiReport] = useState(false);

  // Calculate outfit metrics
  const totalCost = equippedLayers.reduce(
    (sum, l) => sum + (l.garment.price || 0),
    0
  );

  // Extract distinct colors
  const colorSwatches = Array.from(
    new Set(equippedLayers.map((l) => l.garment.color))
  );

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-zinc-800" />
          <h3 className="text-sm font-bold tracking-tight text-zinc-900">
            3. Gestión de Outfit
          </h3>
        </div>
        {equippedLayers.length > 0 && (
          <button
            onClick={onClearOutfit}
            className="text-[11px] font-medium text-red-600 hover:text-red-700 hover:underline inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Limpiar todo
          </button>
        )}
      </div>

      {/* Layers List (Orden de Capas) */}
      <div className="flex-1 space-y-2 min-h-[190px] max-h-[300px] overflow-y-auto pr-1">
        {equippedLayers.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-2">
              <Layers className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-zinc-700">
              No hay prendas equipadas
            </p>
            <p className="text-[11px] text-zinc-400 mt-1 max-w-[200px]">
              Selecciona prendas del panel izquierdo para combinarlas en capas
            </p>
          </div>
        ) : (
          equippedLayers.map((layer, index) => {
            const isExpanded = expandedLayerId === layer.garment.id;
            const { garment } = layer;

            return (
              <div
                key={garment.id}
                id={`layer-item-${garment.id}`}
                className={`rounded-xl border transition-all ${
                  layer.visible
                    ? 'border-zinc-200 bg-white shadow-xs'
                    : 'border-zinc-200/60 bg-zinc-50/70 opacity-60'
                }`}
              >
                <div className="p-2 flex items-center gap-2">
                  {/* Category / Order Indicator */}
                  <div className="flex flex-col gap-0.5 text-zinc-400">
                    <button
                      onClick={() => onMoveLayerUp(index)}
                      disabled={index === 0}
                      className="hover:text-zinc-900 disabled:opacity-20 p-0.5"
                      title="Mover capa arriba (Z-Index mayor)"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onMoveLayerDown(index)}
                      disabled={index === equippedLayers.length - 1}
                      className="hover:text-zinc-900 disabled:opacity-20 p-0.5"
                      title="Mover capa abajo"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0 relative p-0.5">
                    <img
                      src={garment.thumbnailUrl || garment.imageUrl}
                      alt={garment.name}
                      className="w-full h-full object-cover rounded"
                    />
                    <div
                      className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border border-white"
                      style={{ backgroundColor: garment.color }}
                    />
                  </div>

                  {/* Layer Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono px-1 py-0.2 bg-zinc-100 text-zinc-600 rounded">
                        L{equippedLayers.length - index}
                      </span>
                      <h4 className="text-xs font-semibold text-zinc-900 truncate">
                        {garment.name}
                      </h4>
                    </div>
                    <p className="text-[10px] text-zinc-500 capitalize truncate">
                      {garment.category} {garment.price ? `• $${garment.price}` : ''}
                    </p>
                  </div>

                  {/* Layer Action Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() =>
                        setExpandedLayerId(isExpanded ? null : garment.id)
                      }
                      className={`p-1.5 rounded-lg transition-colors ${
                        isExpanded
                          ? 'bg-zinc-900 text-white'
                          : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
                      }`}
                      title="Ajustar escala y posición fina"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>

                    <button
                      id={`btn-toggle-vis-${garment.id}`}
                      onClick={() => onToggleLayerVisibility(garment.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        layer.visible
                          ? 'text-zinc-600 hover:bg-zinc-100'
                          : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                      }`}
                      title={layer.visible ? 'Ocultar capa' : 'Mostrar capa'}
                    >
                      {layer.visible ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      id={`btn-remove-layer-${garment.id}`}
                      onClick={() => onRemoveLayer(garment.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar capa del outfit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Micro-Sliders */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 border-t border-zinc-100 bg-zinc-50/50 rounded-b-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-zinc-500 font-medium">
                        Escala ({Math.round(layer.scale * 100)}%)
                      </span>
                      <input
                        type="range"
                        min="0.7"
                        max="1.3"
                        step="0.05"
                        value={layer.scale}
                        onChange={(e) =>
                          onUpdateLayerScale(
                            garment.id,
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-28 accent-zinc-900"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-zinc-500 font-medium">
                        Posición Vertical ({layer.position?.y || 0}px)
                      </span>
                      <input
                        type="range"
                        min="-20"
                        max="20"
                        step="1"
                        value={layer.position?.y || 0}
                        onChange={(e) =>
                          onUpdateLayerOffset(
                            garment.id,
                            parseInt(e.target.value, 10)
                          )
                        }
                        className="w-28 accent-zinc-900"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* AI Fit Assessment Card (Shown after try-on) */}
      {fitAssessment && hasRenderedResult && (
        <div className="p-3 bg-emerald-50/70 border border-emerald-200/90 rounded-xl space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-950">
                Ajuste IA Evaluado
              </span>
            </div>
            <span className="text-xs font-extrabold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-md font-mono">
              {fitAssessment.fitScore}% FIT
            </span>
          </div>

          <p className="text-[11px] text-emerald-900 font-medium">
            {fitAssessment.fitStatus}
          </p>

          <p className="text-[10px] text-emerald-800/90 leading-relaxed">
            {fitAssessment.fabricPhysics}
          </p>

          {/* Toggle Full AI Stylist Report */}
          <button
            onClick={() => setShowFullAiReport((prev) => !prev)}
            className="text-[10px] text-emerald-700 hover:text-emerald-900 font-semibold underline flex items-center gap-1"
          >
            <Lightbulb className="w-3 h-3" />
            {showFullAiReport ? 'Ocultar consejos de estilo' : 'Ver consejos de estilo IA'}
          </button>

          {showFullAiReport && fitAssessment.stylingTips && (
            <ul className="text-[10px] text-emerald-900/85 space-y-1 pl-3 list-disc pt-1 border-t border-emerald-200/60">
              {fitAssessment.stylingTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Outfit Metrics & Palette Card */}
      {equippedLayers.length > 0 && !fitAssessment && (
        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Paleta del Look:</span>
            <div className="flex items-center gap-1">
              {colorSwatches.map((color, i) => (
                <div
                  key={i}
                  className="w-3.5 h-3.5 rounded-full border border-zinc-300 shadow-xs"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-200/60">
            <span className="text-zinc-500">Precio Total Estimado:</span>
            <span className="font-bold text-zinc-900">
              ${totalCost.toFixed(2)} USD
            </span>
          </div>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="space-y-2 pt-1">
        {/* Probar Outfit Handler */}
        <button
          id="btn-process-try-on"
          onClick={onProcessTryOn}
          disabled={equippedLayers.length === 0 || isProcessing}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
            isProcessing
              ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
              : 'bg-zinc-900 hover:bg-zinc-800 text-white active:scale-[0.99] hover:shadow-lg shadow-zinc-900/10'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
          <span className="truncate">
            {isProcessing
              ? 'Cambiando Ropa a la Persona con IA...'
              : 'Cambiar Ropa con IA (Reemplazo Integral)'}
          </span>
        </button>

        {/* Descargar / Exportar Imagen Final */}
        <button
          id="btn-export-final-look"
          onClick={onExportLook}
          disabled={equippedLayers.length === 0 || isProcessing}
          className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-zinc-800 bg-white hover:bg-zinc-50 border border-zinc-200/90 shadow-xs flex items-center justify-center gap-2 transition-all hover:border-zinc-300 disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-zinc-600" />
          <span>Descargar Resultado HD</span>
        </button>
      </div>
    </div>
  );
};
