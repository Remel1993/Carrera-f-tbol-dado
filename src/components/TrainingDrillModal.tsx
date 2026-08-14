// @ts-nocheck
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell, Dices, HeartPulse, AlertTriangle, ShieldCheck, Check,
  X, Zap, Sparkles, Award, ArrowRight, ShieldAlert, Activity
} from 'lucide-react';

export interface TrainingDrillModalProps {
  isOpen: boolean;
  onClose: () => void;
  career: any;
  team: any;
  onApplyDrillResult: (result: {
    peGained: number;
    injuryOccurred: boolean;
    immunityPrevented: boolean;
    affectedAttr?: 'att' | 'opp' | 'def';
    statLost?: boolean;
    paidPhysio?: boolean;
    physioCost?: number;
    newImmunityWeeks?: number;
  }) => void;
  ui: {
    DieIcon: React.ComponentType<any>;
    Shield: React.ComponentType<any>;
  };
}

export const TrainingDrillModal: React.FC<TrainingDrillModalProps> = ({
  isOpen,
  onClose,
  career,
  team,
  onApplyDrillResult,
  ui
}) => {
  const { DieIcon, Shield } = ui;
  const [rolling, setRolling] = useState(false);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [drillOutcome, setDrillOutcome] = useState<any | null>(null);
  const [showInjuryChoice, setShowInjuryChoice] = useState(false);

  const division = career?.div || 2;
  const physioCost = division === 1 ? 20 : 10;
  const currentPE = career?.pe || 0;
  const canAffordPhysio = currentPE >= physioCost;
  const immunityWeeks = career?.medicalImmunityWeeks || 0;

  const handleRollDrill = () => {
    if (rolling) return;
    setRolling(true);
    setDiceValue(null);
    setDrillOutcome(null);
    setShowInjuryChoice(false);

    let rollCount = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount >= 10) {
        clearInterval(interval);
        const finalVal = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalVal);
        setRolling(false);
        processDrillOutcome(finalVal);
      }
    }, 80);
  };

  const processDrillOutcome = (die: number) => {
    if (die === 1 || die === 2) {
      // +7 PE
      setDrillOutcome({
        type: 'master',
        title: '¡Sesión Magistral!',
        desc: 'El equipo ha completado un entrenamiento extraordinario con máxima intensidad y concentración.',
        peGained: 7,
        badge: '+7 PE Ganados'
      });
    } else if (die === 3 || die === 4) {
      // +5 PE
      setDrillOutcome({
        type: 'good',
        title: '¡Buen Entrenamiento!',
        desc: 'El grupo respondió con gran compromiso táctico y físico en los ejercicios semanales.',
        peGained: 5,
        badge: '+5 PE Ganados'
      });
    } else if (die === 5) {
      // Neutral
      setDrillOutcome({
        type: 'neutral',
        title: 'Sesión Rutinaria',
        desc: 'Entrenamiento estándar sin incidencias ni progresos destacados esta semana.',
        peGained: 0,
        badge: '0 PE (Sin incidencias)'
      });
    } else if (die === 6) {
      // Lesión
      const attrs: Array<'att' | 'opp' | 'def'> = [];
      if ((team?.att || 1) > 1) attrs.push('att');
      if ((team?.opp || 1) > 1) attrs.push('opp');
      if ((team?.def || 1) > 1) attrs.push('def');
      if (attrs.length === 0) attrs.push('att');

      const affected = attrs[Math.floor(Math.random() * attrs.length)];
      const attrNames: Record<string, string> = {
        att: 'Ataque (ATT)',
        opp: 'Ocasiones (OPP)',
        def: 'Defensa (DEF)'
      };

      if (immunityWeeks > 0) {
        // Immunity Cancels injury!
        setDrillOutcome({
          type: 'immunity',
          title: '🛡️ ¡Inmunidad Médica Activa!',
          desc: `El protocolo médico del club detectó y previno a tiempo una sobrecarga en ${attrNames[affected]}. ¡No se pierde ningún atributo ni se cobran PE!`,
          peGained: 0,
          immunityPrevented: true,
          badge: `Inmunidad activa (${immunityWeeks} sem.)`
        });
      } else {
        // Must choose injury or physio
        setDrillOutcome({
          type: 'injury',
          title: '⚠️ ¡Alerta de Lesión en el Entrenamiento!',
          desc: `Un jugador clave ha sufrido una dolencia en ${attrNames[affected]}. Puedes contratar Fisioterapia de Élite o asumir la baja de -1 en la estadística.`,
          peGained: 0,
          affectedAttr: affected,
          attrLabel: attrNames[affected],
          badge: 'Riesgo de -1 Stat'
        });
        setShowInjuryChoice(true);
      }
    }
  };

  const handleClaimSuccess = () => {
    if (!drillOutcome) return;
    onApplyDrillResult({
      peGained: drillOutcome.peGained || 0,
      injuryOccurred: false,
      immunityPrevented: !!drillOutcome.immunityPrevented
    });
    onClose();
  };

  const handleChoosePhysio = () => {
    if (!canAffordPhysio || !drillOutcome) return;
    onApplyDrillResult({
      peGained: 0,
      injuryOccurred: true,
      immunityPrevented: false,
      paidPhysio: true,
      physioCost: physioCost,
      newImmunityWeeks: 3
    });
    onClose();
  };

  const handleAcceptInjury = () => {
    if (!drillOutcome) return;
    onApplyDrillResult({
      peGained: 0,
      injuryOccurred: true,
      immunityPrevented: false,
      paidPhysio: false,
      affectedAttr: drillOutcome.affectedAttr,
      statLost: true
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[75] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-slate-900/95 border border-white/10 rounded-[2.25rem] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-emerald-400 to-blue-500 shrink-0" />

          {/* Header */}
          <div className="p-5 pb-3 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Dumbbell size={20} />
              </div>
              <div>
                <h3 className="text-base font-black uppercase italic text-white">
                  Entrenamiento Voluntario
                </h3>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Prueba de Intensidad Semanal (1D6)
                </p>
              </div>
            </div>
            {!rolling && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 active:scale-95 transition-all"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            {/* Status / Immunity banner */}
            {immunityWeeks > 0 ? (
              <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-2xl p-3 flex items-center gap-3">
                <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
                <div className="text-[9px] text-emerald-200 font-bold leading-tight">
                  <strong className="text-white block font-black uppercase">Inmunidad Médica Activa</strong>
                  Cubre lesiones de entrenamiento durante {immunityWeeks} semana{immunityWeeks > 1 ? 's' : ''} más.
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-3 flex items-center justify-between text-[9px] text-slate-300 font-bold">
                <span>Tu Banco de PE: <strong className="text-emerald-400">{currentPE} PE</strong></span>
                <span>Fisioterapia de Élite: <strong className="text-amber-300">{physioCost} PE</strong></span>
              </div>
            )}

            {/* Dice Canvas Stage */}
            <div className="bg-slate-950/70 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[160px]">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

              {diceValue === null ? (
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                    <Dices size={32} />
                  </div>
                  <p className="text-[10px] font-bold text-slate-300 max-w-xs">
                    Lanza el dado 1D6 para poner a prueba a tus jugadores antes de la jornada.
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 w-full max-w-xs text-[8px] font-bold uppercase mt-1">
                    <span className="bg-emerald-950/60 text-emerald-300 p-1 rounded-lg border border-emerald-500/20">Dado 1-2: +7 PE</span>
                    <span className="bg-blue-950/60 text-blue-300 p-1 rounded-lg border border-blue-500/20">Dado 3-4: +5 PE</span>
                    <span className="bg-red-950/60 text-red-300 p-1 rounded-lg border border-red-500/20">Dado 6: Lesión</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <motion.div
                    animate={rolling ? { scale: [1, 1.2, 1], rotate: [0, 90, 180, 360] } : { scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)] border-2 border-white/40"
                  >
                    <DieIcon value={diceValue} className="w-12 h-12 text-slate-950" />
                  </motion.div>
                  <p className="text-[11px] font-black uppercase italic text-amber-300">
                    Resultado: Dado {diceValue}
                  </p>
                </div>
              )}
            </div>

            {/* Drill Outcome Details */}
            {drillOutcome && !rolling && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-4 border ${
                  drillOutcome.type === 'master' || drillOutcome.type === 'good'
                    ? 'bg-emerald-950/40 border-emerald-500/30'
                    : drillOutcome.type === 'neutral'
                    ? 'bg-blue-950/40 border-blue-500/30'
                    : drillOutcome.type === 'immunity'
                    ? 'bg-emerald-950/50 border-emerald-400/40'
                    : 'bg-red-950/40 border-red-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-black uppercase italic text-white">
                    {drillOutcome.title}
                  </h4>
                  <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-black/40 text-amber-300 border border-white/10">
                    {drillOutcome.badge}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-300 leading-relaxed mt-1">
                  {drillOutcome.desc}
                </p>

                {/* Injury Resolution Choices */}
                {showInjuryChoice && (
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-wider text-amber-300">
                      ¿Cómo deseas responder ante la lesión médica?
                    </p>

                    {/* Option 1: Physiotherapy */}
                    <button
                      onClick={handleChoosePhysio}
                      disabled={!canAffordPhysio}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:opacity-40 disabled:pointer-events-none text-white p-3 rounded-2xl border border-emerald-400/40 flex items-center justify-between text-left active:scale-95 transition-all shadow-lg"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <HeartPulse size={14} className="text-emerald-300" />
                          <span className="text-[10px] font-black uppercase italic">
                            Fisioterapia de Élite ({physioCost} PE)
                          </span>
                        </div>
                        <p className="text-[8px] font-bold text-emerald-200 mt-0.5">
                          Cancela la lesión + Otorga 3 semanas de Inmunidad Médica
                        </p>
                      </div>
                      <span className="text-[9px] font-black bg-black/30 px-2 py-1 rounded-lg text-emerald-300">
                        {canAffordPhysio ? 'Contratar' : 'Sin PE'}
                      </span>
                    </button>

                    {/* Option 2: Accept Injury (-1 Stat) */}
                    <button
                      onClick={handleAcceptInjury}
                      className="w-full bg-slate-800/90 hover:bg-red-950/60 text-slate-200 hover:text-red-200 p-3 rounded-2xl border border-white/10 hover:border-red-500/30 flex items-center justify-between text-left active:scale-95 transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle size={14} className="text-red-400" />
                          <span className="text-[10px] font-black uppercase italic">
                            Asumir Baja (-1 en {drillOutcome.attrLabel})
                          </span>
                        </div>
                        <p className="text-[8px] font-bold text-slate-400 mt-0.5">
                          No gastar PE y aplicar la penalización al club
                        </p>
                      </div>
                      <span className="text-[9px] font-black bg-red-500/20 text-red-300 px-2 py-1 rounded-lg">
                        -1 Stat
                      </span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Actions */}
            <div className="pt-2">
              {diceValue === null ? (
                <button
                  onClick={handleRollDrill}
                  disabled={rolling}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 py-4 rounded-2xl text-[10px] font-black uppercase italic tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Dices size={16} /> {rolling ? 'Lanzando Dado...' : 'Lanzar Dado de Entrenamiento (1D6)'}
                </button>
              ) : !showInjuryChoice ? (
                <button
                  onClick={handleClaimSuccess}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 py-4 rounded-2xl text-[10px] font-black uppercase italic tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Check size={16} /> Confirmar y Continuar
                </button>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TrainingDrillModal;
