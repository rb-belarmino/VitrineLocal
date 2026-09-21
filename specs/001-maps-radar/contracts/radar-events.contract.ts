import { RawMapsLead, QualifiedLead } from './radar-service.contract';

/**
 * Eventos emitidos durante o ciclo de vida da mineração do Maps Radar.
 * Permite observabilidade em tempo real, logs estruturados e atualização de UI.
 */
export interface RadarEventEmitter {
  on(event: 'search:started', listener: (data: { jobId: string; niche: string; location: string }) => void): this;
  on(event: 'lead:extracted', listener: (data: { jobId: string; rawLead: RawMapsLead }) => void): this;
  on(event: 'lead:qualified', listener: (data: { jobId: string; lead: QualifiedLead }) => void): this;
  on(event: 'lead:disqualified', listener: (data: { jobId: string; businessName: string; reason: string }) => void): this;
  on(event: 'search:completed', listener: (data: { jobId: string; totalFound: number; totalQualified: number }) => void): this;
  on(event: 'search:failed', listener: (data: { jobId: string; error: string }) => void): this;
}
