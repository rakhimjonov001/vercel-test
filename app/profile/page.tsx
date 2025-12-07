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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                 
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>

                    {/* Content */}
                    <div className="px-6 pb-6">
                        {/* Avatar */}
                        <div className="flex justify-center -mt-16 mb-4">
                            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                                <AvatarImage src={user?.image ?? ""} alt={user?.name ?? ""} />
                                <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                    {user?.name?.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* User Info with Edit */}
                        <ProfileContent user={user} />
                    </div>
                </div>

            </div>
        </div>
    );
}