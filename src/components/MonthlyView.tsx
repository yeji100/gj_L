import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Flame, ShieldAlert, Calendar as CalendarIcon } from 'lucide-react';
import { MealItem, DishInfo } from '../types/meal';
import { getMonthlyMeals, getMealByDate } from '../data/mealStore';

interface MonthlyViewProps {
  currentDate: string; // YYYY-MM-DD
  onSelectMealDate: (dateFormatted: string) => void;
  selectedAllergies: number[];
}

export const MonthlyView: React.FC<MonthlyViewProps> = ({
  currentDate,
  onSelectMealDate,
  selectedAllergies,
}) => {
  // 현재 보고 있는 연도와 월 (초기값: currentDate 기준)
  const [year, setYear] = useState(() => parseInt(currentDate.substring(0, 4), 10));
  const [month, setMonth] = useState(() => parseInt(currentDate.substring(5, 7), 10));

  const shiftMonth = (delta: number) => {
    let nextM = month + delta;
    let nextY = year;
    if (nextM > 12) {
      nextM = 1;
      nextY++;
    } else if (nextM < 1) {
      nextM = 12;
      nextY--;
    }
    setYear(nextY);
    setMonth(nextM);
  };

  // 해당 월의 날짜들 계산
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0: 일요일
  const daysInMonth = new Date(year, month, 0).getDate();

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  // 해당 월 식단 데이터
  const monthlyMeals = getMonthlyMeals(year, month);
  const monthlyCount = monthlyMeals.length;

  const hasMyAllergy = (dish: DishInfo): boolean => {
    if (selectedAllergies.length === 0) return false;
    return dish.allergyCodes.some((code) => selectedAllergies.includes(code));
  };

  return (
    <div className="space-y-4">
      {/* 월간 이동 및 연도/월 선택 바 */}
      <div className="bg-white rounded-2xl p-3 shadow-xs border border-gray-100 flex items-center justify-between">
        <button
          onClick={() => shiftMonth(-1)}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors"
          title="이전 달"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {/* 연도 셀렉트 */}
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
            className="text-sm font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {[2021, 2022, 2023, 2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>

          {/* 월 셀렉트 */}
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value, 10))}
            className="text-sm font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>

          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 hidden sm:inline">
            급식 {monthlyCount}일
          </span>
        </div>

        <button
          onClick={() => shiftMonth(1)}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors"
          title="다음 달"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 달력 그리드 */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-gray-100 overflow-hidden">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs pb-2 border-b border-gray-100 text-gray-400">
          <div className="text-rose-500">일</div>
          <div>월</div>
          <div>화</div>
          <div>수</div>
          <div>목</div>
          <div>금</div>
          <div className="text-blue-500">토</div>
        </div>

        {/* 날짜 셀 그리드 */}
        <div className="grid grid-cols-7 gap-1.5 pt-2">
          {daysArray.map((dayNum, idx) => {
            if (dayNum === null) {
              return <div key={`empty-${idx}`} className="min-h-[85px] bg-transparent" />;
            }

            const ymd = `${year}${String(month).padStart(2, '0')}${String(dayNum).padStart(2, '0')}`;
            const formatted = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const meal = getMealByDate(ymd);

            const isToday = formatted === '2026-10-02';
            const isSelected = formatted === currentDate;
            const isWeekend = idx % 7 === 0 || idx % 7 === 6;

            const allergicCount = meal ? meal.dishes.filter(hasMyAllergy).length : 0;

            return (
              <div
                key={ymd}
                onClick={() => {
                  if (meal) {
                    onSelectMealDate(formatted);
                  }
                }}
                className={`min-h-[85px] p-1.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  meal
                    ? 'cursor-pointer hover:border-emerald-300 hover:shadow-xs'
                    : 'cursor-default opacity-60'
                } ${
                  isSelected
                    ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500/20'
                    : isToday
                    ? 'bg-amber-50/60 border-amber-300'
                    : meal
                    ? 'bg-white border-gray-100'
                    : 'bg-gray-50/50 border-gray-100'
                }`}
              >
                {/* 상단 날짜 숫자 */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      idx % 7 === 0
                        ? 'text-rose-500'
                        : idx % 7 === 6
                        ? 'text-blue-500'
                        : 'text-gray-800'
                    } ${
                      isToday ? 'bg-amber-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]' : ''
                    }`}
                  >
                    {dayNum}
                  </span>

                  {allergicCount > 0 && (
                    <span title="주의 알레르기 식품 포함">
                      <ShieldAlert className="w-3 h-3 text-amber-500" />
                    </span>
                  )}
                </div>

                {/* 메뉴 요약 미리보기 */}
                {meal && meal.dishes.length > 0 ? (
                  <div className="my-1 space-y-0.5 overflow-hidden">
                    <p className="text-[10px] text-gray-700 font-medium truncate leading-tight">
                      {meal.dishes[0]?.name}
                    </p>
                    {meal.dishes[1] && (
                      <p className="text-[9px] text-gray-500 truncate leading-tight hidden sm:block">
                        {meal.dishes[1]?.name}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-[10px] text-gray-300 text-center py-2">
                    {isWeekend ? '' : '급식없음'}
                  </div>
                )}

                {/* 하단 칼로리 뱃지 */}
                {meal && meal.calorieValue > 0 && (
                  <div className="text-[9px] font-bold text-orange-600 truncate text-right">
                    {Math.round(meal.calorieValue)}kcal
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
