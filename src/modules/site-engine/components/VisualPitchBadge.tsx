import type { PreviewVisualPitch } from '../site-engine.types';

interface VisualPitchBadgeProps {
  visualPitch: PreviewVisualPitch;
}

export function VisualPitchBadge({ visualPitch }: VisualPitchBadgeProps) {
  return (
    <aside
      aria-label="Aviso de Demonstração VitrineLocal"
      className="fixed bottom-4 right-4 z-50 flex max-w-sm items-center gap-3 rounded-2xl border border-slate-700/50 bg-slate-900/95 p-3.5 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 font-bold text-white shadow-md">
        VL
      </div>
      <div className="flex-1 text-xs">
        <p className="font-semibold text-slate-100">{visualPitch.badgeText}</p>
        <p className="text-[11px] text-slate-400">Design exclusivo e otimizado para conversão</p>
      </div>
      <a
        href={visualPitch.ctaWhatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white shadow-md transition-colors hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        {visualPitch.ctaText}
      </a>
    </aside>
  );
}
