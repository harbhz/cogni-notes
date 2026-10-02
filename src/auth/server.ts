import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/db/prisma";

export async function createClient() {
  const cookieStore = await cookies();

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
      return null;
    }
    if (!data.user.email) return data.user;

    const databaseUser = await prisma.user.findUnique({
      where: { email: data.user.email },
      select: { id: true },
    });

    return databaseUser ? { ...data.user, id: databaseUser.id } : data.user;
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
}
