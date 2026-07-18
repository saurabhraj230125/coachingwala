import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  // 🔥 THE DEEP FIX: Dynamically grabs the current host (coachingwala.vercel.app)
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Securely redirects using the exact domain the user is currently on
      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    } else {
      console.error("Auth Callback Error:", error.message)
    }
  }

  // If it fails, send them back to login instead of infinite looping
  return NextResponse.redirect(`${requestUrl.origin}/login?error=true`)
}