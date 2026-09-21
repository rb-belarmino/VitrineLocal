import type { PreviewSiteConfig } from '../site-engine.types';
import { getNicheFallbackHeroImage } from '../core/template-fallbacks';
import { StickyMobileBar } from './StickyMobileBar';
import { VisualPitchFooter } from './VisualPitchBadge';

export function AutomotivoTemplate({ config }: { config: PreviewSiteConfig }) {
  const { businessName, content, contact, socialProof, gallery, theme, visualPitch } = config;

  const heroImage =
    gallery.heroImageUrl ||
    gallery.photos[0] ||
    getNicheFallbackHeroImage('automotivo', config.category, businessName);

  const mapsUrl = contact.address
    ? `https://maps.google.com/?q=${encodeURIComponent(contact.address)}`
    : undefined;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-950 text-slate-100 pb-24 md:pb-0">
      {/* Header Dark Industrial */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {gallery.logoUrl ? (
              <img
                src={gallery.logoUrl}
                alt={businessName}
                className="h-10 w-10 rounded-xl object-cover border border-orange-500/40"
              />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-slate-950 shadow-md">
                ⚙️
              </div>
            )}
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-wider uppercase text-white leading-tight">
                {businessName}
              </h1>
              <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">
                {config.category || 'Centro Automotivo & Oficina Mecânica'}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <a
              href={contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: theme.primaryColor || '#EA580C' }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-md transition-all hover:brightness-110 hover:scale-[1.02]"
            >
              <span>⚡</span>
              <span>Orçamento Rápido</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section Dark Industrial */}
      <section className="relative py-12 lg:py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold bg-orange-950/80 text-orange-400 border border-orange-600/40">
                <span className="text-amber-400">★</span>
                <span>{socialProof.rating.toFixed(1)} no Google</span>
                <span className="text-orange-600">•</span>
                <span>{socialProof.reviewCount} motoristas atendidos</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                <span>🛡️</span>
                <span>Garantia em Peças e Serviços</span>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-[1.15]">
              {content.headline}
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {content.subheadline}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <a
                href={contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: theme.primaryColor || '#EA580C' }}
                className="inline-flex justify-center items-center gap-2.5 px-7 py-4 rounded-xl font-black text-sm uppercase tracking-wider text-white shadow-xl transition-all hover:brightness-110 active:scale-[0.98]"
              >
                <span>⚡</span>
                <span>{content.callToAction || 'Solicitar Orçamento no WhatsApp'}</span>
              </a>

              {contact.address && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center gap-2 px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-300 bg-slate-900 border border-slate-700 hover:border-orange-500/50 hover:text-white transition-all"
                >
                  <span>📍</span>
                  <span>Ver Rota da Oficina</span>
                </a>
              )}
            </div>

            {/* Selos de Confiança Técnica */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-orange-400 text-base">💻</span>
                <span>Diagnóstico Computadorizado</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-orange-400 text-base">🔩</span>
                <span>Peças Originais</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-orange-400 text-base">⏱️</span>
                <span>Agilidade na Entrega</span>
              </div>
            </div>
          </div>

          {/* Imagem de Destaque da Oficina */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-800 aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5] bg-slate-900">
              <img
                src={heroImage}
                alt={businessName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase text-orange-400">Oficina Credenciada</p>
                  <p className="text-[11px] text-slate-400 truncate">{businessName}</p>
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

      {/* Grid de Serviços Automotivos */}
      <section className="py-16 bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black tracking-widest text-orange-500 uppercase">
              Serviços Especializados
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white mt-1">
              Manutenção Preventiva &amp; Corretiva
            </h3>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              Mão de obra qualificada e ferramentas de precisão para todas as marcas nacionais e importadas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.keyServices.map((service, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-orange-500/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-600/20 text-orange-400 border border-orange-600/30 text-lg font-black mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    ⚙️
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">
                    {service}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Inspeção criteriosa, peças de procedência e relatório transparente de serviços.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-orange-400 font-bold uppercase tracking-wider">
                  <span>Consultar</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos de Motoristas */}
      {socialProof.testimonials && socialProof.testimonials.length > 0 && (
        <section className="py-16 bg-slate-950 border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-black tracking-widest text-orange-500 uppercase">
                Avaliações de Clientes
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white mt-1">
                A Opinião de Quem Confia
              </h3>
              <p className="text-slate-400 mt-2 text-sm">
                Feedback autêntico extraído diretamente do perfil da oficina no Google Maps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {socialProof.testimonials.map((testimonial, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex text-amber-400 text-sm">
                      {'★'.repeat(testimonial.rating)}
                    </div>
                    <p className="text-sm text-slate-300 italic leading-relaxed">
                      &quot;{testimonial.text}&quot;
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold text-slate-200">
                      {testimonial.authorName}
                    </span>
                    {testimonial.relativeTime && (
                      <span className="text-slate-500">{testimonial.relativeTime}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Localização & Socorro Rápido */}
      <section className="py-14 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-black tracking-widest text-orange-500 uppercase">
              Onde Estamos
            </span>
            <h3 className="text-2xl font-black uppercase text-white mt-1 mb-3">
              Fácil acesso e estrutura completa
            </h3>
            {contact.address && (
              <p className="text-sm text-slate-300 mb-2">
                📍 <strong>Endereço:</strong> {contact.address}
              </p>
            )}
            {contact.phoneRaw && (
              <p className="text-sm text-slate-300 mb-4">
                📞 <strong>Telefone:</strong> {contact.phoneRaw}
              </p>
            )}
            {contact.address && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-800 text-white hover:bg-slate-700 transition-colors border border-slate-700"
              >
                <span>🗺️</span>
                <span>Abrir rota no Google Maps</span>
              </a>
            )}
          </div>

          <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center md:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-black uppercase text-white">Precisa de Guincho ou Socorro?</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Chame nossa equipe imediatamente via WhatsApp
              </p>
            </div>
            <a
              href={contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: theme.primaryColor || '#EA580C' }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-black uppercase text-xs tracking-wider text-white shadow-lg transition-transform hover:scale-105"
            >
              <span>⚡</span>
              <span>Pedir Socorro</span>
            </a>
          </div>
        </div>
      </section>

      {/* Sticky Mobile Bar */}
      <StickyMobileBar
        whatsappLink={contact.whatsappLink}
        ctaText={content.callToAction || 'Solicitar Orçamento no WhatsApp'}
        niche="automotivo"
        primaryColor={theme.primaryColor}
      />

      {/* Rodapé Institucional */}
      <VisualPitchFooter visualPitch={visualPitch} />
    </div>
  );
}
