import { NextRequest } from 'next/server';
import { outreachService } from '@/lib/services';
import { GenerateOutreachParamsSchema } from '@/modules/outreach/schemas/outreach.schemas';
import { ValidationError } from '@/shared/errors/app-error';
import { handleApiSuccess, handleApiError } from '@/lib/api-response';

interface RouteProps {
  params: Promise<{ leadId: string }>;
}

export async function POST(_request: NextRequest, { params }: RouteProps) {
  try {
    const rawParams = await params;
    const parsedParams = GenerateOutreachParamsSchema.safeParse(rawParams);
    if (!parsedParams.success) {
      throw new ValidationError('Parâmetro leadId inválido. Deve ser um UUID.');
    }

    const result = await outreachService.generateMessage(parsedParams.data.leadId);
    return handleApiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
