"use server";

import { createClient } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const loginAction = async (email: string, password: string) => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    const userId = data.user.id;
    await prisma.user.upsert({
      where: { id: userId },
      update: { email: data.user.email ?? email },
      create: {
        id: userId,
        email: data.user.email ?? email,
      },
    });

    revalidatePath("/", "layout");
  } catch (error) {
    return handleError(error);
  }

  redirect("/");
};

export const logOutAction = async () => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    revalidatePath("/", "layout");
  } catch (error) {
    return handleError(error);
  }

  redirect("/login");
};

export const signUpAction = async (email: string, password: string) => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) throw new Error("Error signing up");

    await prisma.user.upsert({
      where: { id: userId },
      update: { email },
      create: {
        id: userId,
        email,
      },
    });

    revalidatePath("/", "layout");
  } catch (error) {
    return handleError(error);
  }

  redirect("/login?toastType=signUp");
};
