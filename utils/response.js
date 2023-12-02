import { NextResponse } from 'next/server';

export function sendErrorResponse(error) {
  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';
  return NextResponse.json({ status, message });
}
