import { NextRequest } from 'next/server';
import { brandService } from '@/lib/services';
import {
  ExtractBrandParamsSchema,
  ExtractBrandQuerySchema,
} from '@/modules/brand/schemas/brand.schemas';
import { ValidationError } from '@/shared/errors/app-error';
import { handleApiSuccess, handleApiError } from '@/lib/api-response';

interface RouteProps {
  params: Promise<{ leadId: string }>;
}

export async function POST(request: NextRequest, { params }: RouteProps) {
  try {
    const rawParams = await params;
    const parsedParams = ExtractBrandParamsSchema.safeParse(rawParams);
    if (!parsedParams.success) {
      throw new ValidationError('Parâmetro leadId inválido. Deve ser um UUID.');
    }

    const { searchParams } = new URL(request.url);
    const forceParam = searchParams.get('force');
    const parsedQuery = ExtractBrandQuerySchema.safeParse({ force: forceParam });
    const force = parsedQuery.success ? parsedQuery.data.force : false;

    const profile = await brandService.extractBrand(parsedParams.data.leadId, force);
    return handleApiSuccess(profile);
  } catch (error) {
    return handleApiError(error);
  }
}
