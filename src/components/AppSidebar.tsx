import { getUser } from "@/auth/server";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { prisma } from "@/db/prisma";
import type { Note } from "@/types";
import Link from "next/link";
import SidebarGroupContent from "./SidebarGroupContent";

async function AppSidebar() {
  const user = await getUser();

  let notes: Note[] = [];
  if (user) {
    try {
      notes = await prisma.note.findMany({
        where: {
          authorId: user.id,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    } catch (error) {
      notes = [];
    }
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <div className="border-b border-sidebar-border px-5 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Workspace
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">
          {user ? "Your Notes" : (
            <Link href="/login" className="text-primary hover:underline">
              Login to see notes
            </Link>
          )}
        </h2>
        {user && <p className="mt-1 text-sm text-muted-foreground">A quiet place for unfinished thoughts.</p>}
      </div>
      
      {user && (
        <div className="flex-1 overflow-auto px-3 py-4">
          <div className="space-y-1.5">
            {notes.length > 0 ? (
              notes.map((note) => (
                <Link
                  key={note.id}
                  href={`/?noteId=${note.id}`}
                  className="group block rounded-lg border border-transparent px-3 py-3 transition-colors hover:border-sidebar-border hover:bg-sidebar-accent"
                >
                  <div className="truncate text-sm font-medium text-sidebar-foreground">
                    {note.text ? note.text.substring(0, 50) + (note.text.length > 50 ? "..." : "") : "Untitled"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-3 py-10 text-center text-muted-foreground">
                <p className="text-sm">No notes yet</p>
                <p className="text-xs mt-1">Start typing to create your first note</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AppSidebar;
