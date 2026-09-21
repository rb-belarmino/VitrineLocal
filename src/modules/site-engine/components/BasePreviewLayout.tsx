import type { CSSProperties, ReactNode } from 'react';
import type { PreviewSiteConfig } from '../site-engine.types';
import { VisualPitchBadge } from './VisualPitchBadge';

interface BasePreviewLayoutProps {
  config: PreviewSiteConfig;
  children: ReactNode;
}

export function BasePreviewLayout({ config, children }: BasePreviewLayoutProps) {
  const { theme, visualPitch } = config;

  const styleVariables = {
    '--brand-primary': theme.primaryColor,
    '--brand-secondary': theme.secondaryColor,
    '--brand-bg': theme.backgroundColor,
    '--brand-text': theme.textColor,
  } as CSSProperties;

  return (
    <div
      style={styleVariables}
      className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200"
    >
      {children}
      <VisualPitchBadge visualPitch={visualPitch} />
    </div>
  );
}
