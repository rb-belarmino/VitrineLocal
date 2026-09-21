import type { PreviewSiteConfig } from '../site-engine.types';
import { getNicheFallbackHeroImage } from '../core/template-fallbacks';
import { StickyMobileBar } from './StickyMobileBar';
import { VisualPitchFooter } from './VisualPitchBadge';

export function GastronomiaTemplate({ config }: { config: PreviewSiteConfig }) {
  const { businessName, content, contact, socialProof, gallery, theme, visualPitch } = config;
  
  // Resolve imagem de destaque com fallback em alta resolução do Unsplash CDN
  const heroImage =
    gallery.heroImageUrl ||
    gallery.photos[0] ||
    getNicheFallbackHeroImage('gastronomia', config.category, businessName);

  const mapsUrl = contact.address
    ? `https://maps.google.com/?q=${encodeURIComponent(contact.address)}`
    : undefined;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-stone-950 text-stone-100 pb-24 md:pb-0">
      {/* Header Sticky com Glassmorphism */}
      <header className="sticky top-0 z-30 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/80">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {gallery.logoUrl ? (
              <img
                src={gallery.logoUrl}
                alt={businessName}
                className="h-10 w-10 rounded-full object-cover border border-amber-500/30"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-600 to-red-600 flex items-center justify-center font-serif text-lg font-bold text-white shadow-md">
                {businessName.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-base sm:text-lg font-serif font-bold text-amber-100 tracking-tight leading-tight">
                {businessName}
              </h1>
              <p className="text-xs text-amber-500 font-medium">
                {config.category || 'Restaurante & Gastronomia'}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <a
              href={contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md transition-all hover:scale-[1.02]"
            >
              <span>🛵</span>
              <span>Pedir / Reservar</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section Split Imersivo */}
      <section className="relative py-12 lg:py-20 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Coluna Texto / Pitch */}
          <div className="lg:col-span-7 space-y-6">
            {/* Floating Proof Card Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-700/50 shadow-sm backdrop-blur">
              <span className="text-amber-400">★</span>
              <span>{socialProof.rating.toFixed(1)} no Google</span>
              <span className="text-amber-600">•</span>
              <span>{socialProof.reviewCount} avaliações</span>
              <span className="hidden sm:inline text-amber-600">•</span>
              <span className="hidden sm:inline text-emerald-400">● Aberto</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-[1.15]">
              {content.headline}
            </h2>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl">
              {content.subheadline}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <a
                href={contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: theme.primaryColor || '#DC2626' }}
                className="inline-flex justify-center items-center gap-2.5 px-7 py-4 rounded-full font-bold text-base text-white shadow-xl transition-all hover:brightness-110 active:scale-[0.98]"
              >
                <span>🛵</span>
                <span>{content.callToAction || 'Fazer Pedido no WhatsApp'}</span>
              </a>

              {contact.address && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center gap-2 px-6 py-4 rounded-full font-semibold text-sm text-stone-300 bg-stone-900/90 border border-stone-800 hover:border-amber-600/50 hover:text-white transition-all"
                >
                  <span>📍</span>
                  <span>Ver Localização</span>
                </a>
              )}
            </div>

            {/* Micro Prova Social */}
            <div className="pt-4 flex items-center gap-4 text-xs text-stone-400">
              <div className="flex items-center gap-1 text-amber-400">
                {'★★★★★'.slice(0, Math.round(socialProof.rating || 5))}
              </div>
              <span>Ingredientes selecionados &amp; receita autoral</span>
            </div>
          </div>

          {/* Coluna Imagem de Destaque com Floating Glass Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-800 aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5] bg-stone-900 group">
              <img
                src={heroImage}
                alt={businessName}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
              
              {/* Floating Badge sobre a Imagem */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-stone-950/85 backdrop-blur-md border border-stone-800/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-200">Sabor &amp; Tradição</p>
                  <p className="text-[11px] text-stone-400 truncate">{businessName}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-amber-400">
                    ★ {socialProof.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Especialidades / Pratos em Destaque */}
      <section className="py-16 bg-stone-900/90 border-y border-stone-800/80">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-wider text-amber-500 uppercase">
              Cardápio Selecionado
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Nossas Especialidades
            </h3>
            <p className="text-stone-400 mt-2 text-sm sm:text-base">
              Pratos e bebidas preparados com carinho, técnica apurada e os melhores insumos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.keyServices.map((service, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-stone-950/70 border border-stone-800 hover:border-amber-500/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">🍽️</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/50">
                      {idx === 0 ? 'Mais Pedido' : 'Especialidade'}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-amber-100 group-hover:text-amber-300 transition-colors mb-2">
                    {service}
                  </h4>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Receita consagrada da casa com alta avaliação entre nossos clientes.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-800/60 flex items-center justify-between text-xs text-amber-500 font-semibold">
                  <span>Pedir agora</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avaliações / Depoimentos Reais */}
      {socialProof.testimonials && socialProof.testimonials.length > 0 && (
        <section className="py-16 bg-stone-950">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold tracking-wider text-amber-500 uppercase">
                Opinião dos Clientes
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Quem experimenta, recomenda
              </h3>
              <p className="text-stone-400 mt-2 text-sm">
                Avaliações autênticas compartilhadas diretamente no Google Maps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {socialProof.testimonials.map((testimonial, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-stone-900/80 rounded-2xl border border-stone-800 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex text-amber-400 text-sm">
                      {'★'.repeat(testimonial.rating)}
                    </div>
                    <p className="text-sm text-stone-300 italic leading-relaxed">
                      &quot;{testimonial.text}&quot;
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-stone-800/70 flex items-center justify-between text-xs text-stone-400">
                    <span className="font-semibold text-stone-200">
                      {testimonial.authorName}
                    </span>
                    {testimonial.relativeTime && (
                      <span className="text-stone-500">{testimonial.relativeTime}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Seção Localização & Contato */}
      <section className="py-14 bg-stone-900 border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-bold tracking-wider text-amber-500 uppercase">
              Como Chegar
            </span>
            <h3 className="text-2xl font-serif font-bold text-white mt-1 mb-3">
              Visite nosso espaço ou faça seu pedido
            </h3>
            {contact.address && (
              <p className="text-sm text-stone-300 mb-2">
                📍 <strong>Endereço:</strong> {contact.address}
              </p>
            )}
            {contact.phoneRaw && (
              <p className="text-sm text-stone-300 mb-4">
                📞 <strong>Telefone:</strong> {contact.phoneRaw}
              </p>
            )}
            {contact.address && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-stone-800 text-stone-200 hover:bg-stone-700 hover:text-white transition-colors border border-stone-700"
              >
                <span>🗺️</span>
                <span>Abrir rota no Google Maps</span>
              </a>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 text-center md:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-serif font-bold text-white">Delivery &amp; Reservas</h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Atendimento ágil direto no WhatsApp
              </p>
            </div>
            <a
              href={contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: theme.primaryColor || '#DC2626' }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm text-white shadow-lg transition-transform hover:scale-105"
            >
              <span>💬</span>
              <span>Fazer Pedido</span>
            </a>
          </div>
        </div>
      </section>

      {/* Sticky Mobile Bar de Alta Conversão */}
      <StickyMobileBar
        whatsappLink={contact.whatsappLink}
        ctaText={content.callToAction || 'Fazer Pedido no WhatsApp'}
        niche="gastronomia"
        primaryColor={theme.primaryColor}
      />

      {/* Assinatura no Rodapé */}
      <VisualPitchFooter visualPitch={visualPitch} />
    </div>
  );
}
