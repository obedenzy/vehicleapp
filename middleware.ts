import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add games from localStorage to request headers for server components
  const games = request.cookies.get('games')?.value || '[]';
  response.headers.set('x-games', games);

  return response;
}
