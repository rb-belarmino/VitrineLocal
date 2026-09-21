import type { PreviewSiteConfig } from '../site-engine.types';
import { detectBelezaVariant, getNicheFallbackHeroImage } from '../core/template-fallbacks';
import { StickyMobileBar } from './StickyMobileBar';
import { VisualPitchFooter } from './VisualPitchBadge';

export function BelezaTemplate({ config }: { config: PreviewSiteConfig }) {
  const { businessName, content, contact, socialProof, gallery, theme, visualPitch } = config;

  // Detecta se é Barbearia Masculina ou o Default (Salão/Estética Feminina)
  const variant = detectBelezaVariant(config.category, businessName);
  const isBarbearia = variant === 'barbearia';

  const heroImage =
    gallery.heroImageUrl ||
    gallery.photos[0] ||
    getNicheFallbackHeroImage('beleza', config.category, businessName);

  const mapsUrl = contact.address
    ? `https://maps.google.com/?q=${encodeURIComponent(contact.address)}`
    : undefined;

  // Temas e tokens dinâmicos por variante
  const styles = isBarbearia
    ? {
        wrapper: 'bg-zinc-950 text-zinc-100',
        header: 'bg-zinc-950/90 border-zinc-800 text-white',
        badge: 'bg-amber-950/80 text-amber-400 border-amber-800/60',
        heroBg: 'bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950',
        cardBg: 'bg-zinc-900/90 border-zinc-800 hover:border-amber-500/50',
        cardIconBg: 'bg-amber-600/20 text-amber-400 border-amber-600/30',
        cardTag: 'bg-amber-950/80 text-amber-300 border-amber-800/50',
        accentColor: theme.primaryColor || '#D97706',
        ctaDefault: 'Agendar na Barbearia',
        icon: '💈',
        serviceTag: 'Corte & Barba',
      }
    : {
        wrapper: 'bg-rose-50/30 text-stone-800',
        header: 'bg-white/90 border-rose-100 text-stone-900',
        badge: 'bg-rose-100/90 text-rose-800 border-rose-200',
        heroBg: 'bg-gradient-to-b from-rose-50/70 via-white to-rose-50/30',
        cardBg: 'bg-white border-rose-100 hover:border-rose-300 hover:shadow-md',
        cardIconBg: 'bg-rose-100 text-rose-700 border-rose-200',
        cardTag: 'bg-rose-100 text-rose-700 border-rose-200',
        accentColor: theme.primaryColor || '#BE185D',
        ctaDefault: 'Reservar Horário no WhatsApp',
        icon: '✨',
        serviceTag: 'Procedimento Exclusivo',
      };

  return (
    <div className={`flex flex-col min-h-screen font-sans pb-24 md:pb-0 ${styles.wrapper}`}>
      {/* Header Sticky */}
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b ${styles.header}`}>
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {gallery.logoUrl ? (
              <img
                src={gallery.logoUrl}
                alt={businessName}
                className="h-10 w-10 rounded-full object-cover border border-rose-200/50"
              />
            ) : (
              <div
                style={{ backgroundColor: styles.accentColor }}
                className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm text-sm"
              >
                {styles.icon}
              </div>
            )}
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight leading-tight">
                {businessName}
              </h1>
              <p className="text-xs opacity-75 font-medium">
                {config.category || (isBarbearia ? 'Barbearia & Barbaterapia' : 'Salão de Beleza & Estética')}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <a
              href={contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: styles.accentColor }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white shadow-sm transition-all hover:scale-105"
            >
              <span>{styles.icon}</span>
              <span>Agendar Horário</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section Editorial */}
      <section className={`relative py-12 lg:py-20 border-b border-black/5 overflow-hidden ${styles.heroBg}`}>
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div
              className={`${styles.badge} inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold border shadow-xs backdrop-blur`}
            >
              <span className="text-amber-400">★</span>
              <span>{socialProof.rating.toFixed(1)} no Google</span>
              <span>•</span>
              <span>{socialProof.reviewCount} avaliações</span>
              <span>•</span>
              <span>{isBarbearia ? 'Atendimento Premium' : 'Espaço Exclusivo'}</span>
            </div>

            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] ${isBarbearia ? 'text-white' : 'text-stone-900'}`}>
              {content.headline}
            </h2>

            <p className={`text-base sm:text-lg leading-relaxed max-w-2xl ${isBarbearia ? 'text-zinc-300' : 'text-stone-600'}`}>
              {content.subheadline}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <a
                href={contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: styles.accentColor }}
                className="inline-flex justify-center items-center gap-2.5 px-7 py-4 rounded-full font-bold text-base text-white shadow-xl transition-all hover:brightness-110 active:scale-[0.98]"
              >
                <span>{styles.icon}</span>
                <span>{content.callToAction || styles.ctaDefault}</span>
              </a>

              {contact.address && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex justify-center items-center gap-2 px-6 py-4 rounded-full font-semibold text-sm transition-all border ${
                    isBarbearia
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-rose-300 shadow-xs'
                  }`}
                >
                  <span>📍</span>
                  <span>Ver Localização</span>
                </a>
              )}
            </div>

            {/* Destaque Editorial */}
            <div className={`pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs ${isBarbearia ? 'text-zinc-400' : 'text-stone-500'}`}>
              <div className="flex items-center gap-2">
                <span>✦</span>
                <span>{isBarbearia ? 'Toalha quente' : 'Cosméticos de alta linha'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✦</span>
                <span>{isBarbearia ? 'Cerveja & Café cortesia' : 'Ambiente instagramável'}</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span>✦</span>
                <span>Profissionais especialistas</span>
              </div>
            </div>
          </div>

          {/* Coluna Imagem / Galeria */}
          <div className="lg:col-span-5 relative">
            <div className={`relative rounded-3xl overflow-hidden shadow-2xl border aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5] ${
              isBarbearia ? 'border-zinc-800 bg-zinc-900' : 'border-white bg-rose-100'
            }`}>
              <img
                src={heroImage}
                alt={businessName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className={`absolute bottom-4 left-4 right-4 p-4 rounded-2xl backdrop-blur-md border shadow-lg flex items-center justify-between ${
                isBarbearia ? 'bg-zinc-950/85 border-zinc-800 text-zinc-100' : 'bg-white/90 border-white text-stone-900'
              }`}>
                <div>
                  <p className="text-xs font-bold">{isBarbearia ? 'Tradição & Estilo' : 'Realce sua Beleza'}</p>
                  <p className="text-[11px] opacity-75 truncate">{businessName}</p>
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

      {/* Serviços / Procedimentos */}
      <section className={`py-16 border-b ${isBarbearia ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white border-rose-100'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className={`text-xs font-bold tracking-wider uppercase ${isBarbearia ? 'text-amber-500' : 'text-rose-600'}`}>
              Menu de Experiências
            </span>
            <h3 className={`text-2xl sm:text-3xl font-bold mt-1 ${isBarbearia ? 'text-white' : 'text-stone-900'}`}>
              Procedimentos &amp; Especialidades
            </h3>
            <p className={`mt-2 text-sm sm:text-base ${isBarbearia ? 'text-zinc-400' : 'text-stone-600'}`}>
              Cuidado minucioso em cada detalhe para transformar seu visual e autoestima.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.keyServices.map((service, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between group ${styles.cardBg}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border ${styles.cardIconBg}`}>
                      {styles.icon}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles.cardTag}`}>
                      {styles.serviceTag}
                    </span>
                  </div>
                  <h4 className={`text-base font-bold mb-2 ${isBarbearia ? 'text-zinc-100 group-hover:text-amber-300' : 'text-stone-900 group-hover:text-rose-700'}`}>
                    {service}
                  </h4>
                  <p className={`text-xs leading-relaxed ${isBarbearia ? 'text-zinc-400' : 'text-stone-500'}`}>
                    Técnicas exclusivas e produtos de alta qualidade para um resultado duradouro.
                  </p>
                </div>

                <div className={`mt-5 pt-3 border-t flex items-center justify-between text-xs font-bold ${
                  isBarbearia ? 'border-zinc-800 text-amber-500' : 'border-rose-100 text-rose-600'
                }`}>
                  <span>Agendar este</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avaliações */}
      {socialProof.testimonials && socialProof.testimonials.length > 0 && (
        <section className={`py-16 border-b ${isBarbearia ? 'bg-zinc-950 border-zinc-800' : 'bg-rose-50/40 border-rose-100'}`}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className={`text-xs font-bold tracking-wider uppercase ${isBarbearia ? 'text-amber-500' : 'text-rose-600'}`}>
                {isBarbearia ? 'Opinião dos Clientes' : 'Depoimentos das Nossas Clientes'}
              </span>
              <h3 className={`text-2xl sm:text-3xl font-bold mt-1 ${isBarbearia ? 'text-white' : 'text-stone-900'}`}>
                Quem conhece, vira cliente fiel
              </h3>
              <p className={`mt-2 text-sm ${isBarbearia ? 'text-zinc-400' : 'text-stone-600'}`}>
                Avaliações autênticas compartilhadas diretamente no Google Maps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {socialProof.testimonials.map((testimonial, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border flex flex-col justify-between ${
                    isBarbearia ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-rose-100 shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex text-amber-400 text-sm">
                      {'★'.repeat(testimonial.rating)}
                    </div>
                    <p className={`text-sm italic leading-relaxed ${isBarbearia ? 'text-zinc-300' : 'text-stone-700'}`}>
                      &quot;{testimonial.text}&quot;
                    </p>
                  </div>
                  <div className={`mt-4 pt-4 border-t flex items-center justify-between text-xs ${
                    isBarbearia ? 'border-zinc-800 text-zinc-400' : 'border-rose-100 text-stone-500'
                  }`}>
                    <span className="font-bold">{testimonial.authorName}</span>
                    {testimonial.relativeTime && <span>{testimonial.relativeTime}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Localização & Reserva */}
      <section className={`py-14 ${isBarbearia ? 'bg-zinc-900' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className={`text-xs font-bold tracking-wider uppercase ${isBarbearia ? 'text-amber-500' : 'text-rose-600'}`}>
              Espaço &amp; Atendimento
            </span>
            <h3 className={`text-2xl font-bold mt-1 mb-3 ${isBarbearia ? 'text-white' : 'text-stone-900'}`}>
              Venha relaxar e renovar seu estilo
            </h3>
            {contact.address && (
              <p className={`text-sm mb-2 ${isBarbearia ? 'text-zinc-300' : 'text-stone-600'}`}>
                📍 <strong>Endereço:</strong> {contact.address}
              </p>
            )}
            {contact.phoneRaw && (
              <p className={`text-sm mb-4 ${isBarbearia ? 'text-zinc-300' : 'text-stone-600'}`}>
                📞 <strong>Telefone:</strong> {contact.phoneRaw}
              </p>
            )}
            {contact.address && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
                  isBarbearia
                    ? 'bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700'
                    : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                }`}
              >
                <span>🗺️</span>
                <span>Ver no Google Maps</span>
              </a>
            )}
          </div>

          <div className={`p-6 rounded-2xl border text-center md:text-left flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isBarbearia ? 'bg-zinc-950 border-zinc-800' : 'bg-rose-50/70 border-rose-200 shadow-xs'
          }`}>
            <div>
              <h4 className={`text-lg font-bold ${isBarbearia ? 'text-white' : 'text-stone-900'}`}>
                {isBarbearia ? 'Agende seu Corte' : 'Agende seu Momento'}
              </h4>
              <p className={`text-xs mt-0.5 ${isBarbearia ? 'text-zinc-400' : 'text-stone-600'}`}>
                Consulte horários vagos direto pelo WhatsApp
              </p>
            </div>
            <a
              href={contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: styles.accentColor }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm text-white shadow-md transition-transform hover:scale-105"
            >
              <span>{styles.icon}</span>
              <span>Reservar</span>
            </a>
          </div>
        </div>
      </section>

      {/* Sticky Mobile Bar */}
      <StickyMobileBar
        whatsappLink={contact.whatsappLink}
        ctaText={content.callToAction || styles.ctaDefault}
        niche="beleza"
        primaryColor={styles.accentColor}
      />

      {/* Rodapé Institucional */}
      <VisualPitchFooter visualPitch={visualPitch} />
    </div>
  );
}
