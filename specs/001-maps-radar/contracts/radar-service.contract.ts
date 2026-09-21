import { z } from 'zod';
import { 
  SearchParamsSchema, 
  QualifiedLeadSchema, 
  RawMapsLeadSchema 
} from '../data-model';

export type SearchParams = z.infer<typeof SearchParamsSchema>;
export type QualifiedLead = z.infer<typeof QualifiedLeadSchema>;
export type RawMapsLead = z.infer<typeof RawMapsLeadSchema>;

export interface SearchResult {
  jobId: string;
  niche: string;
  location: string;
  totalFound: number;
  totalQualified: number;
  totalDisqualified: number;
  durationMs: number;
  leads: QualifiedLead[];
}

export type JobStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface JobDetails {
  jobId: string;
  niche: string;
  location: string;
  limitRequested: number;
  status: JobStatus;
  totalFound: number;
  totalQualified: number;
  totalDisqualified: number;
  errorMessage?: string | null;
  startedAt: Date;
  finishedAt?: Date | null;
  leads: QualifiedLead[];
}

/**
 * Interface principal do Módulo 1 (Maps Radar).
 * Define a fachada desacoplada para a API REST HTTP.
 */
export interface IRadarService {
  /**
   * Enfileira uma busca assíncrona no Google Maps com concorrência máxima de 1 job ativo.
   */
  enqueueSearchJob(params: SearchParams): Promise<{ jobId: string; status: 'PENDING' }>;

  /**
   * Consulta o status de processamento e os leads retornados por um job.
   */
  getJobStatus(jobId: string): Promise<JobDetails | null>;

  /**
   * Retorna os leads minerados e qualificados filtrados por nicho ou localidade.
   */
  getQualifiedLeads(filters?: {
    niche?: string;
    location?: string;
    minScore?: number;
  }): Promise<QualifiedLead[]>;

  /**
   * Recupera um lead específico pelo seu ID.
   */
  getLeadById(id: string): Promise<QualifiedLead | null>;
}
