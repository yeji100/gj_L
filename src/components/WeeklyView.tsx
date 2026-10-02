import React from 'react';
import { ChevronLeft, ChevronRight, Flame, Calendar, ArrowRight } from 'lucide-react';
import { MealItem, DishInfo } from '../types/meal';

interface WeeklyViewProps {
  currentDate: string;
  onDateChange: (dateStr: string) => void;
  weeklyMeals: MealItem[];
  selectedAllergies: number[];
  onSelectMealDate: (dateFormatted: string) => void;
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({
  currentDate,
  onDateChange,
  weeklyMeals,
  selectedAllergies,
  onSelectMealDate,
}) => {
  // 1주일 단위 전/후 이동
  const shiftWeek = (weeks: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + weeks * 7);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    onDateChange(`${y}-${m}-${day}`);
  };

  // 주간 평균 칼로리 계산
  const validMeals = weeklyMeals.filter((m) => m.calorieValue > 0);
  const avgCalories =
    validMeals.length > 0
      ? Math.round(validMeals.reduce((acc, cur) => acc + cur.calorieValue, 0) / validMeals.length)
      : 0;

  const weekRangeText = weeklyMeals.length >= 5
    ? `${weeklyMeals[0].dateFormatted} ~ ${weeklyMeals[4].dateFormatted}`
    : '';

  const hasMyAllergy = (dish: DishInfo): boolean => {
    if (selectedAllergies.length === 0) return false;
    return dish.allergyCodes.some((code) => selectedAllergies.includes(code));
  };

  return (
    <div className="space-y-4">
      {/* 주간 이동 바 */}
      <div className="bg-white rounded-2xl p-3 shadow-xs border border-gray-100 flex items-center justify-between">
        <button
          onClick={() => shiftWeek(-1)}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors"
          title="이전 주"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <span className="text-xs text-emerald-700 font-bold block">거제중앙중학교 주간 식단</span>
          <span className="text-sm font-extrabold text-gray-900 tracking-tight">
            {weekRangeText}
          </span>
        </div>

        <button
          onClick={() => shiftWeek(1)}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors"
          title="다음 주"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 주간 요약 통계 */}
      {avgCalories > 0 && (
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>주간 5일 평균 열량: <strong className="font-bold text-orange-700">{avgCalories} Kcal</strong></span>
          </div>
          <span className="text-[11px] text-gray-500">
            총 {validMeals.length}일 제공
          </span>
        </div>
      )}

      {/* 5일간 식단 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {weeklyMeals.map((meal) => {
          const isSelected = meal.dateFormatted === currentDate;
          const hasFood = meal.dishes.length > 0;
          const allergicDishes = meal.dishes.filter(hasMyAllergy);

          return (
            <div
              key={meal.date}
              onClick={() => onSelectMealDate(meal.dateFormatted)}
              className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-50/80 border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white border-gray-100 hover:border-emerald-200 shadow-xs'
              }`}
            >
              <div>
                {/* 상단 요일 & 날짜 헤더 */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                        meal.dayOfWeek === '월'
                          ? 'bg-blue-100 text-blue-800'
                          : meal.dayOfWeek === '금'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {meal.dayOfWeek}
                    </span>
                    <span className="text-xs font-bold text-gray-700">
                      {meal.dateFormatted.substring(5)}
                    </span>
                  </div>

                  {allergicDishes.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white" title="설정한 알레르기 식품 포함">
                      주의 {allergicDishes.length}
                    </span>
                  )}
                </div>

                {/* 메뉴 목록 */}
                {hasFood ? (
                  <ul className="space-y-1.5 text-xs text-gray-800">
                    {meal.dishes.map((dish, i) => {
                      const isAllergic = hasMyAllergy(dish);
                      return (
                        <li
                          key={i}
                          className={`truncate ${
                            isAllergic ? 'text-amber-800 font-bold bg-amber-50 px-1 py-0.5 rounded' : ''
                          }`}
                          title={dish.fullName}
                        >
                          • {dish.name}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="py-8 text-center text-xs text-gray-400">
                    급식 없음
                  </div>
                )}
              </div>

              {/* 하단 칼로리 및 상세 링크 */}
              <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="font-bold text-orange-600">
                  {meal.calories || '-'}
                </span>
                <span className="text-emerald-700 flex items-center gap-0.5 font-semibold group-hover:underline">
                  상세 <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
