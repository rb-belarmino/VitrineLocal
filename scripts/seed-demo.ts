import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Criando leads e perfis de demonstração para os 5 nichos...');

  const demoLeads = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      slug: 'clinica-sorriso-saude-moema',
      businessName: 'Clínica Sorriso & Saúde',
      category: 'Clínica Odontológica',
      address: 'Rua Canário, 450 - Moema, São Paulo - SP',
      phoneRaw: '(11) 98765-4321',
      phoneNormalized: '11987654321',
      isMobile: true,
      websiteRaw: null,
      websiteType: 'NO_WEBSITE',
      socialLinks: '[]',
      rating: 4.9,
      reviewCount: 42,
      qualificationScore: 92,
      status: 'QUALIFIED',
      mapsUrl: 'https://maps.google.com/?cid=demo-saude',
      profile: {
        primaryColor: '#0284C7',
        secondaryColor: '#0D9488',
        backgroundColor: '#FFFFFF',
        textColor: '#0F172A',
        paletteSource: 'EXTRACTED',
        headline: 'Odontologia Moderna com Cuidado Humanizado',
        subheadline:
          'Seu sorriso em primeiro lugar, com profissionais experientes e tecnologia avançada.',
        aboutText:
          'Há mais de 12 anos oferecendo tratamentos odontológicos completos, desde estética até implantes e ortodontia invisível, em um ambiente acolhedor e seguro.',
        keyServices: JSON.stringify([
          'Implantes Dentários',
          'Alinhadores Invisíveis',
          'Clareamento a Laser',
          'Facetas de Porcelana',
          'Odontopediatria',
        ]),
        callToAction: 'Agende sua Avaliação no WhatsApp',
        logoUrl:
          'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&h=300&fit=crop',
        heroImageUrl:
          'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=600&fit=crop',
        galleryUrls: JSON.stringify([
          'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&h=400&fit=crop',
        ]),
        testimonials: JSON.stringify([
          {
            authorName: 'Mariana Costa',
            rating: 5,
            text: 'Excelente atendimento! Fiz meu tratamento de alinhadores e o resultado foi incrível.',
          },
          {
            authorName: 'Rodrigo Alves',
            rating: 5,
            text: 'Ambiente super limpo, profissionais pontuais e muito atenciosos.',
          },
        ]),
        status: 'COMPLETED',
      },
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      slug: 'oficina-precision-car-moema',
      businessName: 'Precision Car Mecânica',
      category: 'Oficina Mecânica',
      address: 'Av. Santo Amaro, 1200 - Moema, São Paulo - SP',
      phoneRaw: '(11) 97777-6666',
      phoneNormalized: '11977776666',
      isMobile: true,
      websiteRaw: null,
      websiteType: 'NO_WEBSITE',
      socialLinks: '[]',
      rating: 4.8,
      reviewCount: 38,
      qualificationScore: 88,
      status: 'QUALIFIED',
      mapsUrl: 'https://maps.google.com/?cid=demo-auto',
      profile: {
        primaryColor: '#EA580C',
        secondaryColor: '#334155',
        backgroundColor: '#FFFFFF',
        textColor: '#0F172A',
        paletteSource: 'EXTRACTED',
        headline: 'Manutenção Automotiva de Alta Confiança',
        subheadline: 'Diagnóstico computadorizado e peças originais para seu veículo rodar seguro.',
        aboutText:
          'Especialistas em injeção eletrônica, freios, suspensão e câmbio automático. Oferecemos garantia em todos os serviços e atendimento rápido.',
        keyServices: JSON.stringify([
          'Revisão Preventiva',
          'Diagnóstico Eletrônico 3D',
          'Freios e Suspensão',
          'Câmbio Automático',
          'Alinhamento e Balanceamento',
        ]),
        callToAction: 'Pedir Orçamento pelo WhatsApp',
        logoUrl: null,
        heroImageUrl:
          'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=1200&h=600&fit=crop',
        galleryUrls: JSON.stringify([]),
        testimonials: JSON.stringify([
          {
            authorName: 'Fernando Ramos',
            rating: 5,
            text: 'Resolveram o barulho no meu carro no mesmo dia. Preço honesto e transparência total.',
          },
        ]),
        status: 'COMPLETED',
      },
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      slug: 'cantina-nona-maria-pinheiros',
      businessName: 'Cantina Nona Maria',
      category: 'Restaurante Italiano',
      address: 'Rua dos Pinheiros, 850 - Pinheiros, São Paulo - SP',
      phoneRaw: '(11) 96666-5555',
      phoneNormalized: '11966665555',
      isMobile: true,
      websiteRaw: null,
      websiteType: 'NO_WEBSITE',
      socialLinks: '[]',
      rating: 4.9,
      reviewCount: 65,
      qualificationScore: 95,
      status: 'QUALIFIED',
      mapsUrl: 'https://maps.google.com/?cid=demo-gastro',
      profile: {
        primaryColor: '#B91C1C',
        secondaryColor: '#D97706',
        backgroundColor: '#FAF5EF',
        textColor: '#292524',
        paletteSource: 'EXTRACTED',
        headline: 'Massas Artesanais e Sabores da Itália',
        subheadline: 'Receitas de família preparadas com ingredientes importados e muito amor.',
        aboutText:
          'Fundada em 2010, a Cantina Nona Maria traz o melhor da gastronomia tradicional italiana: massas frescas feitas diariamente, molhos caseiros e carta de vinhos selecionada.',
        keyServices: JSON.stringify([
          'Lasanha Tradicional Bolonhesa',
          'Ravioli de Brie com Damasco',
          'Gnocchi ao Molho Gorgonzola',
          'Tiramisù Clássico Italiano',
        ]),
        callToAction: 'Fazer Pedido no WhatsApp',
        logoUrl: null,
        heroImageUrl:
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=600&fit=crop',
        galleryUrls: JSON.stringify([]),
        testimonials: JSON.stringify([
          {
            authorName: 'Patrícia Lima',
            rating: 5,
            text: 'Melhor gnocchi de São Paulo! O atendimento é impecável e o ambiente muito aconchegante.',
          },
        ]),
        status: 'COMPLETED',
      },
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      slug: 'studio-glamour-estetica-itaim',
      businessName: 'Studio Glamour Estética',
      category: 'Salão de Beleza e Estética',
      address: 'Rua Joaquim Floriano, 300 - Itaim Bibi, São Paulo - SP',
      phoneRaw: '(11) 95555-4444',
      phoneNormalized: '11955554444',
      isMobile: true,
      websiteRaw: null,
      websiteType: 'NO_WEBSITE',
      socialLinks: '[]',
      rating: 5.0,
      reviewCount: 29,
      qualificationScore: 90,
      status: 'QUALIFIED',
      mapsUrl: 'https://maps.google.com/?cid=demo-beleza',
      profile: {
        primaryColor: '#BE185D',
        secondaryColor: '#DB2777',
        backgroundColor: '#FDF2F8',
        textColor: '#1E293B',
        paletteSource: 'EXTRACTED',
        headline: 'Realce Sua Beleza com Tecnologia e Cuidado',
        subheadline: 'Tratamentos corporais e faciais personalizados em um ambiente relaxante.',
        aboutText:
          'Equipe multidisciplinar especializada em harmonização facial, drenagem linfática, limpeza de pele profunda e design de sobrancelhas com produtos hipoalergênicos.',
        keyServices: JSON.stringify([
          'Limpeza de Pele Profunda',
          'Drenagem Linfática Método Renata França',
          'Design de Sobrancelhas e Lash Lifting',
          'Massagem Relaxante e Aromaterapia',
        ]),
        callToAction: 'Agendar Horário no WhatsApp',
        logoUrl: null,
        heroImageUrl:
          'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=600&fit=crop',
        galleryUrls: JSON.stringify([]),
        testimonials: JSON.stringify([
          {
            authorName: 'Camila Fernandes',
            rating: 5,
            text: 'Espaço maravilhoso e atendimento nota mil. Saí me sentindo renovada!',
          },
        ]),
        status: 'COMPLETED',
      },
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      slug: 'vanguard-consultoria-solucoes',
      businessName: 'Vanguard Soluções Corporativas',
      category: 'Serviços de Consultoria Financeira',
      address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
      phoneRaw: '(11) 94444-3333',
      phoneNormalized: '11944443333',
      isMobile: true,
      websiteRaw: null,
      websiteType: 'NO_WEBSITE',
      socialLinks: '[]',
      rating: 4.8,
      reviewCount: 20,
      qualificationScore: 85,
      status: 'QUALIFIED',
      mapsUrl: 'https://maps.google.com/?cid=demo-geral',
      profile: {
        primaryColor: '#1E3A8A',
        secondaryColor: '#0284C7',
        backgroundColor: '#FFFFFF',
        textColor: '#0F172A',
        paletteSource: 'EXTRACTED',
        headline: 'Soluções Ágeis e Estratégicas para o seu Negócio',
        subheadline:
          'Consultoria financeira e empresarial sob medida para pequenas e médias empresas.',
        aboutText:
          'Ajudamos empreendedores a otimizar processos, controlar fluxo de caixa e planejar crescimento sustentável com segurança contábil e fiscal.',
        keyServices: JSON.stringify([
          'Planejamento Tributário',
          'BPO Financeiro e Fluxo de Caixa',
          'Valuation e Fusões',
          'Estruturação Societária',
        ]),
        callToAction: 'Fale com um Consultor no WhatsApp',
        logoUrl: null,
        heroImageUrl:
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop',
        galleryUrls: JSON.stringify([]),
        testimonials: JSON.stringify([
          {
            authorName: 'Lucas Mendes',
            rating: 5,
            text: 'A consultoria mudou a gestão financeira da minha empresa. Altamente recomendados!',
          },
        ]),
        status: 'COMPLETED',
      },
    },
  ];

  for (const item of demoLeads) {
    const { profile, ...leadData } = item;

    await prisma.qualifiedLead.upsert({
      where: { id: leadData.id },
      update: {
        slug: leadData.slug,
        businessName: leadData.businessName,
        category: leadData.category,
        address: leadData.address,
        phoneRaw: leadData.phoneRaw,
        phoneNormalized: leadData.phoneNormalized,
        status: leadData.status,
      },
      create: leadData,
    });

    await prisma.brandProfile.upsert({
      where: { leadId: leadData.id },
      update: profile,
      create: {
        ...profile,
        leadId: leadData.id,
      },
    });

    console.log(`✅ [${leadData.category}] -> http://localhost:3001/preview/${leadData.slug}`);
  }

  console.log('\n🎉 Pronto! Todos os 5 temas de demonstração estão disponíveis no banco!');
  await prisma.$disconnect();
}

seed().catch(async (e) => {
  console.error('Erro ao popular dados demo:', e);
  await prisma.$disconnect();
  process.exit(1);
});
