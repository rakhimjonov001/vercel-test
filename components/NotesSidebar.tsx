"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, LogOut, PlusCircle, StickyNote, UserRound } from "lucide-react";

type NotesSidebarProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export default function NotesSidebar({ user }: NotesSidebarProps) {
  const pathname = usePathname();

  const initial =
    user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

  const linkBase =
    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200";

  const isActive = (href: string) =>
    pathname === href
      ? "bg-zinc-800 text-zinc-50 shadow-[0_0_18px_rgba(24,24,27,0.7)]"
      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60";

  return (
    <aside className="hidden md:flex md:w-72 lg:w-80 flex-col border-r border-zinc-800 bg-zinc-950/80 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] animate__animated animate__fadeInLeft">
      <div className="flex-1 flex flex-col px-5 py-6 gap-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 text-left focus-visible:ring-2 focus-visible:ring-zinc-700 rounded-xl px-2 py-1 transition">
              <Avatar className="size-11 ring-2 ring-zinc-700 shadow-[0_0_20px_rgba(161,161,170,0.35)]">
                {user?.image && <AvatarImage src={user.image} alt={user?.name || ""} />}
                <AvatarFallback className="bg-zinc-800 text-zinc-100 text-lg">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-zinc-100 truncate">
                  {user?.name || "Без имени"}
                </span>
                <span className="text-xs text-zinc-500 truncate">
                  {user?.email}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="start"
            className="w-48 bg-zinc-900 border-zinc-800"
          >
            <DropdownMenuItem asChild className="gap-2">
              <Link href="/profile">
                <UserRound className="w-4 h-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>

        <nav className="flex flex-col gap-1 text-sm">
          <span className="text-xs uppercase tracking-[0.18em] text-zinc-500 mb-1">
            Notes
          </span>
          <Link
            href="/my-notes"
            className={`${linkBase} ${isActive("/my-notes")}`}
          >
            <StickyNote className="w-4 h-4" />
            <span>My Notes</span>
          </Link>
          <Link
            href="/create-new-note"
            className={`${linkBase} ${isActive("/create-new-note")}`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Note</span>
          </Link>
        </nav>
      </div>

      <div className="px-5 pb-5 pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <FileText className="w-3 h-3" />
          <span>My Notes</span>
        </div>
        <button
          className={`${buttonVariants({
            variant: "ghost",
            size: "sm",
          })} text-zinc-400 hover:text-red-300 hover:bg-red-900/30 gap-2 rounded-full px-3`}
          onClick={() =>
            signOut({
              callbackUrl: "/",
            })
          }
        >
          <LogOut className="w-3 h-3" />
          <span className="text-xs">Logout</span>
        </button>
      </div>
    </aside>
  );
}


