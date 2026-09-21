import { NextResponse } from 'next/server';
import { AppError } from '../shared/errors/app-error';

export function handleApiSuccess<T>(data: T, status = 200, extra: Record<string, unknown> = {}) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...extra,
    },
    { status },
  );
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        ...(error.context ? { context: error.context } : {}),
      },
      { status: error.statusCode },
    );
  }

  const message = error instanceof Error ? error.message : 'Erro interno do servidor';
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 500 },
  );
}
