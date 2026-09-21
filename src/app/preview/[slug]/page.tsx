import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteEngineService } from '@/lib/services';
import { TemplateSelector } from '@/modules/site-engine/components/TemplateSelector';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const getSiteConfig = cache(async (slug: string) => {
  return siteEngineService.buildSiteConfig(slug);
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const config = await getSiteConfig(slug);
    return {
      title: config.meta.title,
      description: config.meta.description,
      openGraph: {
        title: config.meta.title,
        description: config.meta.description,
        images: config.meta.ogImage ? [{ url: config.meta.ogImage }] : undefined,
      },
    };
  } catch {
    return {
      title: 'Visual Pitch - Demonstração Exclusiva | VitrineLocal',
      description: 'Demonstração de website personalizada desenvolvida pela VitrineLocal.',
    };
  }
}

export default async function PreviewPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    const config = await getSiteConfig(slug);
    return <TemplateSelector config={config} />;
  } catch {
    notFound();
  }
}
