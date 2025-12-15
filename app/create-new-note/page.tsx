"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { DashboardShell } from "@/components/DashboardShell";

export default function CreateNewNotePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !session?.user) return;

    setLoading(true);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        throw new Error("Failed to create note");
      }

      setTitle("");
      setContent("");

      toast({
        title: "Заметка создана",
        description: "Твоя новая заметка сохранена.",
      });

      router.push("/my-notes");
    } catch (error) {
      toast({
        
        title: "Ошибка",
        description: "Не удалось создать заметку. Попробуй ещё раз.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <DashboardShell user={session.user}>
      <div className="space-y-6 animate__animated animate__fadeInUp">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-zinc-50">
            Create New Note
          </h1>
          <p className="text-sm text-zinc-500">
            Заполни поля ниже, чтобы создать новую заметку.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <label className="text-xs text-zinc-400 uppercase tracking-[0.16em]">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Идея для проекта..."
              className="bg-zinc-950/60 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-zinc-400 uppercase tracking-[0.16em]">
              Content
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Например: список задач, мысли, заметки..."
              className="bg-zinc-950/60 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 min-h-[180px]"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-100 text-black px-5 py-2.5 text-sm font-medium shadow-md hover:bg-zinc-300 transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Note</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}


