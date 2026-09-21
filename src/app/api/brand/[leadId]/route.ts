import { NextRequest } from 'next/server';
import { brandService } from '@/lib/services';
import { ExtractBrandParamsSchema } from '@/modules/brand/schemas/brand.schemas';
import { ValidationError } from '@/shared/errors/app-error';
import { handleApiSuccess, handleApiError } from '@/lib/api-response';

interface RouteProps {
  params: Promise<{ leadId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteProps) {
  try {
    const rawParams = await params;
    const parsedParams = ExtractBrandParamsSchema.safeParse(rawParams);
    if (!parsedParams.success) {
      throw new ValidationError('Parâmetro leadId inválido. Deve ser um UUID.');
    }

    const profile = await brandService.getBrandProfile(parsedParams.data.leadId);
    return handleApiSuccess(profile);
  } catch (error) {
    return handleApiError(error);
  }
}
