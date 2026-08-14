import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus, Check, X, Shield as ShieldIcon, Zap, Award } from 'lucide-react';

export interface SimulationFeedbackData {
  matchday: number;
  homeName: string;
  awayName: string;
  scoreH: number;
  scoreA: number;
  myGf: number;
  myGa: number;
  result: 'W' | 'D' | 'L';
  posBefore: number;
  posAfter: number;
  repDelta: number;
  peDelta: number;
  isHome: boolean;
  rivalName: string;
}

interface SimulationFeedbackBannerProps {
  feedback: SimulationFeedbackData | null;
  onDismiss?: () => void;
}

export const SimulationFeedbackBanner: React.FC<SimulationFeedbackBannerProps> = ({
  feedback,
  onDismiss
}) => {
  if (!feedback) return null;

  const isWin = feedback.result === 'W';
  const isDraw = feedback.result === 'D';
  const isLoss = feedback.result === 'L';

  const posDiff = feedback.posBefore - feedback.posAfter; // >0 subió posiciones (ej: 5 -> 3 = +2)

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`w-full rounded-[1.75rem] border p-4 shadow-xl mb-4 relative overflow-hidden backdrop-blur-md ${
        isWin
          ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-emerald-950/80 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
          : isDraw
          ? 'bg-gradient-to-r from-slate-900/90 via-slate-950/90 to-slate-900/90 border-slate-600/40'
          : 'bg-gradient-to-r from-red-950/80 via-slate-900/90 to-red-950/80 border-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.2)]'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Etiqueta de resultado */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase italic tracking-widest flex items-center gap-1.5 shadow-md ${
              isWin
                ? 'bg-emerald-500 text-slate-950'
                : isDraw
                ? 'bg-slate-700 text-slate-200'
                : 'bg-red-600 text-white'
            }`}
          >
            {isWin ? <Check size={12} strokeWidth={3} /> : isLoss ? <X size={12} strokeWidth={3} /> : <Minus size={12} />}
            {isWin ? 'VICTORIA' : isDraw ? 'EMPATE' : 'DERROTA'}
          </span>
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">
            Jornada {feedback.matchday}
          </span>
        </div>

        {/* Indicador de Movimiento en Tabla */}
        <div>
          {posDiff > 0 ? (
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-black uppercase italic flex items-center gap-1">
              <ArrowUp size={12} className="text-emerald-400" /> Subió a la posición {feedback.posAfter}º
            </span>
          ) : posDiff < 0 ? (
            <span className="px-2.5 py-1 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-[9px] font-black uppercase italic flex items-center gap-1">
              <ArrowDown size={12} className="text-red-400" /> Bajó a la posición {feedback.posAfter}º
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 border border-white/10 text-[9px] font-black uppercase italic flex items-center gap-1">
              <Minus size={12} className="text-slate-400" /> Mantiene la posición {feedback.posAfter}º
            </span>
          )}
        </div>
      </div>

      {/* Marcador Exacto */}
      <div className="mt-3 bg-black/40 border border-white/10 rounded-2xl p-3 flex items-center justify-between">
        <div className="flex-1 text-left min-w-0">
          <p className="text-[11px] font-black uppercase italic text-white truncate">
            {feedback.homeName}
          </p>
        </div>

        <div className="px-4 py-1 bg-slate-800/80 border border-white/15 rounded-xl text-center shrink-0">
          <span className="text-sm font-black italic tracking-widest text-white tabular-nums">
            {feedback.scoreH} - {feedback.scoreA}
          </span>
        </div>

        <div className="flex-1 text-right min-w-0">
          <p className="text-[11px] font-black uppercase italic text-white truncate">
            {feedback.awayName}
          </p>
        </div>
      </div>

      {/* Recompensas y cierre */}
      <div className="mt-2.5 flex items-center justify-between text-[9px] font-bold text-slate-300">
        <div className="flex items-center gap-3">
          <span className="text-amber-300 flex items-center gap-1">
            <Award size={11} /> {feedback.repDelta > 0 ? `+${feedback.repDelta}` : feedback.repDelta} Reputación
          </span>
          <span className="text-emerald-300 flex items-center gap-1">
            <Zap size={11} /> +{feedback.peDelta} PE
          </span>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-[8px] uppercase tracking-wider text-slate-400 hover:text-white px-2 py-0.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-all"
          >
            Ocultar
          </button>
        )}
      </div>
    </motion.div>
  );
};
