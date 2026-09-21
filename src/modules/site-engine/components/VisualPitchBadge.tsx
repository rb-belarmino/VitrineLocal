import type { PreviewVisualPitch } from '../site-engine.types';

interface VisualPitchBadgeProps {
  visualPitch: PreviewVisualPitch;
}

/**
 * Floating Pill discreta no topo superior direito com efeito backdrop-blur.
 * Não empurra o layout para baixo e mantém o hero 100% limpo e elegante.
 */
export function VisualPitchBadge({ visualPitch }: VisualPitchBadgeProps) {
  return (
    <aside
      aria-label="Aviso de Demonstração VitrineLocal"
      className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-2 rounded-full border border-stone-200/80 dark:border-stone-700/60 bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-stone-100 shadow-lg backdrop-blur-md transition-transform hover:scale-[1.03]"
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-[10px] font-black text-white shadow-sm">
        VL
      </div>
      <div className="text-xs flex items-center gap-2">
        <span className="font-semibold text-stone-800 dark:text-stone-200 hidden sm:inline">
          {visualPitch.badgeText}
        </span>
        <a
          href={visualPitch.ctaWhatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-bold text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>{visualPitch.ctaText}</span>
          <span>→</span>
        </a>
      </div>
    </aside>
  );
}

/**
 * Assinatura institucional de encerramento no rodapé da página.
 */
export function VisualPitchFooter({ visualPitch }: VisualPitchBadgeProps) {
  return (
    <div className="border-t border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-950 py-6 text-center text-xs text-stone-500 dark:text-stone-400">
      <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          Esta página é uma prévia desenvolvida por{' '}
          <strong className="text-stone-800 dark:text-stone-200">VitrineLocal</strong>.
        </p>
        <a
          href={visualPitch.ctaWhatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
        >
          <span>✨</span>
          <span>{visualPitch.ctaText}</span>
        </a>
      </div>
    </div>
  );
}
