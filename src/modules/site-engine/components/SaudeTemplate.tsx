import type { PreviewSiteConfig } from '../site-engine.types';
import { getNicheFallbackHeroImage } from '../core/template-fallbacks';
import { StickyMobileBar } from './StickyMobileBar';
import { VisualPitchFooter } from './VisualPitchBadge';

export function SaudeTemplate({ config }: { config: PreviewSiteConfig }) {
  const { businessName, content, contact, socialProof, gallery, theme, visualPitch } = config;

  const heroImage =
    gallery.heroImageUrl ||
    gallery.photos[0] ||
    getNicheFallbackHeroImage('saude', config.category, businessName);

  const mapsUrl = contact.address
    ? `https://maps.google.com/?q=${encodeURIComponent(contact.address)}`
    : undefined;

  const faqs = [
    {
      q: 'Como funciona a primeira avaliação?',
      a: 'A primeira consulta inclui anamnese detalhada, exame clínico minucioso e planejamento personalizado para o seu caso.',
    },
    {
      q: 'Aceitam convênios ou reembolso médico/odontológico?',
      a: 'Emitimos toda a documentação comprobatória e relatórios técnicos necessários para reembolso facilitado junto ao seu plano.',
    },
    {
      q: 'Quais são as facilidades de pagamento?',
      a: 'Trabalhamos com condições facilitadas no cartão de crédito, PIX e opções de parcelamento conforme o procedimento.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50 text-slate-800 pb-24 md:pb-0">
      {/* Header Sticky Clínico */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {gallery.logoUrl ? (
              <img
                src={gallery.logoUrl}
                alt={businessName}
                className="h-10 w-10 rounded-xl object-cover border border-sky-200"
              />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-600 flex items-center justify-center font-bold text-white shadow-sm">
                ✚
              </div>
            )}
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                {businessName}
              </h1>
              <p className="text-xs text-sky-700 font-medium">
                {config.category || 'Saúde & Cuidados Médicos'}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <a
              href={contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: theme.primaryColor || '#0284C7' }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-sm transition-all hover:brightness-105 hover:scale-[1.02]"
            >
              <span>📅</span>
              <span>Agendar Consulta</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section Clean Clinic */}
      <section className="relative py-12 lg:py-20 bg-gradient-to-b from-white via-sky-50/50 to-slate-50 overflow-hidden border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200/80">
                <span className="text-amber-500">★</span>
                <span>{socialProof.rating.toFixed(1)} no Google</span>
                <span className="text-sky-300">•</span>
                <span>{socialProof.reviewCount} avaliações</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200/80">
                <span>🛡️</span>
                <span>Biossegurança Rigorosa</span>
              </div>
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
                style={{ backgroundColor: theme.primaryColor || '#0284C7' }}
                className="inline-flex justify-center items-center gap-2.5 px-7 py-4 rounded-full font-bold text-base text-white shadow-lg transition-all hover:brightness-105 active:scale-[0.98]"
              >
                <span>📅</span>
                <span>{content.callToAction || 'Agendar Avaliação no WhatsApp'}</span>
              </a>

              {contact.address && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center gap-2 px-6 py-4 rounded-full font-semibold text-sm text-slate-700 bg-white border border-slate-200 shadow-sm hover:border-sky-300 hover:text-sky-700 transition-all"
                >
                  <span>📍</span>
                  <span>Ver Consultório</span>
                </a>
              )}
            </div>

            {/* Selos de Credibilidade */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-sky-600 text-base">🔬</span>
                <span>Tecnologia diagnóstica</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-teal-600 text-base">🤝</span>
                <span>Cuidado sem dor</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <span className="text-sky-600 text-base">📋</span>
                <span>Plano sob medida</span>
              </div>
            </div>
          </div>

          {/* Imagem de Destaque com Moldura Suave */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5] bg-slate-100">
              <img
                src={heroImage}
                alt={businessName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Corpo Clínico Certificado</p>
                  <p className="text-[11px] text-slate-500">Atendimento com pontualidade</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Procedimentos & Especialidades */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-wider text-sky-600 uppercase">
              Áreas de Atuação
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Tratamentos &amp; Especialidades
            </h3>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Procedimentos planejados com rigor técnico, conforto absoluto e os melhores materiais.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.keyServices.map((service, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold mb-4 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    {service}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Técnicas atualizadas e protocolo clínico personalizado para os melhores resultados.
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-sky-600 font-semibold">
                  <span>Saiba mais</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos de Pacientes */}
      {socialProof.testimonials && socialProof.testimonials.length > 0 && (
        <section className="py-16 bg-slate-100/70 border-b border-slate-200/70">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold tracking-wider text-sky-600 uppercase">
                Depoimentos Reais
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                A confiança de quem já se tratou conosco
              </h3>
              <p className="text-slate-600 mt-2 text-sm">
                Opiniões espontâneas registradas por nossos pacientes no Google Maps.
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
                    {testimonial.relativeTime && (
                      <span>{testimonial.relativeTime}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Seção FAQ - Acordeão Nativo HTML <details> e <summary> */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-wider text-sky-600 uppercase">
              Tire suas dúvidas
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Dúvidas Frequentes
            </h3>
            <p className="text-slate-600 mt-2 text-sm">
              Informações transparentes sobre atendimento, planos e procedimentos.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-sky-300 open:bg-white open:shadow-sm"
              >
                <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900 text-sm sm:text-base list-none select-none">
                  <span>{faq.q}</span>
                  <span className="ml-3 shrink-0 rounded-full bg-slate-200 p-1 text-xs text-slate-600 transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Localização & Agendamento */}
      <section className="py-14 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-bold tracking-wider text-sky-600 uppercase">
              Localização
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 mb-3">
              Consultório com estacionamento e acessibilidade
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-white text-slate-800 hover:bg-slate-100 transition-colors border border-slate-300 shadow-xs"
              >
                <span>🗺️</span>
                <span>Abrir rota no Google Maps</span>
              </a>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center md:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-bold text-slate-900">Agende sua Consulta</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Escolha o melhor dia e horário via WhatsApp
              </p>
            </div>
            <a
              href={contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: theme.primaryColor || '#0284C7' }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm text-white shadow-md transition-transform hover:scale-105"
            >
              <span>📅</span>
              <span>Agendar</span>
            </a>
          </div>
        </div>
      </section>

      {/* Sticky Mobile Bar */}
      <StickyMobileBar
        whatsappLink={contact.whatsappLink}
        ctaText={content.callToAction || 'Agendar Consulta no WhatsApp'}
        niche="saude"
        primaryColor={theme.primaryColor}
      />

      {/* Rodapé Institucional */}
      <VisualPitchFooter visualPitch={visualPitch} />
    </div>
  );
}
