import { NextRequest } from 'next/server';
import { siteEngineService } from '@/lib/services';
import { handleApiSuccess, handleApiError } from '@/lib/api-response';

interface RouteProps {
  params: Promise<{ leadId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteProps) {
  try {
    const { leadId } = await params;
    const config = await siteEngineService.buildSiteConfig(leadId);
    return handleApiSuccess(config);
  } catch (error) {
    return handleApiError(error);
  }
}
