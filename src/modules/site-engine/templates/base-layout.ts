import { PreviewSiteConfig } from '../site-engine.types';
import { HtmlSanitizer } from '../core/html-sanitizer';
import { renderVisualPitchBadge } from './visual-pitch-badge';

export function renderBaseLayout(config: PreviewSiteConfig, contentHtml: string): string {
  const title = HtmlSanitizer.escape(config.meta.title);
  const description = HtmlSanitizer.escape(config.meta.description);
  const canonicalUrl = HtmlSanitizer.sanitizeUrl(config.meta.canonicalUrl);
  const ogImage = config.meta.ogImage ? HtmlSanitizer.sanitizeUrl(config.meta.ogImage) : null;
  const whatsappLink = HtmlSanitizer.sanitizeUrl(config.contact.whatsappLink);

  const visualPitchBanner = renderVisualPitchBadge(config.visualPitch);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonicalUrl}">
  ${ogImage ? `<meta property="og:image" content="${ogImage}">` : ''}

  <!-- Google Fonts: Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --brand-primary: ${config.theme.primaryColor};
      --brand-secondary: ${config.theme.secondaryColor};
      --brand-bg: ${config.theme.backgroundColor};
      --brand-text: ${config.theme.textColor};
      --font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-family);
      background-color: var(--brand-bg);
      color: var(--brand-text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      padding-top: 50px; /* Space for the top pitch banner */
    }

    /* Visual Pitch Banner */
    .vl-pitch-badge {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      background: #0f172a;
      color: #f8fafc;
      font-size: 0.875rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.15);
    }
    .vl-pitch-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.625rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .vl-pitch-text {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .vl-pitch-pill {
      background: #38bdf8;
      color: #0f172a;
      font-weight: 700;
      font-size: 0.75rem;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .vl-pitch-cta {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #22c55e;
      color: #ffffff;
      font-weight: 600;
      padding: 0.35rem 0.85rem;
      border-radius: 6px;
      text-decoration: none;
      transition: background 0.2s ease, transform 0.1s ease;
    }
    .vl-pitch-cta:hover {
      background: #16a34a;
      transform: translateY(-1px);
    }

    /* Floating WhatsApp Button */
    .vl-floating-wa {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9998;
      width: 60px;
      height: 60px;
      background-color: #25d366;
      color: #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
      text-decoration: none;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .vl-floating-wa:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 24px rgba(37, 211, 102, 0.6);
    }
    .vl-floating-wa svg {
      width: 32px;
      height: 32px;
      fill: currentColor;
    }
  </style>
</head>
<body>
  ${visualPitchBanner}

  <div id="app">
    ${contentHtml}
  </div>

  <!-- Floating WhatsApp Action -->
  <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" class="vl-floating-wa" aria-label="Falar no WhatsApp">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
    </svg>
  </a>
</body>
</html>`;
}
