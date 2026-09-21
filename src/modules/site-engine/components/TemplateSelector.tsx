import type { PreviewSiteConfig } from '../site-engine.types';
import { BasePreviewLayout } from './BasePreviewLayout';
import { SaudeTemplate } from './SaudeTemplate';
import { AutomotivoTemplate } from './AutomotivoTemplate';
import { GastronomiaTemplate } from './GastronomiaTemplate';
import { BelezaTemplate } from './BelezaTemplate';
import { GeralTemplate } from './GeralTemplate';

interface TemplateSelectorProps {
  config: PreviewSiteConfig;
}

export function TemplateSelector({ config }: TemplateSelectorProps) {
  const renderTemplateContent = () => {
    switch (config.nicheTheme) {
      case 'saude':
        return <SaudeTemplate config={config} />;
      case 'automotivo':
        return <AutomotivoTemplate config={config} />;
      case 'gastronomia':
        return <GastronomiaTemplate config={config} />;
      case 'beleza':
        return <BelezaTemplate config={config} />;
      case 'geral':
      default:
        return <GeralTemplate config={config} />;
    }
  };

  return <BasePreviewLayout config={config}>{renderTemplateContent()}</BasePreviewLayout>;
}
