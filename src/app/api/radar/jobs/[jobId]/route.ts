import { NextRequest, NextResponse } from 'next/server';
import { radarService } from '@/lib/services';
import { ValidationError } from '@/shared/errors/app-error';
import { handleApiSuccess, handleApiError } from '@/lib/api-response';

interface RouteProps {
  params: Promise<{ jobId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteProps) {
  try {
    const { jobId } = await params;
    if (!jobId) {
      throw new ValidationError('ID do job obrigatório');
    }

    const jobDetails = await radarService.getJobStatus(jobId);
    if (!jobDetails) {
      return NextResponse.json({ success: false, error: 'Job não encontrado' }, { status: 404 });
    }

    return handleApiSuccess(jobDetails);
  } catch (error) {
    return handleApiError(error);
  }
}
