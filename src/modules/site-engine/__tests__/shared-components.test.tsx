import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { StickyMobileBar } from '../components/StickyMobileBar';
import { VisualPitchBadge, VisualPitchFooter } from '../components/VisualPitchBadge';

describe('Shared Conversion Components (Unit)', () => {
  describe('StickyMobileBar', () => {
    it('deve renderizar a barra fixa mobile com foco em WhatsApp e classe md:hidden', () => {
      const html = renderToString(
        <StickyMobileBar
          whatsappLink="https://wa.me/5511999999999"
          ctaText="Pedir no WhatsApp"
          niche="gastronomia"
        />
      );

      expect(html).toContain('md:hidden');
      expect(html).toContain('fixed bottom-0');
      expect(html).toContain('z-40');
      expect(html).toContain('https://wa.me/5511999999999');
      expect(html).toContain('Pedir no WhatsApp');
    });

    it('deve utilizar a cor primária se fornecida via estilo inline', () => {
      const html = renderToString(
        <StickyMobileBar
          whatsappLink="https://wa.me/5511999999999"
          ctaText="Agendar Consulta"
          primaryColor="#0284C7"
        />
      );

      expect(html).toContain('background-color:#0284C7');
    });
  });

  describe('VisualPitchBadge', () => {
    const visualPitch = {
      badgeText: 'Demonstração VitrineLocal',
      ctaText: 'Quero este site',
      ctaWhatsappLink: 'https://wa.me/5511888888888',
    };

    it('deve renderizar como floating pill no topo superior direito com z-50 e backdrop-blur', () => {
      const html = renderToString(<VisualPitchBadge visualPitch={visualPitch} />);

      expect(html).toContain('fixed top-4 right-4');
      expect(html).toContain('z-50');
      expect(html).toContain('backdrop-blur');
      expect(html).toContain('rounded-full');
      expect(html).toContain('Demonstração VitrineLocal');
      expect(html).toContain('Quero este site');
      expect(html).toContain('https://wa.me/5511888888888');
    });

    it('deve renderizar o VisualPitchFooter com assinatura sutil e link comercial', () => {
      const html = renderToString(<VisualPitchFooter visualPitch={visualPitch} />);

      expect(html).toContain('VitrineLocal');
      expect(html).toContain(visualPitch.ctaWhatsappLink);
    });
  });
});
