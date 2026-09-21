import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VitrineLocal - Plataforma de Prospecção B2B',
  description:
    'Plataforma inteligente de prospecção, qualificação e demonstrações web para negócios locais',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
