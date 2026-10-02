import { MealItem, DishInfo, ALLERGY_LIST } from '../types/meal';

export const ALLERGY_ICONS: Record<number, { name: string; emoji: string; bg: string; text: string; border: string }> = {
  1: { name: '난류(달걀)', emoji: '🥚', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  2: { name: '우유', emoji: '🥛', bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' },
  3: { name: '메밀', emoji: '🌾', bg: 'bg-stone-50', text: 'text-stone-800', border: 'border-stone-200' },
  4: { name: '땅콩', emoji: '🥜', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  5: { name: '대두(콩)', emoji: '🌱', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  6: { name: '밀', emoji: '📦', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  7: { name: '고등어', emoji: '🐟', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  8: { name: '게', emoji: '🦀', bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
  9: { name: '새우', emoji: '🦐', bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
  10: { name: '돼지고기', emoji: '🐷', bg: 'bg-pink-50', text: 'text-pink-800', border: 'border-pink-200' },
  11: { name: '복숭아', emoji: '🍑', bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' },
  12: { name: '토마토', emoji: '🍅', bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
  13: { name: '아황산류', emoji: '🧪', bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
  14: { name: '호두', emoji: '🌰', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  15: { name: '닭고기', emoji: '🍗', bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' },
  16: { name: '쇠고기', emoji: '🥩', bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
  17: { name: '오징어', emoji: '🦑', bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
  18: { name: '조개류', emoji: '🦪', bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200' },
  19: { name: '잣', emoji: '🌲', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
};
