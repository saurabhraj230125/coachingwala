import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  // Grab the URL and the secure code Google sent back
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    
    // Exchange the code for a secure session token
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error("Auth Callback Error:", error.message)
      return NextResponse.redirect(`${origin}/login?error=auth_failed`)
    }
  }

  // 🔥 SUCCESS: Hard redirect them to the dashboard gatekeeper. 
  // The layout.tsx will check if they need to go to Onboarding or the Premium Dashboard.
  return NextResponse.redirect(`${origin}/dashboard`)
}