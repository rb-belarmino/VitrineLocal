import type { PreviewSiteConfig } from '../site-engine.types';

export function GastronomiaTemplate({ config }: { config: PreviewSiteConfig }) {
  const { businessName, content, contact, socialProof, gallery, theme } = config;
  const heroImage = gallery.heroImageUrl || gallery.photos[0];

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur text-stone-100 border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-serif font-bold text-amber-100">{businessName}</h1>
            <p className="text-xs text-amber-500 font-medium">
              {config.category || 'Restaurante & Gastronomia'}
            </p>
          </div>
          <a
            href={contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-amber-600 text-white hover:bg-amber-500 shadow-md transition-all"
          >
            <span>🛵</span>
            <span>Pedir / Reservar</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-stone-950 text-stone-100 relative">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800/40">
              <span>⭐ {socialProof.rating.toFixed(1)} no Google</span>
              <span>•</span>
              <span>{socialProof.reviewCount} avaliações</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              {content.headline}
            </h2>
            <p className="text-lg text-stone-300 leading-relaxed">{content.subheadline}</p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <a
                href={contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-full font-bold text-base text-white shadow-lg transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {content.callToAction || 'Fazer Pedido no WhatsApp'}
              </a>
            </div>
          </div>

          <div className="relative">
            {heroImage ? (
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-800 aspect-[4/3] bg-stone-900">
                <img src={heroImage} alt={businessName} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="rounded-3xl bg-stone-900 border border-stone-800 aspect-[4/3] flex items-center justify-center p-8 text-center text-stone-400 font-serif text-lg">
                Experiência gastronômica com ingredientes selecionados e sabor inesquecível.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-16 bg-stone-900 text-stone-100 border-y border-stone-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white">
              Nossas Especialidades
            </h3>
            <p className="text-stone-400 mt-2">
              Pratos preparados com carinho, técnica e os melhores insumos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.keyServices.map((service, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700/60 hover:border-amber-500/50 transition-all"
              >
                <div className="text-3xl mb-3">🍽️</div>
                <h4 className="text-lg font-bold text-amber-200 mb-2">{service}</h4>
                <p className="text-sm text-stone-400">
                  Receitas consagradas e avaliadas com nota máxima pelo público.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      {socialProof.testimonials && socialProof.testimonials.length > 0 && (
        <section className="py-16 bg-stone-950 text-stone-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white">
                Quem experimentou, recomenda
              </h3>
              <p className="text-stone-400 mt-2">Depoimentos reais postados no Google Maps.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {socialProof.testimonials.slice(0, 3).map((testimonial, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-stone-900 rounded-2xl border border-stone-800 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex text-amber-400 text-sm">
                      {'★'.repeat(testimonial.rating)}
                    </div>
                    <p className="text-sm text-stone-300 italic">"{testimonial.text}"</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-500">
                    <span className="font-semibold text-stone-300">{testimonial.authorName}</span>
                    <span>{testimonial.relativeTime || 'Google Maps'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto py-12 bg-black text-white border-t border-stone-900">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h4 className="text-lg font-serif font-bold text-amber-100">{businessName}</h4>
            <p className="text-sm text-stone-400 mt-1">{contact.address || 'Restaurante local'}</p>
            <p className="text-sm text-stone-400">
              Pedidos: {contact.phoneNormalized || contact.phoneRaw}
            </p>
          </div>
          <a
            href={contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full font-bold text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            Fazer Pedido no WhatsApp
          </a>
        </div>
      </footer>
    </div>
  );
}
