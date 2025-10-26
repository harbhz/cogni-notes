"use server";

import { createClient } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const loginAction = async (email: string, password: string) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    revalidatePath("/", "layout");
    redirect("/");
  } catch (error) {
    return handleError(error);
  }
};

export const logOutAction = async () => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    revalidatePath("/", "layout");
    redirect("/login");
  } catch (error) {
    return handleError(error);
  }
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

    await prisma.user.create({
      data: {
        id: userId,
        email,
      },
    });

    revalidatePath("/", "layout");
    redirect("/");
  } catch (error) {
    return handleError(error);
  }
};
