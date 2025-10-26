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
  
  // Debug logging
  console.log("AppSidebar - User:", user ? { id: user.id, email: user.email } : null);

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
      console.log("AppSidebar - Found notes:", notes.length);
    } catch (error) {
      console.error("AppSidebar - Database error:", error);
    }
  }

  return (
    <div style={{ 
      height: '100vh', 
      backgroundColor: 'var(--background)', 
      borderRight: '1px solid var(--border)', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'auto'
    }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600' }}>
          {user ? "Your Notes" : (
            <Link href="/login" className="text-blue-600 hover:underline">
              Login to see notes
            </Link>
          )}
        </h2>
      </div>
      
      {user && (
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-2">
            {notes.length > 0 ? (
              notes.map((note) => (
                <Link
                  key={note.id}
                  href={`/?noteId=${note.id}`}
                  className="block p-3 rounded-lg hover:bg-muted transition-colors border border-border"
                >
                  <div className="font-medium text-sm truncate">
                    {note.text ? note.text.substring(0, 50) + (note.text.length > 50 ? "..." : "") : "Untitled"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
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
