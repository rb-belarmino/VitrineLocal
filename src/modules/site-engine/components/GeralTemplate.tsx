import type { PreviewSiteConfig } from '../site-engine.types';
import { getNicheFallbackHeroImage } from '../core/template-fallbacks';
import { StickyMobileBar } from './StickyMobileBar';
import { VisualPitchFooter } from './VisualPitchBadge';

export function GeralTemplate({ config }: { config: PreviewSiteConfig }) {
  const { businessName, content, contact, socialProof, gallery, theme, visualPitch } = config;

  const heroImage =
    gallery.heroImageUrl ||
    gallery.photos[0] ||
    getNicheFallbackHeroImage('geral', config.category, businessName);

  const mapsUrl = contact.address
    ? `https://maps.google.com/?q=${encodeURIComponent(contact.address)}`
    : undefined;

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50 text-slate-900 pb-24 md:pb-0">
      {/* Header Sticky Modern Agency */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {gallery.logoUrl ? (
              <img
                src={gallery.logoUrl}
                alt={businessName}
                className="h-10 w-10 rounded-xl object-cover border border-blue-200"
              />
            ) : (
              <div
                style={{ backgroundColor: theme.primaryColor || '#2563EB' }}
                className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
              >
                ★
              </div>
            )}
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                {businessName}
              </h1>
              <p className="text-xs text-blue-600 font-medium">
                {config.category || 'Serviços & Atendimento Local'}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <a
              href={contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: theme.primaryColor || '#2563EB' }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white shadow-sm transition-all hover:scale-105"
            >
              <span>💬</span>
              <span>Falar Conosco</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section Split */}
      <section className="relative py-12 lg:py-20 bg-gradient-to-b from-white via-blue-50/30 to-slate-50 border-b border-slate-200/80 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100/80 text-blue-900 border border-blue-200">
              <span className="text-amber-500">★</span>
              <span>{socialProof.rating.toFixed(1)} no Google</span>
              <span className="text-blue-300">•</span>
              <span>{socialProof.reviewCount} avaliações</span>
              <span className="text-blue-300">•</span>
              <span>Atendimento Verificado</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              {content.headline}
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {content.subheadline}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <a
                href={contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: theme.primaryColor || '#2563EB' }}
                className="inline-flex justify-center items-center gap-2.5 px-7 py-4 rounded-full font-bold text-base text-white shadow-xl transition-all hover:brightness-110 active:scale-[0.98]"
              >
                <span>💬</span>
                <span>{content.callToAction || 'Falar no WhatsApp'}</span>
              </a>

              {contact.address && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center gap-2 px-6 py-4 rounded-full font-semibold text-sm text-slate-700 bg-white border border-slate-300 shadow-xs hover:border-blue-400 hover:text-blue-600 transition-all"
                >
                  <span>📍</span>
                  <span>Ver Endereço</span>
                </a>
              )}
            </div>

            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-blue-600">✓</span>
                <span>Qualidade garantida</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-blue-600">✓</span>
                <span>Resposta rápida</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-blue-600">✓</span>
                <span>Equipe dedicada</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5] bg-slate-100">
              <img
                src={heroImage}
                alt={businessName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Excelência Comprovada</p>
                  <p className="text-[11px] text-slate-500 truncate">{businessName}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-500">
                    ★ {socialProof.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Serviços */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
              Soluções Completas
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              O que oferecemos para você
            </h3>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Serviços prestados com máxima dedicação e compromisso com resultados.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.keyServices.map((service, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div
                    style={{ backgroundColor: theme.primaryColor || '#2563EB' }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm mb-4 shadow-xs"
                  >
                    ★
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    {service}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Atendimento consultivo e execução precisa adaptada às suas necessidades.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-blue-600 font-bold">
                  <span>Solicitar</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      {socialProof.testimonials && socialProof.testimonials.length > 0 && (
        <section className="py-16 bg-slate-100/80 border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                Prova Social
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Avaliações de Clientes
              </h3>
              <p className="text-slate-600 mt-2 text-sm">
                Feedback autêntico de clientes atendidos pelo nosso negócio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {socialProof.testimonials.map((testimonial, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex text-amber-400 text-sm">
                      {'★'.repeat(testimonial.rating)}
                    </div>
                    <p className="text-sm text-slate-700 italic leading-relaxed">
                      &quot;{testimonial.text}&quot;
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-800">
                      {testimonial.authorName}
                    </span>
                    {testimonial.relativeTime && <span>{testimonial.relativeTime}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contato & Localização */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
              Contato
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 mb-3">
              Entre em contato conosco
            </h3>
            {contact.address && (
              <p className="text-sm text-slate-600 mb-2">
                📍 <strong>Endereço:</strong> {contact.address}
              </p>
            )}
            {contact.phoneRaw && (
              <p className="text-sm text-slate-600 mb-4">
                📞 <strong>Telefone:</strong> {contact.phoneRaw}
              </p>
            )}
            {contact.address && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors border border-slate-300"
              >
                <span>🗺️</span>
                <span>Ver no Google Maps</span>
              </a>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 text-center md:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-bold text-slate-900">Atendimento Imediato</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Tire dúvidas ou peça um orçamento sem compromisso
              </p>
            </div>
            <a
              href={contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: theme.primaryColor || '#2563EB' }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm text-white shadow-md transition-transform hover:scale-105"
            >
              <span>💬</span>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Sticky Mobile Bar */}
      <StickyMobileBar
        whatsappLink={contact.whatsappLink}
        ctaText={content.callToAction || 'Falar no WhatsApp'}
        niche="geral"
        primaryColor={theme.primaryColor}
      />

      {/* Rodapé Institucional */}
      <VisualPitchFooter visualPitch={visualPitch} />
    </div>
  );
}
