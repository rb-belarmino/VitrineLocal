import { PreviewVisualPitch } from '../site-engine.types';
import { HtmlSanitizer } from '../core/html-sanitizer';

export function renderVisualPitchBadge(visualPitch: PreviewVisualPitch): string {
  const badgeText = HtmlSanitizer.escape(visualPitch.badgeText);
  const ctaText = HtmlSanitizer.escape(visualPitch.ctaText);
  const ctaWhatsappLink = HtmlSanitizer.sanitizeUrl(visualPitch.ctaWhatsappLink);

  return `
  <aside class="vl-pitch-badge" role="region" aria-label="Aviso de demonstração VitrineLocal">
    <div class="vl-pitch-container">
      <div class="vl-pitch-text">
        <span class="vl-pitch-pill">VitrineLocal</span>
        <p>${badgeText}</p>
      </div>
      <a href="${ctaWhatsappLink}" target="_blank" rel="noopener noreferrer" class="vl-pitch-cta">
        <span>${ctaText}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    </div>
  </aside>
  `.trim();
}
