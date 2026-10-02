"use client";

import { useSearchParams } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import useNote from "@/hooks/useNote";
import { updateNoteAction } from "@/actions/notes";

type Props = {
  noteId: string;
  startingNoteText: string;
};

function NoteTextInput({ noteId, startingNoteText }: Props) {
  const noteIdParam = useSearchParams().get("noteId") || "";
  const { noteText, setNoteText } = useNote();
  const updateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">("saved");

  useEffect(() => {
    if (noteIdParam === noteId) {
      setNoteText(startingNoteText);
    }
  }, [startingNoteText, noteIdParam, noteId, setNoteText]);

  useEffect(() => {
    return () => {
      if (updateTimeout.current) clearTimeout(updateTimeout.current);
    };
  }, []);

  const saveNote = async (text: string) => {
    const result = await updateNoteAction(noteId, text);
    setSaveState(result.errorMessage ? "error" : "saved");
  };

  const handleUpdateNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;

    setNoteText(text);
    setSaveState("saving");

    if (updateTimeout.current) clearTimeout(updateTimeout.current);
    updateTimeout.current = setTimeout(() => {
      void saveNote(text);
    }, 1500);
  };

  const handleBlur = () => {
    if (updateTimeout.current) clearTimeout(updateTimeout.current);
    if (noteText.trim()) {
      setSaveState("saving");
      void saveNote(noteText);
    }
  };

  return (
    <div className="relative h-full min-h-[420px]">
      <Textarea
        value={noteText}
        onChange={handleUpdateNote}
        placeholder="Start writing..."
        onBlur={handleBlur}
        className="custom-scrollbar h-full min-h-[420px] resize-none rounded-xl border-border/80 bg-card p-6 pb-14 text-base leading-7 shadow-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0"
      />
      <div className="pointer-events-none absolute bottom-4 right-5 text-xs text-muted-foreground">
        {saveState === "saving" && "Saving..."}
        {saveState === "saved" && "Saved"}
        {saveState === "error" && <span className="text-destructive">Could not save</span>}
      </div>
    </div>
  );
}

export default NoteTextInput;
