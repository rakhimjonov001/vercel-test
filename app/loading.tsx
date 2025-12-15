import { LoaderPinwheel } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-black via-zinc-950 to-slate-950 px-6">
      <div className="w-full max-w-md animate-pulse space-y-3 text-zinc-500">
        <div className="h-6 w-3/4 rounded-lg bg-zinc-800/70"></div>
        <div className="h-4 w-full rounded-lg bg-zinc-800/60"></div>
        <div className="h-4 w-5/6 rounded-lg bg-zinc-800/60"></div>
        <div className="h-4 w-4/6 rounded-lg bg-zinc-800/60"></div>
      </div>

      <div className="flex items-center gap-3 text-zinc-300">
        <LoaderPinwheel className="h-5 w-5 animate-spin text-indigo-300" />
        <span className="text-sm tracking-wide">Loading page…</span>
      </div>
    </div>
  );
}
