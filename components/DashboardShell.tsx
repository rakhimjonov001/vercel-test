import { ReactNode } from "react";
import NotesSidebar from "@/components/NotesSidebar";

type DashboardShellProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  children: ReactNode;
};

export function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-zinc-950 to-slate-950 text-zinc-50">
      <NotesSidebar user={user} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 animate__animated animate__fadeIn">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
    </div>
  );
}


