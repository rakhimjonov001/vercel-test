import prisma from "@/lib/prisma";
import Link from "next/link";
import { PerformanceChart } from "./performanceChart";




export default async function Posts() {
 
    const posts = await prisma.post.findMany({
        include: {
            author: true,
        },
        take: 10, 
        orderBy: {
            createdAt: 'desc',
        }
    });

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-10 tracking-tight">
                Обзор Блога 🚀
            </h1>

            {/* 1. БЛОК СТАТИСТИКИ И ГРАФИКА */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
                    Статистика Активности
                </h2>
                <PerformanceChart />
            </section>
            
            {/* 2. БЛОК СПИСКА ПОСТОВ */}
            <section>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
                    Последние Посты ({posts.length})
                </h2>
                <ul className="max-w-3xl space-y-4">
                    {posts.map((post) => (
                        <li 
                            key={post.id}
                            className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                            <Link href={`/blog/posts/${post.id}`}>
                                <div className="flex justify-between items-start">
                                    <span className="font-extrabold text-lg text-blue-600 hover:text-blue-700 transition-colors">
                                        {post.title}
                                    </span>
                                 
                                    <span className="text-sm text-gray-500 ml-4 flex-shrink-0">
                                        {new Date(post.createdAt).toLocaleDateString('ru-RU', { 
                                            year: 'numeric', 
                                            month: 'short', 
                                            day: 'numeric' 
                                        })}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-700 mt-1">
                                    by <span className="font-medium text-gray-800">{post.author.name}</span> 
                                    {post.author.email && <span className="text-gray-500 ml-1">({post.author.email})</span>}
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}