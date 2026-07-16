import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

// FIX: Changed from POST to GET to avoid Next.js form method blocking
export async function GET(request: Request) {
  const supabase = await createClient()
  const url = new URL(request.url)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${url.origin}/auth/callback?next=/dashboard`,
    },
  })

  // Redirect the browser straight to the Google Login screen
  if (data.url) {
    return NextResponse.redirect(data.url)
  }

  return NextResponse.redirect(`${url.origin}/login?error=Google Connection Failed`)
}