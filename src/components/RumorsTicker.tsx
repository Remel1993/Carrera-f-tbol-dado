import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, AlertCircle, Briefcase, Newspaper } from 'lucide-react';

interface Rumor {
  id: string;
  type: 'danger' | 'vacancy' | 'press' | 'rumor';
  tag: string;
  text: string;
}

interface RumorsTickerProps {
  rumors: Rumor[];
}

export const RumorsTicker: React.FC<RumorsTickerProps> = ({ rumors }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!rumors || rumors.length === 0) return;
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % rumors.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [rumors]);

  if (!rumors || rumors.length === 0) return null;

  const current = rumors[index % rumors.length] || rumors[0];

  const getTagColor = (type: string) => {
    switch (type) {
      case 'danger':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'vacancy':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'press':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'danger':
        return <AlertCircle size={11} className="text-red-400 shrink-0" />;
      case 'vacancy':
        return <Briefcase size={11} className="text-amber-400 shrink-0" />;
      case 'press':
        return <Newspaper size={11} className="text-blue-400 shrink-0" />;
      default:
        return <Radio size={11} className="text-purple-400 shrink-0" />;
    }
  };

  return (
    <div className="w-full bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2 shadow-inner overflow-hidden mb-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex items-center gap-1 shrink-0">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[8px] font-black tracking-widest uppercase text-slate-400 hidden sm:inline">MERCADO EN VIVO</span>
        </div>

        <div className="h-3 w-[1px] bg-white/15 shrink-0" />

        {/* Contenedor con animación horizontal garantizada (1 sola línea) */}
        <div className="relative flex-grow min-w-0 h-5 overflow-hidden flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id || index}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis"
            >
              <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md border shrink-0 flex items-center gap-1 ${getTagColor(current.type)}`}>
                {getIcon(current.type)}
                {current.tag}
              </span>
              <span className="text-[10px] font-bold text-slate-200 truncate drop-shadow-sm">
                {current.text}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
