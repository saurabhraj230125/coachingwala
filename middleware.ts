import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // Initialize the Supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Use getSession() instead of getUser() to prevent heavy database loops on every click
  const { data: { session } } = await supabase.auth.getSession()
  const path = request.nextUrl.pathname

  // 1. Unauthenticated users trying to access protected routes get kicked to login
  if (!session && (path.startsWith('/dashboard') || path.startsWith('/onboarding') || path === '/billing')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Authenticated users trying to view the login or root page get pushed to the app
  if (session && (path === '/login' || path === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 3. THE ENTERPRISE INTERCEPTOR (ONBOARDING & 14-DAY TRIAL LOCK)
  // Only query the database if they are logged in and navigating inside the protected app
  if (session && (path.startsWith('/dashboard') || path.startsWith('/onboarding'))) {
    
    // FETCH ONCE: Get their onboarding status, trial date, and payment status
    const { data: institute } = await supabase
      .from('institutes')
      .select('is_onboarded, trial_ends_at, subscription_status')
      .eq('owner_id', session.user.id)
      .single()

    // A. THE ONBOARDING LOCK
    if (institute) {
      // Force them to Setup Wizard if they haven't done it
      if (!institute.is_onboarded && !path.startsWith('/onboarding')) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
      // If they HAVE done it, protect them from going back to the Setup Wizard
      if (institute.is_onboarded && path.startsWith('/onboarding')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      // B. THE 14-DAY PAYWALL LOCKOUT
      if (institute.is_onboarded) {
        // Calculate if today's date has passed their 14-day trial date
        const isTrialExpired = new Date(institute.trial_ends_at) < new Date();
        const needsPayment = isTrialExpired && institute.subscription_status !== 'active';

        // If they need to pay and are trying to access ANYTHING except the billing page, block them.
        if (needsPayment && path !== '/dashboard/billing') {
          const lockUrl = new URL('/dashboard/billing', request.url);
          lockUrl.searchParams.set('expired', 'true'); // Triggers a red warning in the URL
          return NextResponse.redirect(lockUrl);
        }
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}