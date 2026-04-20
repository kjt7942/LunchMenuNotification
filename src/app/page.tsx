'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Utensils, Coffee, Moon, Sun } from 'lucide-react';
import { MealType, DietEntry } from '../domain/diet/types';

export default function DietPage() {
  const [diets, setDiets] = useState<DietEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // 샘플 데이터 (실제로는 notion을 통해 가져옴)
  useEffect(() => {
    setTimeout(() => {
      setDiets([
        { id: '1', date: '2026-04-19', type: '아침', menu: '오트밀과 블루베리', completed: true, calories: 350 },
        { id: '2', date: '2026-04-19', type: '점심', menu: '닭가슴살 샐러드', completed: false, calories: 450 },
        { id: '3', date: '2026-04-19', type: '저녁', menu: '그릴드 연어와 야채', completed: false, calories: 550 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getMealIcon = (type: MealType) => {
    switch (type) {
      case '아침': return <Sun className="text-orange-400" />;
      case '점심': return <Utensils className="text-emerald-400" />;
      case '저녁': return <Moon className="text-indigo-400" />;
      case '간식': return <Coffee className="text-amber-400" />;
    }
  };

  return (
    <div className="space-y-8">
      <section className="flex justify-between items-end">
        <div>
          <p className="text-gray-500 text-sm font-medium">2026년 4월 19일 일요일</p>
          <h2 className="text-3xl font-extrabold tracking-tight">오늘의 식단</h2>
        </div>
        <button className="bg-primary text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95">
          <Plus size={24} />
        </button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl" />
          ))
        ) : (
          <AnimatePresence>
            {diets.map((diet) => (
              <motion.div
                key={diet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl flex items-center justify-between card-hover cursor-pointer ${
                  diet.completed ? 'bg-secondary/10 border-secondary/20 border' : 'bg-card border border-transparent shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-background rounded-xl shadow-inner">
                    {getMealIcon(diet.type)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{diet.type}</p>
                    <h3 className="font-bold text-lg">{diet.menu}</h3>
                    <p className="text-sm text-gray-500">{diet.calories} kcal</p>
                  </div>
                </div>
                <div className={`p-2 rounded-full ${diet.completed ? 'bg-secondary text-white' : 'border-2 border-gray-200'}`}>
                  {diet.completed && <Check size={18} />}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <section className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h4 className="text-lg font-medium opacity-80">오늘 섭취 칼로리</h4>
            <p className="text-4xl font-black">1,350 <span className="text-lg font-normal opacity-70">/ 2,200 kcal</span></p>
          </div>
          <div className="w-24 h-24 rounded-full border-8 border-white/20 flex items-center justify-center relative">
            <div className="absolute inset-0 border-8 border-white rounded-full transition-all duration-1000" style={{ clipPath: 'inset(0 0 40% 0)' }}></div>
            <span className="text-xl font-bold">61%</span>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </section>
    </div>
  );
}
