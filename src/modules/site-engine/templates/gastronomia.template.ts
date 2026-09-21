import { NicheTemplate } from './niche-template.interface';
import { NicheTheme, PreviewSiteConfig } from '../site-engine.types';
import { HtmlSanitizer } from '../core/html-sanitizer';

export class GastronomiaTemplate implements NicheTemplate {
  public readonly niche: NicheTheme = 'gastronomia';

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

    const dishesHtml = config.content.keyServices
      .map(
        (dish) => `
        <div class="dish-card" style="padding: 1.5rem; background: #ffffff; border-radius: 12px; border: 1px solid #f1f5f9; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); text-align: center;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🍽️</div>
          <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--brand-text);">${HtmlSanitizer.escape(dish)}</h3>
          <p style="color: #64748b; font-size: 0.875rem; margin-bottom: 1rem;">Ingredientes frescos, tempero artesanal e receita exclusiva.</p>
          <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" style="color: var(--brand-primary); font-weight: 600; font-size: 0.875rem; text-decoration: none;">
            Pedir pelo Delivery &rarr;
          </a>
        </div>`,
      )
      .join('\n');

    const testimonialsHtml = config.socialProof.testimonials
      .map(
        (t) => `
        <div class="testimonial-card" style="padding: 1.5rem; background: #fffbeb; border-radius: 8px; border: 1px solid #fde68a;">
          <div style="color: #d97706; margin-bottom: 0.5rem;">${'★'.repeat(t.rating)}</div>
          <p style="font-style: italic; color: #78350f; margin-bottom: 0.75rem;">"${HtmlSanitizer.escape(t.text)}"</p>
          <p style="font-weight: 600; font-size: 0.875rem; color: #92400e;">- ${HtmlSanitizer.escape(t.authorName)}</p>
        </div>`,
      )
      .join('\n');

    return `
    <header style="background: linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.85)), var(--brand-primary); color: #ffffff; padding: 5rem 1.5rem; text-align: center;">
      <div style="max-width: 900px; margin: 0 auto;">
        <span style="display: inline-block; background: #f59e0b; color: #000000; padding: 0.35rem 1rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 700; margin-bottom: 1rem;">${category}</span>
        <h1 style="font-size: 2.75rem; font-weight: 800; line-height: 1.2; margin-bottom: 1rem;">${businessName}</h1>
        <h2 style="font-size: 1.5rem; font-weight: 400; opacity: 0.95; margin-bottom: 1.5rem;">${headline}</h2>
        <p style="font-size: 1.125rem; opacity: 0.85; max-width: 650px; margin: 0 auto 2rem auto;">${subheadline}</p>
        <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #22c55e; color: #ffffff; font-weight: 700; padding: 0.875rem 2.25rem; border-radius: 8px; text-decoration: none; box-shadow: 0 10px 15px -3px rgba(34,197,94,0.3);">
          ${callToAction} (Delivery & Reservas)
        </a>
      </div>
    </header>

    ${
      heroImage
        ? `<div style="max-width: 1000px; margin: -2.5rem auto 2rem auto; padding: 0 1rem;">
             <img src="${heroImage}" alt="${businessName}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2);" />
           </div>`
        : ''
    }

    <main style="max-width: 1100px; margin: 0 auto; padding: 3rem 1.5rem;">
      <!-- Sobre & Experiência Gastronômica -->
      <section style="margin-bottom: 4rem; text-align: center; max-width: 800px; margin-left: auto; margin-right: auto;">
        <h2 style="font-size: 2rem; font-weight: 700; color: var(--brand-text); margin-bottom: 1rem;">Nossa Cozinha & Tradição</h2>
        <p style="font-size: 1.125rem; color: #475569; line-height: 1.8;">${aboutText}</p>
      </section>

      <!-- Cardápio / Destaques -->
      <section style="margin-bottom: 4rem;">
        <h2 style="font-size: 2rem; font-weight: 700; color: var(--brand-text); margin-bottom: 0.5rem; text-align: center;">Cardápio & Especialidades da Casa</h2>
        <p style="color: #64748b; margin-bottom: 2.5rem; text-align: center;">Sabores marcantes preparados na hora com todo o cuidado.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          ${dishesHtml}
        </div>
      </section>

      <!-- Avaliações dos Clientes -->
      ${
        testimonialsHtml
          ? `<section style="margin-bottom: 4rem;">
               <h2 style="font-size: 2rem; font-weight: 700; color: var(--brand-text); margin-bottom: 0.5rem; text-align: center;">Quem Experimenta, Recomenda</h2>
               <p style="color: #64748b; margin-bottom: 2rem; text-align: center;">Avaliação de ${config.socialProof.rating} estrelas no Google Maps (${config.socialProof.reviewCount} clientes felizes).</p>
               <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                 ${testimonialsHtml}
               </div>
             </section>`
          : ''
      }

      <!-- Reservas e Localização -->
      <section style="background: #fafaf9; border: 1px solid #e7e5e4; padding: 2.5rem; border-radius: 12px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 2rem; align-items: center;">
        <div>
          <h2 style="font-size: 1.75rem; font-weight: 700; color: var(--brand-text); margin-bottom: 0.5rem;">Venha Conhecer Nosso Espaço</h2>
          ${address ? `<p style="color: #44403c; margin-bottom: 0.25rem;">📍 ${address}</p>` : ''}
          ${phone ? `<p style="color: #44403c;">📞 ${phone}</p>` : ''}
        </div>
        <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" style="background: #22c55e; color: #ffffff; font-weight: 700; padding: 0.875rem 1.75rem; border-radius: 8px; text-decoration: none;">
          Pedir no WhatsApp
        </a>
      </section>
    </main>

    <footer style="border-top: 1px solid #e2e8f0; padding: 2rem 1.5rem; text-align: center; color: #64748b; font-size: 0.875rem;">
      <p>&copy; ${new Date().getFullYear()} ${businessName}. Todos os direitos reservados.</p>
    </footer>
    `.trim();
  }
}
