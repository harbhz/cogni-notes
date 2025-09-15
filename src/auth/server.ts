import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";


export async function createClient() {
  const cookieStore = await cookies();
  // Debug: log all cookies to help diagnose missing session
  if (process.env.NODE_ENV !== 'production') {
    console.log('Supabase cookies:', cookieStore.getAll());
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
    console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'present' : 'missing');
  }
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
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
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error(error);
    return null;
  }
  return data.user;
}
