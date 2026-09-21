import type { PreviewSiteConfig } from '../site-engine.types';

export function AutomotivoTemplate({ config }: { config: PreviewSiteConfig }) {
  const { businessName, content, contact, socialProof, gallery, theme } = config;
  const heroImage = gallery.heroImageUrl || gallery.photos[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-wider uppercase text-white">
              {businessName}
            </h1>
            <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
              {config.category || 'Centro Automotivo & Oficina'}
            </p>
          </div>
          <a
            href={contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-black uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all"
          >
            <span>⚡</span>
            <span>Orçamento Rápido</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-slate-950 text-white relative">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <span>⭐ {socialProof.rating.toFixed(1)} no Google</span>
              <span>•</span>
              <span>{socialProof.reviewCount} avaliações</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              {content.headline}
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">{content.subheadline}</p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <a
                href={contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center gap-2 px-6 py-4 rounded-xl font-black text-sm uppercase tracking-wider text-white shadow-lg transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {content.callToAction || 'Chamar no WhatsApp'}
              </a>
            </div>
          </div>

          <div className="relative">
            {heroImage ? (
              <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-800 aspect-[4/3] bg-slate-900">
                <img src={heroImage} alt={businessName} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-900 border border-slate-800 aspect-[4/3] flex items-center justify-center p-8 text-center text-slate-400 font-bold uppercase tracking-wider">
                Oficina Mecânica Especializada • Diagnóstico & Revisão
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl lg:text-3xl font-black uppercase text-white">
              Nossos Serviços Automotivos
            </h3>
            <p className="text-slate-400 mt-2">
              Tecnologia, peças de procedência e garantia total de mão de obra.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.keyServices.map((service, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-amber-400/50 transition-all"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-400 text-slate-950 font-black mb-4">
                  ⚙
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{service}</h4>
                <p className="text-sm text-slate-400">
                  Atendimento transparente e diagnóstico preciso para o seu veículo.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      {socialProof.testimonials && socialProof.testimonials.length > 0 && (
        <section className="py-16 bg-slate-950 text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h3 className="text-2xl lg:text-3xl font-black uppercase text-white">
                Opinião de Quem Confia
              </h3>
              <p className="text-slate-400 mt-2">Avaliações reais de motoristas no Google Maps.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {socialProof.testimonials.slice(0, 3).map((testimonial, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex text-amber-400 text-sm">
                      {'★'.repeat(testimonial.rating)}
                    </div>
                    <p className="text-sm text-slate-300 italic">"{testimonial.text}"</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-300">{testimonial.authorName}</span>
                    <span>{testimonial.relativeTime || 'Google Maps'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto py-12 bg-black text-white border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h4 className="text-lg font-black uppercase">{businessName}</h4>
            <p className="text-sm text-slate-400 mt-1">{contact.address || 'Oficina local'}</p>
            <p className="text-sm text-slate-400">
              Contato: {contact.phoneNormalized || contact.phoneRaw}
            </p>
          </div>
          <a
            href={contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl font-black uppercase text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            Orçamento no WhatsApp
          </a>
        </div>
      </footer>
    </div>
  );
}
