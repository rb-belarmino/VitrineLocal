import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiSuccess, handleApiError } from '@/lib/api-response';

export async function GET(_request: NextRequest) {
  try {
    const leads = await prisma.qualifiedLead.findMany({
      include: {
        brandProfile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return handleApiSuccess(leads, 200, { total: leads.length });
  } catch (error) {
    return handleApiError(error);
  }
}
