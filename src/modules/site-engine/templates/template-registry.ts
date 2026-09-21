import { NicheTheme } from '../site-engine.types';
import { NicheTemplate } from './niche-template.interface';
import { SaudeTemplate } from './saude.template';
import { AutomotivoTemplate } from './automotivo.template';
import { GastronomiaTemplate } from './gastronomia.template';
import { BelezaTemplate } from './beleza.template';
import { GeralTemplate } from './geral.template';

export class TemplateRegistry {
  private readonly templates = new Map<NicheTheme, NicheTemplate>();

  constructor() {
    this.register(new SaudeTemplate());
    this.register(new AutomotivoTemplate());
    this.register(new GastronomiaTemplate());
    this.register(new BelezaTemplate());
    this.register(new GeralTemplate());
  }

  public register(template: NicheTemplate): void {
    this.templates.set(template.niche, template);
  }

  public getTemplate(niche: NicheTheme): NicheTemplate {
    const template = this.templates.get(niche);
    if (!template) {
      const fallback = this.templates.get('geral');
      if (!fallback) {
        throw new Error('Nenhum template registrado para fallback geral.');
      }
      return fallback;
    }
    return template;
  }
}
