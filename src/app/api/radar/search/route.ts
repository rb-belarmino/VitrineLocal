import { NextRequest } from 'next/server';
import { radarService } from '@/lib/services';
import { SearchParamsSchema } from '@/modules/radar/schemas/radar.schemas';
import { ValidationError } from '@/shared/errors/app-error';
import { handleApiSuccess, handleApiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = SearchParamsSchema.safeParse(body);
    if (!parseResult.success) {
      throw new ValidationError('Parâmetros de busca inválidos', {
        issues: parseResult.error.format(),
      });
    }

    const job = await radarService.enqueueSearchJob(parseResult.data);
    return handleApiSuccess(job, 202, { message: 'Busca enfileirada com sucesso' });
  } catch (error) {
    return handleApiError(error);
  }
}
