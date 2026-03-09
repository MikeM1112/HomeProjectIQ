import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/project',
  '/logbook',
  '/toolbox',
  '/settings',
  '/admin',
  '/onboarding',
];

const MUTATION_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

function isValidOrigin(request: NextRequest): boolean {
  // Only check Origin on state-mutating requests to API routes
  if (!MUTATION_METHODS.includes(request.method)) return true;
  if (!request.nextUrl.pathname.startsWith('/api/')) return true;

  // Allow auth callback (Supabase OAuth redirects)
  if (request.nextUrl.pathname.startsWith('/api/auth/')) return true;

  const origin = request.headers.get('origin');
  // Requests without Origin header (same-origin navigations, server-side) are allowed
  if (!origin) return true;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  try {
    const appHost = new URL(appUrl).host;
    const requestHost = new URL(origin).host;
    return appHost === requestHost;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  // CSRF: Reject cross-origin state-mutating requests to API
  if (!isValidOrigin(request)) {
    return NextResponse.json(
      { error: 'Cross-origin request blocked', code: 'CSRF_REJECTED' },
      { status: 403 }
    );
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_ROUTES.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.json|icon-.*\\.png|offline.html|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
