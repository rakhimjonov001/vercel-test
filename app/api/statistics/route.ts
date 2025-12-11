import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function formatDateUTC(date: Date) {
  return date.toISOString().split('T')[0];
}

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();

    // 1-е число месяца UTC
    const startDate = new Date(Date.UTC(year, month, 1));
    const todayKey = formatDateUTC(now);

    // Получаем все посты с начала месяца
    const posts = await prisma.post.findMany({
      where: { createdAt: { gte: startDate, lte: now } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' }
    });

    // Создаём массив дней с нулями
    const statistics: { date: string; count: number }[] = [];
    let iter = new Date(startDate);
    while (formatDateUTC(iter) <= todayKey) {
      statistics.push({ date: formatDateUTC(iter), count: 0 });
      iter.setUTCDate(iter.getUTCDate() + 1);
    }

    // Считаем посты по дням
    posts.forEach(post => {
      const key = formatDateUTC(post.createdAt);
      const day = statistics.find(s => s.date === key);
      if (day) day.count += 1;
    });

    const postsThisMonth = posts.length;
    const totalPosts = await prisma.post.count();
    const monthName = now.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });

    return NextResponse.json({
      success: true,
      data: {
        statistics,
        summary: {
          total: totalPosts,
          thisMonth: postsThisMonth,
          month: monthName
        }
      }
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Ошибка получения статистики' }, { status: 500 });
  }
}
