import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Create an unmodified response object
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Initialize the Supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Securely get the verified user session from Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // 1. Force unauthenticated users to the login page
  if (!user && (path.startsWith('/dashboard') || path === '/billing')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. The SaaS Trial Bouncer Logic
  // If they are logged in and trying to access the core software...
  if (user && path.startsWith('/dashboard')) {
    
    // Fetch their institute status from the database we just built
    const { data: institute } = await supabase
      .from('institutes')
      .select('subscription_status, trial_ends_at')
      .eq('owner_id', user.id)
      .single()

    if (institute) {
      const isTrialExpired = new Date(institute.trial_ends_at) < new Date()
      
      // If the trial is expired AND they haven't paid, intercept the request
      if (isTrialExpired && institute.subscription_status !== 'active') {
        const url = request.nextUrl.clone()
        url.pathname = '/billing' // Redirect them to the paywall
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}