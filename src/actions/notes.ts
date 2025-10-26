"use server";

import { getUser } from "../auth/server";
import { prisma } from "../db/prisma";
import { handleError } from "../lib/utils";
import { getOpenAI } from "../openai-client";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export const askAIAboutNotesAction = async (
  newQuestions: string[],
  responses: string[],
) => {
  const user = await getUser();
  if (!user) throw new Error("You must be logged in to ask AI questions");

  const notes = await prisma.note.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    select: { text: true, createdAt: true, updatedAt: true },
  });

  if (notes.length === 0) return "You don't have any notes yet.";

  const formattedNotes = notes
    .map((note) =>
      `
      Text: ${note.text}
      Created at: ${note.createdAt}
      Last updated: ${note.updatedAt}
      `.trim(),
    )
    .join("\n");

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "developer",
      content: `
        You are a helpful assistant that answers questions about a user's notes.
        Make responses concise, well-formatted in valid HTML.
        ${formattedNotes}
      `,
    },
  ];

  for (let i = 0; i < newQuestions.length; i++) {
    messages.push({ role: "user", content: newQuestions[i] });
    if (responses[i]) {
      messages.push({ role: "assistant", content: responses[i] });
    }
  }

  const openai = getOpenAI();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  return completion.choices[0].message.content || "A problem has occurred";
};

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to delete notes");

    await prisma.note.delete({
      where: {
        id: noteId,
        authorId: user.id, // Ensure user can only delete their own notes
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const createNoteAction = async () => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to create notes");

    const note = await prisma.note.create({
      data: {
        text: "",
        authorId: user.id,
      },
    });

    return { noteId: note.id, errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const updateNoteAction = async (noteId: string, text: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to update notes");

    await prisma.note.update({
      where: {
        id: noteId,
        authorId: user.id, // Ensure user can only update their own notes
      },
      data: {
        text,
        updatedAt: new Date(),
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};