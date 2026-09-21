import type { PreviewSiteConfig } from '../site-engine.types';

export function BelezaTemplate({ config }: { config: PreviewSiteConfig }) {
  const { businessName, content, contact, socialProof, gallery, theme } = config;
  const heroImage = gallery.heroImageUrl || gallery.photos[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-rose-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{businessName}</h1>
            <p className="text-xs text-rose-500 font-semibold">
              {config.category || 'Beleza & Estética'}
            </p>
          </div>
          <a
            href={contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-rose-500 text-white hover:bg-rose-600 shadow-sm transition-all"
          >
            <span>✨</span>
            <span>Agendar Horário</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-rose-50/70 to-white relative">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
              <span>⭐ {socialProof.rating.toFixed(1)} no Google</span>
              <span>•</span>
              <span>{socialProof.reviewCount} avaliações</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {content.headline}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">{content.subheadline}</p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <a
                href={contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-full font-bold text-base text-white shadow-lg transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {content.callToAction || 'Agendar no WhatsApp'}
              </a>
            </div>
          </div>

          <div className="relative">
            {heroImage ? (
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] bg-rose-100">
                <img src={heroImage} alt={businessName} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="rounded-3xl bg-rose-100 aspect-[4/3] flex items-center justify-center p-8 text-center text-rose-800 font-medium">
                Seu momento de autocuidado, estilo e transformação.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white border-y border-rose-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">
              Procedimentos & Especialidades
            </h3>
            <p className="text-slate-600 mt-2">
              Profissionais qualificados para realçar sua melhor versão.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.keyServices.map((service, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-rose-50/50 border border-rose-100/80 hover:border-rose-300 transition-all"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-4"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  ✦
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{service}</h4>
                <p className="text-sm text-slate-600">
                  Produtos premium e técnicas modernas para resultados impecáveis.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      {socialProof.testimonials && socialProof.testimonials.length > 0 && (
        <section className="py-16 bg-rose-50/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">
                Depoimentos das Nossas Clientes
              </h3>
              <p className="text-slate-600 mt-2">
                Experiências reais compartilhadas no Google Maps.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {socialProof.testimonials.slice(0, 3).map((testimonial, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-white rounded-2xl shadow-sm border border-rose-100 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex text-amber-400 text-sm">
                      {'★'.repeat(testimonial.rating)}
                    </div>
                    <p className="text-sm text-slate-700 italic">"{testimonial.text}"</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-rose-50 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">{testimonial.authorName}</span>
                    <span>{testimonial.relativeTime || 'Google Maps'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto py-12 bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h4 className="text-lg font-bold">{businessName}</h4>
            <p className="text-sm text-slate-400 mt-1">
              {contact.address || 'Espaço de estética local'}
            </p>
            <p className="text-sm text-slate-400">
              Agendamentos: {contact.phoneNormalized || contact.phoneRaw}
            </p>
          </div>
          <a
            href={contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full font-bold text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            Agendar no WhatsApp
          </a>
        </div>
      </footer>
    </div>
  );
}
