import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/auth";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/my-notes");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 rounded-3xl bg-zinc-900/70 border border-zinc-800/80 shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-xl p-8 animate__animated animate__fadeInUp">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
            My Notes
          </h1>
          <p className="text-sm text-zinc-400">
            Личный тёмный dashboard для твоих заметок. Войдите, чтобы продолжить.
          </p>
        </div>
        <div className="pt-4 flex justify-center">
          <Link
            href="/login"
            className={`${buttonVariants({
              variant: "default",
              size: "lg",
            })} gap-2 px-8 bg-zinc-50 text-black hover:bg-zinc-200 transition-all duration-300 rounded-full shadow-lg hover:shadow-[0_0_25px_rgba(250,250,250,0.35)]`}
          >
            Login
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
