'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface BrandProfile {
  id: string;
  leadId: string;
  primaryColor: string;
  secondaryColor: string;
  nicheDetected?: string | null;
}

interface Lead {
  id: string;
  businessName: string;
  category: string;
  address: string | null;
  phoneNormalized: string;
  isMobile: boolean;
  rating: number;
  reviewCount: number;
  qualificationScore: number;
  websiteType: string;
  status: string;
  slug: string | null;
  outreachCopy: string | null;
  contactedAt: string | null;
  brandProfile: BrandProfile | null;
}

interface PortalStats {
  totalMined: number;
  totalQualified: number;
  totalPreviewsReady: number;
  totalContacted: number;
  totalConverted: number;
}

interface SearchJob {
  jobId: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  totalFound?: number;
  totalQualified?: number;
  totalDisqualified?: number;
  error?: string;
}

export default function DashboardPage() {
  // State
  const [stats, setStats] = useState<PortalStats>({
    totalMined: 0,
    totalQualified: 0,
    totalPreviewsReady: 0,
    totalContacted: 0,
    totalConverted: 0,
  });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [nicheFilter, setNicheFilter] = useState('ALL');
  const [onlyPreviewsReady, setOnlyPreviewsReady] = useState(false);

  // Radar Job
  const [nicheInput, setNicheInput] = useState('Oficina Mecânica');
  const [locationInput, setLocationInput] = useState('Moema, São Paulo');
  const [limitInput, setLimitInput] = useState(5);
  const [activeJob, setActiveJob] = useState<SearchJob | null>(null);
  const [isSubmittingRadar, setIsSubmittingRadar] = useState(false);

  // Modal de Abordagem
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [pitchText, setPitchText] = useState('');
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');
  const [showConfirmContact, setShowConfirmContact] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Carregar estatísticas e leads
  const fetchData = useCallback(async () => {
    try {
      const [statsRes, leadsRes] = await Promise.all([
        fetch('/api/portal/stats'),
        fetch('/api/portal/leads'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);
      }

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        if (leadsData.success) setLeads(leadsData.data);
      }
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
    } finally {
      setIsLoadingLeads(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Polling de job ativo do radar
  useEffect(() => {
    if (!activeJob || activeJob.status === 'COMPLETED' || activeJob.status === 'FAILED') {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/radar/jobs/${activeJob.jobId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setActiveJob(data.data);
            if (data.data.status === 'COMPLETED') {
              fetchData();
            }
          }
        }
      } catch (err) {
        console.error('Erro no polling do job:', err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [activeJob, fetchData]);

  // Iniciar varredura radar
  const handleStartRadar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingRadar(true);
    try {
      const res = await fetch('/api/radar/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: nicheInput,
          location: locationInput,
          limit: Number(limitInput),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActiveJob(data.data);
      } else {
        alert(data.error || 'Erro ao iniciar mineração');
      }
    } catch {
      alert('Falha na comunicação com a API');
    } finally {
      setIsSubmittingRadar(false);
    }
  };

  // Atualizar status do lead
  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/outreach/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
        fetchData();
      }
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  // Abrir modal e gerar pitch
  const handleOpenPitchModal = async (lead: Lead) => {
    setSelectedLead(lead);
    setShowConfirmContact(false);
    setCopySuccess(false);

    if (lead.outreachCopy) {
      setPitchText(lead.outreachCopy);
      updateWhatsappLink(lead.phoneNormalized, lead.outreachCopy);
      return;
    }

    setIsGeneratingPitch(true);
    try {
      const res = await fetch(`/api/outreach/generate/${lead.id}`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setPitchText(data.data.messageText);
        setWhatsappLink(data.data.whatsappDispatchLink);
        setLeads((prev) =>
          prev.map((l) => (l.id === lead.id ? { ...l, outreachCopy: data.data.messageText } : l)),
        );
      } else {
        alert(data.error || 'Erro ao gerar mensagem de abordagem.');
      }
    } catch {
      alert('Falha na requisição com o serviço de copy.');
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  // Recalcular link wa.me
  const updateWhatsappLink = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const encoded = encodeURIComponent(text);
    setWhatsappLink(`https://wa.me/${cleanPhone}?text=${encoded}`);
  };

  const handlePitchTextChange = (newText: string) => {
    setPitchText(newText);
    if (selectedLead) {
      updateWhatsappLink(selectedLead.phoneNormalized, newText);
    }
  };

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(pitchText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleOpenWhatsapp = () => {
    window.open(whatsappLink, '_blank');
    setShowConfirmContact(true);
  };

  const handleConfirmContact = async () => {
    if (!selectedLead) return;
    await fetch(`/api/outreach/leads/${selectedLead.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'CONTACTED',
        outreachCopy: pitchText,
      }),
    });
    setSelectedLead(null);
    fetchData();
  };

  // Filtragem dos leads
  const filteredLeads = leads.filter((lead) => {
    if (statusFilter !== 'ALL' && lead.status !== statusFilter) return false;
    if (nicheFilter !== 'ALL' && !lead.category.toLowerCase().includes(nicheFilter.toLowerCase()))
      return false;
    if (onlyPreviewsReady && !lead.brandProfile) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = lead.businessName.toLowerCase().includes(q);
      const matchPhone = lead.phoneNormalized.includes(q);
      const matchCategory = lead.category.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchCategory) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white shadow-lg">
              VL
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                VitrineLocal{' '}
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono">
                  Next.js 16.3.5
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Portal Operacional de Prospecção & Outreach CRM
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-300 font-medium">Sistema Online</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-8">
        {/* KPI Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Minerados
            </p>
            <p className="text-3xl font-black text-white mt-1">{stats.totalMined}</p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Qualificados
            </p>
            <p className="text-3xl font-black text-blue-400 mt-1">{stats.totalQualified}</p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              Previews Prontos
            </p>
            <p className="text-3xl font-black text-purple-400 mt-1">{stats.totalPreviewsReady}</p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Em Negociação
            </p>
            <p className="text-3xl font-black text-amber-400 mt-1">{stats.totalContacted}</p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl shadow-sm col-span-2 sm:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Convertidos
            </p>
            <p className="text-3xl font-black text-emerald-400 mt-1">{stats.totalConverted}</p>
          </div>
        </section>

        {/* Radar Search Module */}
        <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🛰️</span> Radar Maps: Nova Mineração
              </h2>
              <p className="text-xs text-slate-400">
                Busca automatizada no Google Maps com filtro anti-site e scoring
              </p>
            </div>
          </div>

          <form
            onSubmit={handleStartRadar}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nicho / Categoria
              </label>
              <input
                type="text"
                value={nicheInput}
                onChange={(e) => setNicheInput(e.target.value)}
                required
                placeholder="Ex: Oficina Mecânica, Dentista"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Bairro / Cidade
              </label>
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                required
                placeholder="Ex: Moema, São Paulo"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Limite de Leads
              </label>
              <select
                value={limitInput}
                onChange={(e) => setLimitInput(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 leads (Rápido)</option>
                <option value={10}>10 leads (Médio)</option>
                <option value={20}>20 leads (Completo)</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                disabled={Boolean(
                  isSubmittingRadar ||
                  (activeJob && (activeJob.status === 'PENDING' || activeJob.status === 'RUNNING')),
                )}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isSubmittingRadar ? 'Iniciando...' : 'Iniciar Mineração'}
              </button>
            </div>
          </form>

          {/* Job Status Banner */}
          {activeJob && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm">
                {(activeJob.status === 'PENDING' || activeJob.status === 'RUNNING') && (
                  <span className="h-3 w-3 rounded-full bg-blue-400 animate-ping" />
                )}
                <span className="font-semibold text-slate-200">
                  Status da Busca: <span className="text-blue-400">{activeJob.status}</span>
                </span>
                {activeJob.totalFound !== undefined && (
                  <span className="text-xs text-slate-400">
                    ({activeJob.totalQualified ?? 0} qualificados de {activeJob.totalFound}{' '}
                    minerados)
                  </span>
                )}
              </div>
              {activeJob.status === 'COMPLETED' && (
                <span className="text-xs font-bold text-emerald-400">✓ Concluído com sucesso</span>
              )}
            </div>
          )}
        </section>

        {/* Leads Table & Pipeline */}
        <section className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>📋</span> Leads Minerados & Pipeline Comercial
              </h2>
              <p className="text-xs text-slate-400">
                Mostrando {filteredLeads.length} de {leads.length} leads
              </p>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Buscar por nome ou fone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
              />
              <select
                value={nicheFilter}
                onChange={(e) => setNicheFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Todos os Nichos</option>
                <option value="Oficina">Automotivo</option>
                <option value="Dentista">Saúde / Odonto</option>
                <option value="Restaurante">Gastronomia</option>
                <option value="Salão">Beleza & Estética</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Todos os Status</option>
                <option value="QUALIFIED">Qualificados</option>
                <option value="CONTACTED">Contatados</option>
                <option value="NEGOTIATING">Em Negociação</option>
                <option value="CONVERTED">Convertidos</option>
                <option value="DISQUALIFIED">Desqualificados</option>
              </select>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyPreviewsReady}
                  onChange={(e) => setOnlyPreviewsReady(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
                />
                Apenas com Preview Pronto
              </label>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-700/60">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700/60">
                <tr>
                  <th className="px-4 py-3.5">Empresa</th>
                  <th className="px-4 py-3.5">Nicho</th>
                  <th className="px-4 py-3.5">Contato</th>
                  <th className="px-4 py-3.5">Google / Score</th>
                  <th className="px-4 py-3.5">Preview</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {isLoadingLeads ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      Carregando leads...
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      Nenhum lead encontrado com os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const previewSlug = lead.slug || lead.id;
                    return (
                      <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-white">
                          <div>{lead.businessName}</div>
                          <div className="text-[11px] font-normal text-slate-400 truncate max-w-xs">
                            {lead.address || 'Endereço não informado'}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-200">
                            {lead.category}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-mono">{lead.phoneNormalized}</div>
                          {lead.isMobile ? (
                            <span className="text-[10px] text-emerald-400 font-semibold">
                              Celular / WhatsApp
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-400 font-semibold">
                              Telefone Fixo
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-amber-400">
                            ⭐ {lead.rating.toFixed(1)}{' '}
                            <span className="text-slate-400 text-[11px]">({lead.reviewCount})</span>
                          </div>
                          <div className="text-[10px] text-blue-400">
                            Score: {lead.qualificationScore}/100
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          {lead.brandProfile ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-800/40">
                              ✓ Pronto
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                              JIT
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="QUALIFIED">QUALIFIED</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="NEGOTIATING">NEGOTIATING</option>
                            <option value="CONVERTED">CONVERTED</option>
                            <option value="DISQUALIFIED">DISQUALIFIED</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-2 whitespace-nowrap">
                          <a
                            href={`/preview/${previewSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors"
                          >
                            Ver Site
                          </a>
                          <button
                            onClick={() => handleOpenPitchModal(lead)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                          >
                            Gerar Pitch
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modal de Abordagem com IA */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>🤖</span> Abordagem Visual Pitch: {selectedLead.businessName}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedLead.isMobile
                    ? 'WhatsApp Celular'
                    : 'Telefone Fixo (Alerta de envio flexível)'}
                </p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {isGeneratingPitch ? (
              <div className="py-12 text-center text-slate-400 space-y-3">
                <span className="h-6 w-6 rounded-full bg-blue-500 animate-ping inline-block" />
                <p className="text-sm font-semibold">Sintetizando copy personalizada com IA...</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Mensagem de Abordagem (Editável em tempo real)
                  </label>
                  <textarea
                    rows={7}
                    value={pitchText}
                    onChange={(e) => handlePitchTextChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleCopyPitch}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
                  >
                    {copySuccess ? '✓ Copiado!' : 'Copiar Mensagem'}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={handleOpenWhatsapp}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md transition-all flex items-center gap-2"
                    >
                      <span>📲</span> Abrir WhatsApp Web
                    </button>
                  </div>
                </div>

                {/* Confirmação Guiada */}
                {showConfirmContact && (
                  <div className="mt-4 p-3.5 rounded-xl bg-blue-950/60 border border-blue-800/60 flex items-center justify-between text-xs">
                    <span className="text-blue-200">
                      Você enviou a mensagem para o cliente no WhatsApp?
                    </span>
                    <button
                      onClick={handleConfirmContact}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                    >
                      Confirmar Contato
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
