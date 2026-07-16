import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data: authData, error: authError } = await supabase.auth.exchangeCodeForSession(code)

    if (!authError && authData.user) {
      // Check if this Google user already has a database workspace
      const { data: institute } = await supabase
        .from('institutes')
        .select('id')
        .eq('owner_id', authData.user.id)
        .single()

      // If they are brand new, build their database row instantly
      if (!institute) {
        const googleName = authData.user.user_metadata?.full_name || "Owner";
        await supabase.from('institutes').insert({
          owner_id: authData.user.id,
          name: `${googleName} Academy`,
          phone_number: "Provided via Profile",
          subscription_status: 'trialing'
        })
      }

      // Safe redirect straight into the beautiful dashboard!
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If validation drops, gracefully send them back
  return NextResponse.redirect(`${origin}/login?error=Authentication validation failed`)
}