import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication check
  const isPublicPath = path === '/login' || path === '/register';
  
  // Get the token from cookies
  const token = request.cookies.get('auth_token')?.value || '';
  
  // If the user is on login or register page and already has a token, redirect to home
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Continue with the request for all other cases
  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: ['/login', '/register']
};