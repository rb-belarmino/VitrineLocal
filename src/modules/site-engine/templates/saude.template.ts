import { NicheTemplate } from './niche-template.interface';
import { NicheTheme, PreviewSiteConfig } from '../site-engine.types';
import { HtmlSanitizer } from '../core/html-sanitizer';

export class SaudeTemplate implements NicheTemplate {
  public readonly niche: NicheTheme = 'saude';

  public render(config: PreviewSiteConfig): string {
    const businessName = HtmlSanitizer.escape(config.businessName);
    const category = HtmlSanitizer.escape(config.category);
    const headline = HtmlSanitizer.escape(config.content.headline);
    const subheadline = HtmlSanitizer.escape(config.content.subheadline);
    const aboutText = HtmlSanitizer.escape(config.content.aboutText);
    const callToAction = HtmlSanitizer.escape(config.content.callToAction);
    const whatsappLink = HtmlSanitizer.sanitizeUrl(config.contact.whatsappLink);
    const address = config.contact.address ? HtmlSanitizer.escape(config.contact.address) : null;
    const phone = config.contact.phoneRaw ? HtmlSanitizer.escape(config.contact.phoneRaw) : null;
    const heroImage = config.gallery.heroImageUrl
      ? HtmlSanitizer.sanitizeUrl(config.gallery.heroImageUrl)
      : null;

    const servicesHtml = config.content.keyServices
      .map(
        (service) => `
        <div class="service-card" style="padding: 1.5rem; background: #ffffff; border-radius: 8px; border-left: 4px solid var(--brand-primary); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--brand-text);">${HtmlSanitizer.escape(service)}</h3>
          <p style="color: #64748b; font-size: 0.875rem;">Atendimento especializado com foco no bem-estar e na sua saúde.</p>
        </div>`,
      )
      .join('\n');

    const testimonialsHtml = config.socialProof.testimonials
      .map(
        (t) => `
        <div class="testimonial-card" style="padding: 1.5rem; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="color: #f59e0b; margin-bottom: 0.5rem;">${'★'.repeat(t.rating)}</div>
          <p style="font-style: italic; color: #334155; margin-bottom: 0.75rem;">"${HtmlSanitizer.escape(t.text)}"</p>
          <p style="font-weight: 600; font-size: 0.875rem; color: var(--brand-text);">- ${HtmlSanitizer.escape(t.authorName)}</p>
        </div>`,
      )
      .join('\n');

    return `
    <header style="background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%); color: #ffffff; padding: 4rem 1.5rem; text-align: center;">
      <div style="max-width: 900px; margin: 0 auto;">
        <span style="display: inline-block; background: rgba(255,255,255,0.2); padding: 0.25rem 1rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 500; margin-bottom: 1rem;">${category}</span>
        <h1 style="font-size: 2.5rem; font-weight: 800; line-height: 1.2; margin-bottom: 1rem;">${businessName}</h1>
        <h2 style="font-size: 1.5rem; font-weight: 400; opacity: 0.95; margin-bottom: 1.5rem;">${headline}</h2>
        <p style="font-size: 1.125rem; opacity: 0.85; max-width: 650px; margin: 0 auto 2rem auto;">${subheadline}</p>
        <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #ffffff; color: var(--brand-primary); font-weight: 700; padding: 0.875rem 2rem; border-radius: 8px; text-decoration: none; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
          ${callToAction} (Agendamento Online)
        </a>
      </div>
    </header>

    ${
      heroImage
        ? `<div style="max-width: 1000px; margin: -2rem auto 2rem auto; padding: 0 1rem;">
             <img src="${heroImage}" alt="${businessName}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);" />
           </div>`
        : ''
    }

    <main style="max-width: 1100px; margin: 0 auto; padding: 3rem 1.5rem;">
      <!-- Sobre e Diferenciais -->
      <section style="margin-bottom: 4rem;">
        <h2 style="font-size: 2rem; font-weight: 700; color: var(--brand-text); margin-bottom: 1rem;">Sobre Nós</h2>
        <p style="font-size: 1.125rem; color: #475569; line-height: 1.8;">${aboutText}</p>
      </section>

      <!-- Especialidades e Serviços -->
      <section style="margin-bottom: 4rem;">
        <h2 style="font-size: 2rem; font-weight: 700; color: var(--brand-text); margin-bottom: 0.5rem;">Especialidades Médicas e Odontológicas</h2>
        <p style="color: #64748b; margin-bottom: 2rem;">Cuidado humanizado e equipamentos modernos para seu tratamento.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          ${servicesHtml}
        </div>
      </section>

      <!-- Prova Social -->
      ${
        testimonialsHtml
          ? `<section style="margin-bottom: 4rem;">
               <h2 style="font-size: 2rem; font-weight: 700; color: var(--brand-text); margin-bottom: 0.5rem;">O Que Nossos Pacientes Dizem</h2>
               <p style="color: #64748b; margin-bottom: 2rem;">Avaliação média de ${config.socialProof.rating} estrelas com base em ${config.socialProof.reviewCount} avaliações.</p>
               <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                 ${testimonialsHtml}
               </div>
             </section>`
          : ''
      }

      <!-- Contato e Localização -->
      <section style="background: #f1f5f9; padding: 2.5rem; border-radius: 12px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 2rem; align-items: center;">
        <div>
          <h2 style="font-size: 1.75rem; font-weight: 700; color: var(--brand-text); margin-bottom: 0.5rem;">Agendamento de Consultas</h2>
          ${address ? `<p style="color: #475569; margin-bottom: 0.25rem;">📍 ${address}</p>` : ''}
          ${phone ? `<p style="color: #475569;">📞 ${phone}</p>` : ''}
        </div>
        <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" style="background: var(--brand-primary); color: #ffffff; font-weight: 700; padding: 0.875rem 1.75rem; border-radius: 8px; text-decoration: none;">
          Agendar Consulta via WhatsApp
        </a>
      </section>
    </main>

    <footer style="border-top: 1px solid #e2e8f0; padding: 2rem 1.5rem; text-align: center; color: #64748b; font-size: 0.875rem;">
      <p>&copy; ${new Date().getFullYear()} ${businessName}. Todos os direitos reservados.</p>
    </footer>
    `.trim();
  }
}
