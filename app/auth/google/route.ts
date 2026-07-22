import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const url = new URL(request.url)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // This sends them back to the Callback Route we built earlier
      redirectTo: `${url.origin}/auth/callback?next=/dashboard`,
      // 🔥 DEEP FIX: Forces Google to show the account selection screen and gets a fresh token
      queryParams: {
        access_type: 'offline',
        prompt: 'consent', 
      },
    },
  })

  // 1. If Supabase fails to generate the Google URL, log it and return to login
  if (error) {
    console.error("Google OAuth Initiation Error:", error.message)
    return NextResponse.redirect(`${url.origin}/login?error=Google_Connection_Failed`)
  }

  // 2. Success! Redirect the browser straight to the Google Login screen
  if (data?.url) {
    return NextResponse.redirect(data.url)
  }

  // 3. Fallback error just in case data.url is missing
  return NextResponse.redirect(`${url.origin}/login?error=Unknown_Auth_Error`)
}