"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Check, X, Trash2, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";

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
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState("");

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

    const handleDelete = async () => {
        setDeleteLoading(true);
        setDeleteError("");
        try {
            const res = await fetch("/api/profile", { method: "DELETE" });
            if (!res.ok) throw new Error();
            await signOut({ callbackUrl: "/" });
        } catch (err) {
            setDeleteError("Не удалось удалить аккаунт. Попробуйте ещё раз.");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <>
            {/* User Info */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-gray-700">
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
                        className="w-full text-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Danger zone */}
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.2em] text-red-500">
                            Опасная зона
                        </p>
                        <p className="text-sm text-red-700">
                            Удаление аккаунта навсегда удалит все ваши заметки и сессии.
                        </p>
                    </div>
                    <Button
                        variant="default"
                        size="sm"
                        className="gap-2 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        onClick={() => setDeleteOpen(true)}
                    >
                        <Trash2 className="w-4 h-4" />
                        Удалить
                    </Button>
                </div>
            </div>

            {deleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-white p-6 shadow-2xl">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Удалить аккаунт?
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Это действие удалит аккаунт, все ваши заметки и сессии. Вы уверены?
                        </p>
                        {deleteError && (
                            <p className="text-sm text-red-600 mb-3">{deleteError}</p>
                        )}
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
                                Отмена
                            </Button>
                            <Button
                                variant="default"
                                className="gap-2 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                                disabled={deleteLoading}
                                onClick={handleDelete}
                            >
                                {deleteLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Удаляем...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Да, удалить
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}