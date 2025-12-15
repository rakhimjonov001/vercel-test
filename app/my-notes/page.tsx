"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function MyNotesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/notes", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load notes");
        const data = (await res.json()) as Note[];
        setNotes(data);
      } catch (e: any) {
        setError(e?.message || "Failed to load notes");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [status]);

  if (status === "loading" || !session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-zinc-300">
        <Loader2 className="h-5 w-5 animate-spin text-indigo-300" />
      </div>
    );
  }

  return (
    <DashboardShell user={session.user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-50">My Notes</h1>
            <p className="text-sm text-zinc-500">
              Здесь отображаются только твои заметки.
            </p>
          </div>
          <Link
            href="/create-new-note"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-100 text-black px-4 py-2 text-sm font-medium shadow-md hover:bg-zinc-300 transition-all duration-200"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New</span>
          </Link>
        </div>

        {loading ? (
          <Card className="border-zinc-800 bg-zinc-950/60">
            <CardContent className="py-8 flex items-center justify-center gap-2 text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Загружаем заметки...</span>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-red-800/60 bg-red-950/40">
            <CardContent className="py-6 text-sm text-red-200">
              {error}
            </CardContent>
          </Card>
        ) : notes.length === 0 ? (
          <Card className="border-zinc-800 bg-zinc-950/60">
            <CardContent className="py-8 flex flex-col items-center justify-center gap-3 text-zinc-500">
              <FileText className="w-7 h-7 text-zinc-600" />
              <p className="text-sm">У тебя пока нет заметок. Создай первую!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <Card
                key={note.id}
                className="border-zinc-800 bg-zinc-950/80 hover:border-zinc-600 hover:shadow-[0_0_25px_rgba(24,24,27,0.9)] transition-all duration-200"
              >
                <CardHeader>
                  <CardTitle className="text-zinc-50 text-base">
                    {note.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-500">
                    {new Date(note.createdAt).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-200 whitespace-pre-wrap break-words">
                    {note.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}


