import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, TrendingUp, CheckCircle, Flame, ChevronRight, X, Star, Calendar, Shield as ShieldIcon } from 'lucide-react';
import { repBand } from '../lib/career';

interface CareerLegendProfileProps {
  career: any;
  team: any;
  onClose?: () => void;
  ui: any;
  isModal?: boolean;
}

export const CareerLegendProfile: React.FC<CareerLegendProfileProps> = ({
  career,
  team,
  onClose,
  ui,
  isModal = false
}) => {
  const { Shield } = ui || {};

  const managerName = career.manager || 'Entrenador';
  const reputation = career.reputation || 10;
  const band = repBand(reputation);

  // Estadísticas acumuladas
  const stats = career.stats || { matches: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0 };
  const matches = stats.matches || (career.seasonLog?.length || 0);
  const wins = stats.wins || 0;
  const draws = stats.draws || 0;
  const losses = stats.losses || 0;
  const winRate = matches > 0 ? ((wins / matches) * 100).toFixed(1) : '0.0';

  // Trofeos
  const trophies = career.trophies || { leagues: 0, champions: 0, promotions: 0 };

  // Historial cronológico de temporadas (más reciente arriba)
  const history = career.seasonHistory || [];

  const content = (
    <div className="space-y-4">
      {/* CABECERA DE LEYENDA */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 border border-amber-500/30 rounded-[2rem] p-5 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[0.9rem] flex items-center justify-center">
                <Trophy size={26} className="text-yellow-400" />
              </div>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-amber-400">Historial de Leyenda</p>
              <h2 className="text-lg font-black uppercase italic text-white leading-tight">{managerName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Star size={10} className="fill-amber-400 text-amber-400" /> {band.label}
                </span>
                <span className="text-[9px] font-bold text-slate-300">Rep. {reputation}/100</span>
              </div>
            </div>
          </div>

          {onClose && isModal && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-white/10 active:scale-95 transition-all"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Barra de progreso de reputación */}
        <div className="mt-4">
          <div className="flex justify-between text-[8px] font-bold uppercase text-slate-400 mb-1">
            <span>Progreso a Leyenda</span>
            <span className="text-amber-300">{reputation}%</span>
          </div>
          <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, reputation))}%` }}
            />
          </div>
        </div>

        {/* VITRINA DE TROFEOS */}
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
          <div className="bg-black/30 rounded-2xl p-2.5 border border-white/5">
            <Trophy size={18} className="text-yellow-400 mx-auto mb-1" />
            <p className="text-base font-black italic text-white tabular-nums">{trophies.leagues || 0}</p>
            <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">Ligas</p>
          </div>
          <div className="bg-black/30 rounded-2xl p-2.5 border border-white/5">
            <Award size={18} className="text-blue-400 mx-auto mb-1" />
            <p className="text-base font-black italic text-white tabular-nums">{trophies.champions || 0}</p>
            <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">Champions</p>
          </div>
          <div className="bg-black/30 rounded-2xl p-2.5 border border-white/5">
            <TrendingUp size={18} className="text-emerald-400 mx-auto mb-1" />
            <p className="text-base font-black italic text-white tabular-nums">{trophies.promotions || 0}</p>
            <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">Ascensos</p>
          </div>
        </div>

        {/* DATOS AGREGADOS (ESTADÍSTICAS TOTALES) */}
        <div className="mt-3 bg-black/40 rounded-2xl p-3 border border-white/5 grid grid-cols-4 gap-1 text-center">
          <div>
            <p className="text-[8px] font-black uppercase text-slate-400">PJ</p>
            <p className="text-xs font-black text-white tabular-nums">{matches}</p>
          </div>
          <div>
            <p className="text-[8px] font-black uppercase text-slate-400">V / E / D</p>
            <p className="text-[11px] font-black text-slate-200 tabular-nums">
              <span className="text-emerald-400">{wins}</span>/<span className="text-slate-400">{draws}</span>/<span className="text-red-400">{losses}</span>
            </p>
          </div>
          <div>
            <p className="text-[8px] font-black uppercase text-slate-400">% Victorias</p>
            <p className="text-xs font-black text-emerald-400 tabular-nums">{winRate}%</p>
          </div>
          <div>
            <p className="text-[8px] font-black uppercase text-slate-400">Goles</p>
            <p className="text-[10px] font-black text-slate-200 tabular-nums">{stats.gf || 0}:{stats.ga || 0}</p>
          </div>
        </div>
      </div>

      {/* LÍNEA DEL TIEMPO (TIMELINE DE TEMPORADAS) */}
      <div className="bg-slate-900/40 border border-white/10 rounded-[2rem] p-5 shadow-xl">
        <p className="text-[9px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-2 mb-3">
          <Calendar size={13} /> Línea del Tiempo de Temporadas
        </p>

        {history.length > 0 ? (
          <div className="space-y-3">
            {history.map((h: any, i: number) => {
              const isChamp = h.position === 1;
              const isPromo = h.promoted || (h.position <= 3 && h.div === 2);
              return (
                <div
                  key={i}
                  className={`rounded-2xl p-3.5 border transition-all ${
                    isChamp
                      ? 'bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                      : isPromo
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-black/30 border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-white/10">
                        Temporada {h.season}
                      </span>
                      <h4 className="text-xs font-black uppercase italic text-white mt-1">
                        {h.teamName}
                      </h4>
                      <p className="text-[9px] font-bold text-slate-400">
                        {h.compName || 'Liga'} · {h.div === 2 ? '2ª División' : '1ª División'}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`text-sm font-black italic tabular-nums ${isChamp ? 'text-yellow-400' : 'text-emerald-400'}`}>
                        {h.position ? `${h.position}º puesto` : '—'}
                      </span>
                      <p className="text-[8px] font-bold text-slate-400">
                        {h.pts ? `${h.pts} pts` : ''} · Rep {h.repAfter || '—'}
                      </p>
                    </div>
                  </div>

                  {/* Logros destacados de la temporada */}
                  <div className="mt-2 pt-2 border-t border-white/5 flex flex-wrap gap-1.5">
                    {isChamp && (
                      <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 flex items-center gap-1">
                        <Trophy size={10} /> Campeón de Liga
                      </span>
                    )}
                    {isPromo && !isChamp && (
                      <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <TrendingUp size={10} /> Ascenso a 1ª División
                      </span>
                    )}
                    {h.clResult && (
                      <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                        <Award size={10} /> {h.clResult}
                      </span>
                    )}
                    {h.objectivesMet >= 2 && (
                      <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle size={10} /> Objetivos Cumplidos ({h.objectivesMet}/{h.objectivesTotal || 3})
                      </span>
                    )}
                    {h.fired && (
                      <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 border border-red-500/30">
                        Despido de club
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 bg-black/20 rounded-2xl border border-white/5">
            <Trophy size={28} className="text-slate-600 mx-auto mb-2" />
            <p className="text-[10px] font-bold text-slate-300">Tu primera temporada está en curso.</p>
            <p className="text-[8px] font-bold text-slate-500 mt-0.5">Al finalizar cada campaña se registrarán tus títulos y logros en tu vitrina histórica.</p>
          </div>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          className="w-full max-w-sm max-h-[88vh] overflow-y-auto custom-scrollbar"
        >
          {content}
        </motion.div>
      </div>
    );
  }

  return content;
};
