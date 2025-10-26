import { redirect } from "next/navigation";
import { getUser } from "@/auth/server";
import AskAIButton from "@/components/AskAIButton";
import NewNoteButton from "@/components/NewNoteButton";
import NoteTextInput from "@/components/NoteTextInput";
import HomeToast from "@/components/HomeToast";
import { prisma } from "@/db/prisma";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const noteIdParam = params.noteId;
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const noteId = Array.isArray(noteIdParam)
    ? noteIdParam[0]
    : noteIdParam || "";

  if (!noteId) {
    const newestNote = await prisma.note.findFirst({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });

    if (newestNote) {
      redirect(`/?noteId=${newestNote.id}`);
    } else {
      const newNote = await prisma.note.create({
        data: {
          authorId: user.id,
          text: "",
        },
        select: { id: true },
      });
      redirect(`/?noteId=${newNote.id}`);
    }
  }

  const note = await prisma.note.findUnique({
    where: { id: noteId, authorId: user.id },
  });

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '16px', 
      height: '100%', 
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: '8px', 
        width: '100%',
        flexShrink: 0
      }}>
        <AskAIButton user={user} />
        <NewNoteButton user={user} />
      </div>

      <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
        <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""} />
      </div>

      <HomeToast />
    </div>
  );
}

// import { getUser } from "@/auth/server";
// import AskAIButton from "@/components/AskAIButton";
// import NewNoteButton from "@/components/NewNoteButton";
// import NoteTextInput from "@/components/NoteTextInput";
// import HomeToast from "@/components/HomeToast";
// import { prisma } from "@/db/prisma";

// type Props = {
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// };

// async function HomePage({ searchParams }: Props) {
//   const noteIdParam = (await searchParams).noteId;
//   const user = await getUser();

//   const noteId = Array.isArray(noteIdParam)
//     ? noteIdParam![0]
//     : noteIdParam || "";

//   const note = await prisma.note.findUnique({
//     where: { id: noteId, authorId: user?.id },
//   });

//   return (
//     <div className="flex h-full flex-col items-center gap-4">
//       <div className="flex w-full max-w-4xl justify-end gap-2">
//         <AskAIButton user={user} />
//         <NewNoteButton user={user} />
//       </div>

//       <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""} />

//       <HomeToast />
//     </div>
//   );
// }

// export default HomePage;
