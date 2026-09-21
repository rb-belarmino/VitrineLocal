import { NextRequest } from 'next/server';
import { outreachService } from '@/lib/services';
import { handleApiSuccess, handleApiError } from '@/lib/api-response';

export async function GET(_request: NextRequest) {
  try {
    const stats = await outreachService.getPortalStats();
    return handleApiSuccess(stats);
  } catch (error) {
    return handleApiError(error);
  }
}
