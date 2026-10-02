import React from 'react';
import { X, Activity, Globe, Flame, Award, PieChart } from 'lucide-react';
import { MealItem } from '../types/meal';

interface NutritionModalProps {
  meal: MealItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NutritionModal: React.FC<NutritionModalProps> = ({ meal, isOpen, onClose }) => {
  if (!isOpen || !meal) return null;

  const nutritionEntries = Object.entries(meal.nutrition);

  // 영양 권장량 기준 (중학생 1끼 권장량 가이드 예시 기준)
  // 단백질 약 25~35g, 칼슘 약 300mg, 탄수화물 100~130g 등
  const getReferencePercent = (key: string, valStr: string): number => {
    const val = parseFloat(valStr);
    if (isNaN(val)) return 0;
    if (key.includes('탄수화물')) return Math.min(100, Math.round((val / 110) * 100));
    if (key.includes('단백질')) return Math.min(100, Math.round((val / 30) * 100));
    if (key.includes('지방')) return Math.min(100, Math.round((val / 20) * 100));
    if (key.includes('칼슘')) return Math.min(100, Math.round((val / 300) * 100));
    if (key.includes('철분')) return Math.min(100, Math.round((val / 4.5) * 100));
    if (key.includes('비타민C')) return Math.min(100, Math.round((val / 30) * 100));
    return Math.min(100, Math.round((val / 50) * 100));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] shadow-2xl overflow-hidden flex flex-col border border-gray-100">
        {/* 모달 상단 헤더 */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {meal.dateFormatted} ({meal.dayOfWeek}) 영양 & 원산지 정보
              </h2>
              <p className="text-[11px] text-emerald-100">거제중앙중학교 급식 식단표 상세 정보</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 바디 스크롤 영역 */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 열량 요약 카드 */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-orange-800 font-semibold">총 제공 열량</span>
                <div className="text-xl font-extrabold text-orange-950">{meal.calories || '정보 없음'}</div>
              </div>
            </div>
            {meal.headcount && (
              <div className="text-right">
                <span className="text-[11px] text-gray-500">급식 인원수</span>
                <div className="text-sm font-bold text-gray-800">{meal.headcount.toLocaleString()}명</div>
              </div>
            )}
          </div>

          {/* 영양 정보 목록 */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <PieChart className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-gray-900">영양 성분 분석표</h3>
            </div>
            {nutritionEntries.length > 0 ? (
              <div className="space-y-2.5">
                {nutritionEntries.map(([key, val]) => {
                  const percent = getReferencePercent(key, val);
                  return (
                    <div key={key} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700">{key}</span>
                        <span className="font-bold text-emerald-800">{val}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-gray-400 py-3 text-center bg-gray-50 rounded-xl">
                등록된 상세 영양성분 정보가 없습니다.
              </div>
            )}
          </div>

          {/* 원산지 정보 목록 */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <Globe className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-gray-900">식재료 원산지 정보</h3>
            </div>
            {meal.originInfo.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {meal.originInfo.map((origin, index) => {
                  const parts = origin.split(':');
                  const item = parts[0]?.trim();
                  const country = parts[1]?.trim() || '';
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50/50 border border-blue-100 text-xs"
                    >
                      <span className="font-medium text-gray-800">{item}</span>
                      <span className="font-bold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200 text-[11px]">
                        {country}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-gray-400 py-3 text-center bg-gray-50 rounded-xl">
                등록된 원산지 정보가 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 닫기 버튼 */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-900 text-white font-semibold text-xs transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
