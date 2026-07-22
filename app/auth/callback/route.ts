import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  // Default redirect to dashboard, but we'll check if they are new below
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Check if this is a NEW user by seeing if they have an institute
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: institute } = await supabase
          .from("institutes")
          .select("id")
          .eq("owner_id", user.id)
          .single();

        // If no institute is found, they are a NEW user -> Send to onboarding
        if (!institute) {
          return NextResponse.redirect(new URL("/onboarding", request.url));
        }
      }

      // If they already have an institute, send them to the dashboard
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // If there's an error, send them back to login
  return NextResponse.redirect(new URL("/login?error=auth_failed", request.url));
}