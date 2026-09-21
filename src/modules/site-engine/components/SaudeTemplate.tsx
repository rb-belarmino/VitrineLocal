import type { PreviewSiteConfig } from '../site-engine.types';

export function SaudeTemplate({ config }: { config: PreviewSiteConfig }) {
  const { businessName, content, contact, socialProof, gallery, theme } = config;
  const heroImage = gallery.heroImageUrl || gallery.photos[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header / Nav */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{businessName}</h1>
            <p className="text-xs text-slate-500 font-medium">
              {config.category || 'Saúde & Bem-Estar'}
            </p>
          </div>
          <a
            href={contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-95"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <span>📅</span>
            <span>Agendar Consulta</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-b from-slate-100 to-slate-50">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
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
                className="inline-flex justify-center items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-base text-white shadow-lg transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {content.callToAction || 'Fale Conosco pelo WhatsApp'}
              </a>
            </div>
          </div>

          {/* Hero Image Showcase */}
          <div className="relative">
            {heroImage ? (
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-slate-200">
                <img src={heroImage} alt={businessName} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="rounded-3xl bg-slate-200 aspect-[4/3] flex items-center justify-center p-8 text-center text-slate-500 font-medium">
                Espaço dedicado à saúde, acolhimento e bem-estar.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services / Differentiators */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">
              Nossos Serviços & Especialidades
            </h3>
            <p className="text-slate-600 mt-2">
              Diferenciais pensados para sua segurança, conforto e bem-estar integral.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.keyServices.map((service, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold mb-4"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  ✓
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{service}</h4>
                <p className="text-sm text-slate-600">
                  Compromisso comprovado com a excelência clínica e atendimento humanizado.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {socialProof.testimonials && socialProof.testimonials.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">
                O que nossos pacientes dizem
              </h3>
              <p className="text-slate-600 mt-2">Avaliações reais verificadas no Google Maps.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {socialProof.testimonials.slice(0, 3).map((testimonial, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex text-amber-400 text-sm">
                      {'★'.repeat(testimonial.rating)}
                    </div>
                    <p className="text-sm text-slate-700 italic">"{testimonial.text}"</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
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
      <footer className="mt-auto py-12 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h4 className="text-lg font-bold">{businessName}</h4>
            <p className="text-sm text-slate-400 mt-1">{contact.address || 'Endereço local'}</p>
            <p className="text-sm text-slate-400">
              Telefone: {contact.phoneNormalized || contact.phoneRaw}
            </p>
          </div>
          <a
            href={contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl font-bold text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            Falar no WhatsApp
          </a>
        </div>
      </footer>
    </div>
  );
}
