import { NextRequest } from 'next/server';
import { radarService } from '@/lib/services';
import { handleApiSuccess, handleApiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters: { niche?: string; location?: string; minScore?: number } = {};

    const niche = searchParams.get('niche');
    if (niche) filters.niche = niche;

    const location = searchParams.get('location');
    if (location) filters.location = location;

    const minScore = searchParams.get('minScore');
    if (minScore) {
      const parsedScore = parseInt(minScore, 10);
      if (!isNaN(parsedScore)) filters.minScore = parsedScore;
    }

    const leads = await radarService.getQualifiedLeads(filters);
    return handleApiSuccess(leads, 200, { total: leads.length });
  } catch (error) {
    return handleApiError(error);
  }
}
