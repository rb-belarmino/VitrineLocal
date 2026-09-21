interface StickyMobileBarProps {
  whatsappLink: string;
  ctaText?: string;
  niche?: string;
  primaryColor?: string;
}

export function StickyMobileBar({
  whatsappLink,
  ctaText,
  niche,
  primaryColor,
}: StickyMobileBarProps) {
  const defaultLabel = (() => {
    switch (niche) {
      case 'gastronomia':
        return 'Pedir pelo WhatsApp';
      case 'saude':
        return 'Agendar Consulta no WhatsApp';
      case 'automotivo':
        return 'Solicitar Orçamento no WhatsApp';
      case 'beleza':
        return 'Reservar Horário no WhatsApp';
      default:
        return 'Falar no WhatsApp';
    }
  })();

  const label = ctaText || defaultLabel;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-3 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 shadow-[0_-4px_16px_rgba(0,0,0,0.12)] md:hidden">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        style={primaryColor ? { backgroundColor: primaryColor } : undefined}
        className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-full font-bold text-base text-white bg-emerald-600 hover:bg-emerald-500 shadow-md active:scale-[0.98] transition-all"
      >
        <span className="text-xl">💬</span>
        <span>{label}</span>
      </a>
    </div>
  );
}
