"use client";

import { signIn } from "next-auth/react";
import { Github, Loader2, Sparkles, Chrome, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/stats/users", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setUserCount(data.count);
        }
      } catch (e) {
        setUserCount(null);
      }
    };
    fetchCount();
  }, []);

  const handleLogin = async (provider: "github" | "google") => {
    setLoadingProvider(provider);
    await signIn(provider, { callbackUrl: "/my-notes" });
    setLoadingProvider(null);
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="relative max-w-md w-full rounded-3xl border border-zinc-800/80 bg-zinc-900/80 p-8 shadow-[0_0_40px_rgba(0,0,0,0.7)] backdrop-blur-xl animate__animated animate__fadeInUp">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-zinc-700/20 via-slate-900/10 to-indigo-600/10 pointer-events-none" />

        <div className="relative space-y-6">
          <div className="flex items-center justify-center gap-2 text-zinc-100">
            <Sparkles className="w-5 h-5 text-indigo-400 animate__animated animate__pulse animate__infinite" />
            <span className="text-sm uppercase tracking-[0.2em] text-zinc-400">
              Welcome to
            </span>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
              My Notes
            </h1>
            <p className="text-sm text-zinc-400">
              Войдите через GitHub или Google, чтобы открыть свой личный
              dashboard заметок.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              size="lg"
              className="w-full justify-center gap-2 bg-zinc-50 text-black hover:bg-zinc-200 rounded-full transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(250,250,250,0.25)]"
              disabled={!!loadingProvider}
              onClick={() => handleLogin("github")}
            >
              {loadingProvider === "github" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Github className="w-4 h-4" />
              )}
              <span>Continue with GitHub</span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full justify-center gap-2 rounded-full border-zinc-700 bg-zinc-900/60 text-zinc-100 hover:bg-zinc-800/80 hover:text-white transition-all duration-300"
              disabled={!!loadingProvider}
              onClick={() => handleLogin("google")}
            >
              {loadingProvider === "google" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Chrome className="w-4 h-4" />
              )}
              <span>Continue with Google</span>
            </Button>
          </div>

          <p className="text-xs text-zinc-500 text-center pt-2">
            С нами пользуется{" "}
            <span className="inline-flex items-center gap-1 font-semibold text-zinc-100">
              <Users className="w-3.5 h-3.5" />
              {userCount ?? "…"}
            </span>{" "}
            пользователей.
          </p>
        </div>
      </div>
    </main>
  );
}


