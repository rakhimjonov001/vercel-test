import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/auth";

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { name } = body;

        // Валидация
        if (!name || typeof name !== "string") {
            return NextResponse.json(
                { error: "Name is required and must be a string" },
                { status: 400 }
            );
        }

        const trimmedName = name.trim();

        if (trimmedName.length < 2) {
            return NextResponse.json(
                { error: "Name must be at least 2 characters" },
                { status: 400 }
            );
        }

        if (trimmedName.length > 50) {
            return NextResponse.json(
                { error: "Name must not exceed 50 characters" },
                { status: 400 }
            );
        }

        // Обновляем имя в БД
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name: trimmedName,
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
            },
        });

        return NextResponse.json({
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        console.error("Update name error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}