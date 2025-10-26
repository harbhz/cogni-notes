import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";


export async function createClient() {
  const cookieStore = await cookies();
  // Debug: log all cookies to help diagnose missing session
  if (process.env.NODE_ENV !== 'production') {
    console.log('Supabase cookies:', cookieStore.getAll());
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'present' : 'missing');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'present' : 'missing');
  }
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}


export async function getUser() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      // Only log actual errors, not missing sessions
      if (error.message !== "Auth session missing!") {
        console.error("Auth error:", error);
      }
      return null;
    }
    return data.user;
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
}
