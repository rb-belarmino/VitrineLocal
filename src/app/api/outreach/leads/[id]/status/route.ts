import { NextRequest } from 'next/server';
import { outreachService } from '@/lib/services';
import {
  UpdateStatusParamsSchema,
  LeadStatusUpdateSchema,
} from '@/modules/outreach/schemas/outreach.schemas';
import { ValidationError } from '@/shared/errors/app-error';
import { handleApiSuccess, handleApiError } from '@/lib/api-response';

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteProps) {
  try {
    const rawParams = await params;
    const parsedParams = UpdateStatusParamsSchema.safeParse(rawParams);
    if (!parsedParams.success) {
      throw new ValidationError('Parâmetro id inválido. Deve ser um UUID.');
    }

    const body = await request.json();
    const parsedBody = LeadStatusUpdateSchema.safeParse(body);
    if (!parsedBody.success) {
      throw new ValidationError('Corpo da requisição inválido para atualização de status.');
    }

    await outreachService.updateLeadStatus(parsedParams.data.id, parsedBody.data);
    return handleApiSuccess({ message: 'Status atualizado com sucesso.' });
  } catch (error) {
    return handleApiError(error);
  }
}
