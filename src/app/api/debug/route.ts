import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getUser();
    console.log("Debug API - User:", user ? { id: user.id, email: user.email } : null);

    if (!user) {
      return NextResponse.json({ error: "No user found", user: null });
    }

    const notes = await prisma.note.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    console.log("Debug API - Notes found:", notes.length);

    return NextResponse.json({
      user: { id: user.id, email: user.email },
      notesCount: notes.length,
      notes: notes.map(n => ({ id: n.id, text: n.text.substring(0, 50) + "..." }))
    });
  } catch (error) {
    console.error("Debug API - Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
}