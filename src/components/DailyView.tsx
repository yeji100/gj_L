import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Flame,
  Share2,
  Check,
  Clock,
  ChevronDown,
  BookOpen,
  Info,
} from 'lucide-react';
import { MealItem, DishInfo } from '../types/meal';
import { ALLERGY_ICONS } from '../utils/allergyMeta';
import { formatDate } from '../utils/mealParser';

interface DailyViewProps {
  currentDate: string; // YYYY-MM-DD
  onDateChange: (newDate: string) => void;
  meal?: MealItem;
  selectedAllergies: number[];
  onOpenNutritionModal: () => void;
  onOpenAllergyModal: () => void;
}

export const DailyView: React.FC<DailyViewProps> = ({
  currentDate,
  onDateChange,
  meal,
  selectedAllergies,
  onOpenNutritionModal,
  onOpenAllergyModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [showMicronutrients, setShowMicronutrients] = useState(false);

  // 날짜 계산 (하루 전, 하루 후)
  const shiftDate = (days: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    onDateChange(`${y}-${m}-${day}`);
  };

  const isToday = () => {
    return currentDate === '2026-10-02';
  };

  const handleShare = () => {
    const currentInfo = formatDate(currentDate);
    let text = `[거제중앙중학교 급식 알리미]\n📅 ${currentInfo.fullKoreanDate}\n`;
    if (meal && meal.dishes.length > 0) {
      text += meal.dishes.map((d, i) => `${i + 1}. ${d.fullName}`).join('\n') +
        `\n🔥 열량: ${meal.calories || '정보 없음'}`;
    } else {
      text += '급식이 제공되지 않는 날입니다.';
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 내 알레르기가 포함되어 있는지 검사
  const hasMyAllergy = (dish: DishInfo): boolean => {
    if (selectedAllergies.length === 0) return false;
    return dish.allergyCodes.some((code) => selectedAllergies.includes(code));
  };

  // 현재 날짜의 한국어 전체 표기 (요일 포함 보장: 주말/휴일도 무조건 요일 표시!)
  const dateMeta = formatDate(currentDate);

  // 칼로리 권장치 대비 백분율 (중학생 중식 권장량 기준 약 850 Kcal)
  const calorieVal = meal?.calorieValue || 0;
  const caloriePercent = calorieVal > 0 ? Math.min(100, Math.round((calorieVal / 850) * 100)) : 0;

  // 3대 영양소 추출
  const carbs = meal?.nutrition['탄수화물(g)'] || meal?.nutrition['탄수화물'] || '0';
  const protein = meal?.nutrition['단백질(g)'] || meal?.nutrition['단백질'] || '0';
  const fat = meal?.nutrition['지방(g)'] || meal?.nutrition['지방'] || '0';

  // 미량 영양소 추출 (비타민, 무기질)
  const microNutrients = meal?.nutrition
    ? Object.entries(meal.nutrition).filter(
        ([k]) => !k.includes('탄수화물') && !k.includes('단백질') && !k.includes('지방')
      )
    : [];

  return (
    <div className="space-y-4">
      {/* 1. 상단 연동 안내 및 테스트 식단 바로가기 띠 (이미지 형식) */}
      <div className="rounded-2xl bg-emerald-50/90 border border-emerald-200/80 px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2 text-slate-700 min-w-0 truncate">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
          <span className="font-semibold text-slate-800">
            NEIS 공식 식단 데이터 실시간 연동 중
          </span>
          <span className="text-slate-400 hidden sm:inline">·</span>
          <span className="text-slate-600 truncate hidden sm:inline">
            경상남도 거제시 중곡로 45 (거제중앙중학교)
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">테스트 식단 바로가기:</span>
          <button
            onClick={() => onDateChange('2026-10-02')}
            className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-[11px] font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            오늘 식단 (10/02)
          </button>
          <button
            onClick={() => onDateChange('2026-09-30')}
            className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-[11px] font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            탄두리치킨 식단
          </button>
          <button
            onClick={() => onDateChange('2026-09-17')}
            className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-[11px] font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            직화짬뽕국 식단
          </button>
        </div>
      </div>

      {/* 2. 날짜 제어 컨트롤 바 (이미지 형식과 100% 일치) */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* 좌측: < 오늘 > 버튼 그룹 */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => shiftDate(-1)}
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors cursor-pointer shadow-2xs"
            title="이전 날짜"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDateChange('2026-10-02')}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              isToday()
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            오늘
          </button>

          <button
            onClick={() => shiftDate(1)}
            className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors cursor-pointer shadow-2xs"
            title="다음 날짜"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 우측: 달력 선택 인풋 + 날짜/요일 텍스트 (급식 없는 날도 요일 반드시 표기!) */}
        <div className="flex items-center gap-3">
          <label className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-white text-xs font-semibold text-slate-700 cursor-pointer transition-colors shadow-2xs">
            <CalendarIcon className="w-4 h-4 text-emerald-600" />
            <span className="font-mono">{currentDate}</span>
            <CalendarIcon className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <input
              type="date"
              value={currentDate}
              onChange={(e) => {
                if (e.target.value) onDateChange(e.target.value);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>

          <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {dateMeta.fullKoreanDate}
          </div>
        </div>
      </div>

      {/* 3. 메인 2열 그리드: 좌측 메인 식단 카드 / 우측 영양정보 & 원산지 사이드바 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* 좌측 식단 메인 카드 (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs">
          {/* 카드 상단 다크 틸 헤더 (이미지와 100% 동일) */}
          <div className="bg-[#03593b] text-white p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#02442d] text-emerald-200 font-bold text-xs border border-emerald-700/50">
                  {meal?.dishes && meal.dishes.length > 0 ? meal.mealType || '중식' : '급식 미제공'}
                </span>
                <span className="text-xs text-emerald-200 font-medium">
                  {meal?.headcount
                    ? `급식 인원: ${meal.headcount.toLocaleString()}명`
                    : '거제중앙중학교'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {dateMeta.fullKoreanDate}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {meal && meal.calorieValue > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/25 text-amber-300 font-black text-sm border border-white/10 shadow-inner">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>{meal.calories}</span>
                </div>
              )}

              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
                title="식단 복사 및 공유"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 카드 본문: 메뉴 리스트 */}
          {meal && meal.dishes.length > 0 ? (
            <div className="p-5 sm:p-6 space-y-4">
              {/* 메뉴 구성 서브헤더 */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                <span className="font-bold text-slate-600">
                  오늘의 메뉴 구성 ({meal.dishes.length}종)
                </span>
                <button
                  onClick={onOpenAllergyModal}
                  className="font-bold text-emerald-700 hover:text-emerald-900 transition-colors flex items-center gap-0.5 cursor-pointer"
                >
                  알레르기 설정 변경 →
                </button>
              </div>

              {/* 요리 목록 (이미지 형식과 100% 일치) */}
              <div className="space-y-3">
                {meal.dishes.map((dish, idx) => {
                  const isAllergic = hasMyAllergy(dish);

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                        isAllergic
                          ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/20 shadow-xs'
                          : 'bg-white border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      {/* 번호 + 요리명 */}
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                          {dish.name}
                        </span>
                      </div>

                      {/* 알레르기 칩 목록 (이모지 + 텍스트 뱃지) */}
                      {dish.allergyCodes.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap sm:justify-end pl-9 sm:pl-0">
                          {dish.allergyCodes.map((code) => {
                            const meta = ALLERGY_ICONS[code] || {
                              name: `${code}번`,
                              emoji: '⚠️',
                              bg: 'bg-slate-50',
                              text: 'text-slate-700',
                              border: 'border-slate-200',
                            };
                            const isMyAllergy = selectedAllergies.includes(code);

                            return (
                              <span
                                key={code}
                                className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg border font-medium transition-colors ${
                                  isMyAllergy
                                    ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-xs'
                                    : `${meta.bg} ${meta.text} ${meta.border}`
                                }`}
                                title={`${code}번: ${meta.name}`}
                              >
                                <span>{meta.emoji}</span>
                                <span>{meta.name}</span>
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 하단 일일 권장 중식 열량 게이지 바 (이미지 형식과 일치) */}
              <div className="pt-4 mt-2 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>중학생 일일 권장 중식 열량 (~850 Kcal)</span>
                  <span className="font-extrabold text-emerald-800">{caloriePercent}% 섭취</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${caloriePercent}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* 급식 미제공 날 (주말/공휴일 등) */
            <div className="p-8 sm:p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <CalendarIcon className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">
                {dateMeta.fullKoreanDate}은 급식이 제공되지 않습니다.
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                주말, 공휴일, 재량휴업일 또는 방학 기간에는 중식이 운영되지 않습니다.
                상단 컨트롤 바의 [오늘] 또는 날짜 이동 버튼을 이용해 다른 날짜를 조회하세요.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onDateChange('2026-10-02')}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 transition-colors cursor-pointer shadow-xs"
                >
                  오늘 식단 바로가기 (2026년 10월 2일 금요일)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 우측 사이드바 (4 cols - 이미지 형식과 100% 동일한 2개 카드) */}
        <div className="lg:col-span-4 space-y-4">
          {/* 카드 1: 영양 성분 정보 */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  영양 성분 정보
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">나이스 공식</span>
            </div>

            {/* 탄수화물, 단백질, 지방 3열 박스 */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-500 font-semibold block">탄수화물</span>
                <span className="text-sm sm:text-base font-black text-slate-900 block">{carbs}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-500 font-semibold block">단백질</span>
                <span className="text-sm sm:text-base font-black text-slate-900 block">{protein}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-500 font-semibold block">지방</span>
                <span className="text-sm sm:text-base font-black text-slate-900 block">{fat}</span>
              </div>
            </div>

            {/* 상세 비타민 및 무기질 보기 버튼 */}
            <button
              onClick={() => setShowMicronutrients(!showMicronutrients)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>상세 비타민 및 무기질 보기</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMicronutrients ? 'rotate-180' : ''}`} />
            </button>

            {/* 펼침 영역 */}
            {showMicronutrients && (
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs animate-in fade-in">
                {microNutrients.length > 0 ? (
                  microNutrients.map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-600">{key}</span>
                      <span className="font-bold text-slate-900">{val}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-400 text-center py-2">상세 영양정보가 없습니다.</p>
                )}
              </div>
            )}
          </div>

          {/* 카드 2: 식재료 원산지 표시 */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  식재료 원산지 표시
                </h3>
              </div>
              <button
                onClick={onOpenNutritionModal}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
              >
                전체보기
              </button>
            </div>

            {/* 원산지 리스트 (이미지 형식과 일치) */}
            {meal && meal.originInfo.length > 0 ? (
              <div className="space-y-2 text-xs">
                {meal.originInfo.slice(0, 6).map((origin, idx) => {
                  const parts = origin.split(':');
                  const item = parts[0]?.trim();
                  const country = parts[1]?.trim() || '';
                  return (
                    <div key={idx} className="flex items-center justify-between py-1">
                      <span className="text-slate-700 font-medium">{item}</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-800 text-[11px]">
                        {country}
                      </span>
                    </div>
                  );
                })}

                {meal.originInfo.length > 6 && (
                  <div className="text-center pt-2 text-[11px] text-slate-400 font-medium">
                    외 {meal.originInfo.length - 6}개 품목
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">등록된 원산지 정보가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
