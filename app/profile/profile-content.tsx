"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Check, X } from "lucide-react";

interface User {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
}

interface ProfileContentProps {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  

export default function ProfileContent({ user }: ProfileContentProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [displayName, setDisplayName] = useState(user.name || "");

    const handleEdit = () => {
        setIsEditing(true);
        setError("");
    };

    const handleCancel = () => {
        setIsEditing(false);
        setName(displayName);
        setError("");
    };

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Имя не может быть пустым");
            return;
        }

        if (name.trim().length < 2) {
            setError("Имя должно содержать минимум 2 символа");
            return;
        }

        if (name.trim().length > 50) {
            setError("Имя не должно превышать 50 символов");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/user/update-name", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: name.trim() }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Ошибка при обновлении");
            }

            setDisplayName(name.trim());
            setIsEditing(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка сохранения");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* User Info */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {displayName}
                    </h1>
                    {!isEditing && (
                        <button
                            onClick={handleEdit}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
                            title="Редактировать имя"
                        >
                            <Edit2 size={20} />
                        </button>
                    )}
                </div>
                <p className="text-gray-500 text-sm">
                    {user.email}
                </p>
            </div>

            {/* Edit Mode */}
            {isEditing && (
                <div className="mb-6 space-y-3">
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Введите ваше имя"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={50}
                    />
                    {error && (
                        <p className="text-red-600 text-sm">{error}</p>
                    )}
                    <div className="flex gap-2">
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Check size={18} />
                            {loading ? "Сохранение..." : "Save Changes"}
                        </Button>
                        <Button
                            onClick={handleCancel}
                            disabled={loading}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <X size={18} />
                            Отмена
                        </Button>
                    </div>
                </div>
            )}

            {/* Divider */}
            <div className="h-px bg-gray-200"></div>
        </>
    );
}