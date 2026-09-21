import {
  OutreachMessageResponse,
  LeadStatusUpdate,
  PortalStatsResponse,
} from './schemas/outreach.schemas';

export interface IOutreachService {
  generateMessage(leadId: string): Promise<OutreachMessageResponse>;
  updateLeadStatus(leadId: string, update: LeadStatusUpdate): Promise<void>;
  getPortalStats?(): Promise<PortalStatsResponse>;
}

export interface OutreachCopyInput {
  businessName: string;
  category: string;
  rating: number;
  reviewCount: number;
  previewUrl: string;
  phoneNormalized?: string | null;
  isMobile: boolean;
}

export type { PortalStatsResponse };
