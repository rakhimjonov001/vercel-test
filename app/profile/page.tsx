import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { authOptions } from "../api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
import ProfileContent from "./profile-content";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
        },
    });

    if (!user) {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-[0_0_35px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                    <div className="h-36 bg-gradient-to-r from-indigo-500/50 via-purple-500/40 to-blue-500/50" />
                    <div className="px-6 pb-8 -mt-16">
                        <div className="flex justify-center mb-6">
                            <Avatar className="w-28 h-28 border-4 border-zinc-900 shadow-[0_0_25px_rgba(99,102,241,0.35)]">
                                <AvatarImage src={user?.image ?? ""} alt={user?.name ?? ""} />
                                <AvatarFallback className="text-2xl bg-gradient-to-br from-indigo-600 to-blue-500 text-white">
                                    {user?.name?.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <ProfileContent user={user} />
                    </div>
                </div>
            </div>
        </div>
    );
}