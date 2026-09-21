import { z } from 'zod';

export const WebsiteClassificationEnum = z.enum(['NO_WEBSITE', 'SOCIAL_ONLY', 'OWN_WEBSITE']);

export type WebsiteClassification = z.infer<typeof WebsiteClassificationEnum>;

export const QualificationStatusEnum = z.enum(['QUALIFIED', 'DISQUALIFIED']);

export type QualificationStatus = z.infer<typeof QualificationStatusEnum>;

export const JobStatusEnum = z.enum(['PENDING', 'RUNNING', 'COMPLETED', 'FAILED']);

export type JobStatus = z.infer<typeof JobStatusEnum>;

export const RawMapsLeadSchema = z.object({
  businessName: z.string().min(1, 'Nome fantasia é obrigatório'),
  category: z.string().default('Serviços Locais'),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().int().min(0).default(0),
  mapsUrl: z.string().url('URL do Maps deve ser válida'),
});

export type RawMapsLead = z.infer<typeof RawMapsLeadSchema>;

export const QualifiedLeadSchema = z.object({
  id: z.string().uuid(),
  businessName: z.string().min(1),
  category: z.string(),
  address: z.string().nullable(),
  phoneRaw: z.string().nullable(),
  phoneNormalized: z
    .string()
    .regex(/^\+55\d{10,11}$/, 'Formato E.164 inválido')
    .nullable(),
  isMobile: z.boolean(),
  websiteRaw: z.string().nullable(),
  websiteType: WebsiteClassificationEnum,
  socialLinks: z.array(z.string()),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  qualificationScore: z.number().min(0).max(100),
  status: QualificationStatusEnum,
  disqualificationReason: z.string().nullable().optional(),
  mapsUrl: z.string().url(),
  searchJobId: z.string().uuid().nullable().optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export type QualifiedLead = z.infer<typeof QualifiedLeadSchema>;

export const SearchParamsSchema = z.object({
  niche: z.string().min(2, 'O nicho deve ter pelo menos 2 caracteres'),
  location: z.string().min(2, 'A localidade deve ter pelo menos 2 caracteres'),
  limit: z.number().int().min(1).max(100).default(20),
});

export type SearchParams = z.infer<typeof SearchParamsSchema>;
