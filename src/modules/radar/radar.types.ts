import { SearchParams, QualifiedLead, JobStatus } from './schemas/radar.schemas';

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

export interface IRadarService {
  enqueueSearchJob(params: SearchParams): Promise<{ jobId: string; status: 'PENDING' }>;
  getJobStatus(jobId: string): Promise<JobDetails | null>;
  getQualifiedLeads(filters?: {
    niche?: string;
    location?: string;
    minScore?: number;
  }): Promise<QualifiedLead[]>;
  getLeadById(id: string): Promise<QualifiedLead | null>;
}
