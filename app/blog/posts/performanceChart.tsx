"use client"

import { Calendar, Download } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { useState, useEffect, useMemo } from 'react'

// --- 1. Определение типов ---
interface StatisticEntry {
  date: string; // Формат: YYYY-MM-DD
  count: number;
}

interface ApiData {
  statistics: StatisticEntry[];
  summary: {
    month: string;
    averagePerDay: number;
  };
}

interface ChartData {
  date: string; 
  value: number; 
}



function getTodayKeyLocal(): string {
    const now = new Date();
    
    
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

// --- 2. Custom Tick Component для Оси X ---
const CustomXAxisTick = (props: any, todayKey: string) => {
    const { x, y, payload } = props;
    const dateKey = payload.value;
    const isToday = dateKey === todayKey;
    
    // Получаем только число дня для отображения
    const dayNumber = new Date(dateKey + 'T00:00:00').getDate(); // Безопасное парсирование
    
    return (
        <g transform={`translate(${x},${y})`}>
            <text 
                x={0} 
                y={0} 
                dy={16} 
                textAnchor="middle" 
                // Выделяем цветом
                fill={isToday ? '#1e40af' : '#6b7280'} 
                fontWeight={isToday ? 'bold' : 'normal'}
                fontSize={12}
            >
                {dayNumber}
            </text>
        </g>
    );
};


export function PerformanceChart() {
  const API_URL = 'api/statistics';

  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const todayKey = useMemo(() => getTodayKeyLocal(), []); 


  useEffect(() => {
    async function fetchData() {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            
            if (result.success && result.data) {
                setApiData(result.data);
            } else {
                setError(result.error || 'API вернул неуспешный статус.'); 
            }
        } catch (e) {
            console.error("Fetching data failed:", e);
            setError(e instanceof Error ? e.message : 'Неизвестная ошибка при загрузке данных.');
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, []);

  // --- Преобразование данных для Recharts ---
  const chartData: ChartData[] = useMemo(() => {
    if (!apiData?.statistics || apiData.statistics.length === 0) return []; 

    return apiData.statistics.map(item => ({
        date: item.date, 
        value: item.count,
    }));
  }, [apiData]);


  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 10];
    const max = Math.max(...chartData.map(d => d.value));
    const min = Math.min(...chartData.map(d => d.value));
    return [Math.max(0, Math.floor(min * 0.9)), Math.ceil(max * 1.1 + 1)]; 
  }, [chartData]);


  // --- Обработка состояний Загрузки/Ошибки ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px] bg-white rounded-2xl border border-gray-200">
        <p className="text-gray-600">Загрузка статистики...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[400px] bg-white rounded-2xl border border-red-200">
        <p className="text-red-600">Ошибка: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-2 lg:gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-medium text-gray-900">Ежедневная активность</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full border border-gray-300">
            <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">#</span>
            </div>
            <span className="text-sm font-medium text-gray-700">
                {apiData?.summary.month || 'Текущий месяц'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-2 lg:gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {['1W', '1M', '3M', '6M'].map((period) => (
              <button
                key={period}
                className={`px-3 md:px-2 lg:px-3 py-1 text-sm md:text-xs lg:text-sm rounded-md transition-colors ${
                  period === '1M' 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-gray-800 bg-gray-100 rounded-lg transition-colors">
              <Calendar className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-800 bg-gray-100 rounded-lg transition-colors">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            
            {/* ОСЬ X: Используем кастомный компонент для выделения сегодняшней даты */}
            <XAxis 
              dataKey="date" 
              // Передаем CustomXAxisTick как функцию, обернутую в лямбда, чтобы передать todayKey
              tick={(props) => CustomXAxisTick(props, todayKey)} 
              interval="preserveStartEnd"
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
            />
            
            <YAxis 
              dataKey="value"
              domain={yDomain}
              ticks={[0, 1, 2, 3, 4, 5]}
              orientation="left" 
              tick={{ fill: '#6b7280', fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
              label={{ 
                value: 'Постов в день', 
                angle: -90, 
                position: 'insideLeft', 
                fill: '#6b7280', 
                style: { textAnchor: 'middle', fontSize: 12 }
              }}
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px', 
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
              }}
              labelStyle={{ color: '#1f2937' }}
              formatter={(value) => [
                `${value} постов`, 
                'Количество'
              ]}
              labelFormatter={(label) => {
                const date = new Date(label + 'T00:00:00');
                if (isNaN(date.getTime())) return label;
                const formattedDate = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
                
                return label === todayKey ? `${formattedDate} (Сегодня)` : formattedDate;
              }}
            />
            
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6"
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      
    </div>
  )
}