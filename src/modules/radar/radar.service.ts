import { PrismaClient } from '@prisma/client';
import { IRadarService, JobDetails } from './radar.types';
import { SearchParams, QualifiedLead } from './schemas/radar.schemas';
import { PrismaLeadRepository } from './repositories/lead.repository';
import { MapsScraper } from './scraper/maps-scraper';
import { LeadPersister } from './core/lead-persister';
import { globalJobQueue } from './core/job-queue';
import { Logger } from '../../shared/logger/logger';

export class RadarService implements IRadarService {
  private repository: PrismaLeadRepository;
  private scraper: MapsScraper;
  private persister: LeadPersister;

  constructor(prisma: PrismaClient, scraper?: MapsScraper) {
    this.repository = new PrismaLeadRepository(prisma);
    this.scraper = scraper ?? new MapsScraper();
    this.persister = new LeadPersister(this.repository);
  }

  /**
   * Enfileira a busca na fila FIFO com concorrência máxima de 1 job ativo.
   * Retorna imediatamente o jobId com status PENDING.
   */
  public async enqueueSearchJob(params: SearchParams): Promise<{ jobId: string; status: 'PENDING' }> {
    const jobRecord = await this.repository.createSearchJob(params);
    const jobId = jobRecord.id;

    Logger.info(`Recebida requisição de busca. Criado job ${jobId} para "${params.niche} em ${params.location}"`);

    // Dispara a execução assíncrona na fila sem bloquear a resposta HTTP
    void globalJobQueue.enqueue(jobId, async () => {
      await this.executeJob(jobId, params);
    }).catch(error => {
      Logger.error(`Erro não capturado na execução do job ${jobId}`, error);
    });

    return {
      jobId,
      status: 'PENDING'
    };
  }

  /**
   * Execução efetiva do job de raspagem, qualificação e persistência.
   */
  public async executeJob(jobId: string, params: SearchParams): Promise<void> {
    await this.repository.updateSearchJobStatus(jobId, 'RUNNING');
    Logger.info(`Executando job ${jobId}...`);

    try {
      let totalFound = 0;
      let totalQualified = 0;
      let totalDisqualified = 0;

      const rawLeads = await this.scraper.scrape(params, (count) => {
        Logger.debug(`Progresso do job ${jobId}: ${count} itens minerados`);
      });

      totalFound = rawLeads.length;

      for (const rawLead of rawLeads) {
        try {
          const lead = await this.persister.processAndSave(rawLead, jobId);
          if (lead.status === 'QUALIFIED') {
            totalQualified++;
          } else {
            totalDisqualified++;
          }
        } catch (cardError) {
          Logger.error(`Erro ao persistir card individual: ${rawLead.businessName}`, cardError);
        }
      }

      await this.repository.updateSearchJobMetrics(jobId, totalFound, totalQualified, totalDisqualified);
      await this.repository.updateSearchJobStatus(jobId, 'COMPLETED');
      Logger.info(`Job ${jobId} finalizado com sucesso. Qualificados: ${totalQualified}/${totalFound}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      await this.repository.updateSearchJobStatus(jobId, 'FAILED', errorMsg);
      Logger.error(`Job ${jobId} falhou.`, error);
      throw error;
    }
  }

  /**
   * Consulta o status atual de um job.
   */
  public async getJobStatus(jobId: string): Promise<JobDetails | null> {
    const job = await this.repository.getJobById(jobId);
    if (!job) return null;

    return {
      jobId: job.id,
      niche: job.niche,
      location: job.location,
      limitRequested: job.limitRequested,
      status: job.status as 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED',
      totalFound: job.totalFound,
      totalQualified: job.totalQualified,
      totalDisqualified: job.totalDisqualified,
      errorMessage: job.errorMessage,
      startedAt: job.startedAt,
      finishedAt: job.finishedAt,
      leads: job.leads
    };
  }

  /**
   * Retorna os leads qualificados persistidos.
   */
  public async getQualifiedLeads(filters?: { niche?: string; location?: string; minScore?: number }): Promise<QualifiedLead[]> {
    return this.repository.getQualifiedLeads(filters);
  }

  /**
   * Busca lead por ID.
   */
  public async getLeadById(id: string): Promise<QualifiedLead | null> {
    const leads = await this.repository.getQualifiedLeads();
    return leads.find(l => l.id === id) ?? null;
  }
}
