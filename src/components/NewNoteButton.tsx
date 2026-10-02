"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNoteAction } from "@/actions/notes";
import { useToast } from "@/hooks/use-toast";

type Props = {
  user: User | null;
};

function NewNoteButton({ user }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleClickNewNoteButton = async () => {
    if (!user) {
      router.push("/login");
    } else {
      setLoading(true);

      const result = await createNoteAction();
      if (result.errorMessage === null && 'noteId' in result) {
        router.push(`/?noteId=${result.noteId}&toastType=newNote`);
      } else if (result.errorMessage) {
        toast({
          title: "Could not create note",
          description: result.errorMessage,
          variant: "destructive",
        });
      }

      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClickNewNoteButton}
      variant="secondary"
      className="w-24"
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin" /> : "New Note"}
    </Button>
  );
}

export default NewNoteButton;
