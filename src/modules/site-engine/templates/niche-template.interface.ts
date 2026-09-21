import { NicheTheme, PreviewSiteConfig } from '../site-engine.types';

export interface NicheTemplate {
  readonly niche: NicheTheme;
  render(config: PreviewSiteConfig): string;
}
