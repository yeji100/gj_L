/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Utensils,
  Calendar,
  CalendarRange,
  Search,
  FileText,
  School,
  ExternalLink,
} from 'lucide-react';
import { Header } from './components/Header';
import { DailyView } from './components/DailyView';
import { WeeklyView } from './components/WeeklyView';
import { MonthlyView } from './components/MonthlyView';
import { SearchView } from './components/SearchView';
import { AllergyModal } from './components/AllergyModal';
import { NutritionModal } from './components/NutritionModal';
import { NeisSyncModal } from './components/NeisSyncModal';
import { PrdModal } from './components/PrdModal';
import { SchoolInfoModal } from './components/SchoolInfoModal';
import {
  getMealByDate,
  getWeeklyMeals,
  getSavedAllergies,
  saveAllergies,
} from './data/mealStore';
import { PRD_SECTIONS, PRD_META } from './data/prdData';

type TabType = 'daily' | 'weekly' | 'monthly' | 'search' | 'prd';

export default function App() {
  // 오늘 날짜 (2026-10-02 금요일)
  const TODAY_STR = '2026-10-02';

  const [currentDate, setCurrentDate] = useState<string>(TODAY_STR);
  const [activeTab, setActiveTab] = useState<TabType>('daily');

  // 모달 상태
  const [isAllergyModalOpen, setIsAllergyModalOpen] = useState(false);
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isPrdModalOpen, setIsPrdModalOpen] = useState(false);
  const [isSchoolInfoModalOpen, setIsSchoolInfoModalOpen] = useState(false);

  // 알레르기 필터 상태
  const [selectedAllergies, setSelectedAllergies] = useState<number[]>(() => getSavedAllergies());

  // 동기화 상태 텍스트
  const [lastSyncedText, setLastSyncedText] = useState('2026년 10월 거제중앙중학교 식단');

  // 알레르기 토글 핸들러
  const handleToggleAllergy = (code: number) => {
    setSelectedAllergies((prev) => {
      const next = prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code];
      saveAllergies(next);
      return next;
    });
  };

  const handleResetAllergies = () => {
    setSelectedAllergies([]);
    saveAllergies([]);
  };

  // 현재 날짜의 식단
  const currentYmd = currentDate.replace(/-/g, '');
  const currentMeal = useMemo(() => getMealByDate(currentYmd), [currentYmd]);

  // 주간 식단
  const weeklyMeals = useMemo(() => getWeeklyMeals(currentDate), [currentDate]);

  // 날짜 선택 시 일간 뷰로 이동
  const handleSelectMealDate = (dateFormatted: string) => {
    setCurrentDate(dateFormatted);
    setActiveTab('daily');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* 1. 상단 헤더 (이미지와 100% 동일) */}
      <Header
        onOpenAllergyModal={() => setIsAllergyModalOpen(true)}
        onOpenPrdModal={() => setIsPrdModalOpen(true)}
        onOpenSchoolInfoModal={() => setIsSchoolInfoModalOpen(true)}
        selectedAllergyCount={selectedAllergies.length}
      />

      {/* 2. 메인 컨테이너 */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 space-y-5">
        {/* 네비게이션 탭 바 */}
        <div className="bg-white p-1.5 rounded-2xl shadow-2xs border border-slate-200/80 flex items-center justify-between gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 min-w-[76px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'daily'
                ? 'bg-[#037847] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Utensils className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">일별 식단</span>
          </button>

          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex-1 min-w-[76px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'weekly'
                ? 'bg-[#037847] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CalendarRange className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">주간 식단표</span>
          </button>

          <button
            onClick={() => setActiveTab('monthly')}
            className={`flex-1 min-w-[76px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'monthly'
                ? 'bg-[#037847] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">월간 달력</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 min-w-[76px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'search'
                ? 'bg-[#037847] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Search className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">식단 검색</span>
          </button>

          <button
            onClick={() => setActiveTab('prd')}
            className={`flex-1 min-w-[76px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'prd'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="whitespace-nowrap">기획서 (PRD)</span>
          </button>
        </div>

        {/* 탭 콘텐츠 영역 */}
        {activeTab === 'daily' && (
          <DailyView
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            meal={currentMeal}
            selectedAllergies={selectedAllergies}
            onOpenNutritionModal={() => setIsNutritionModalOpen(true)}
            onOpenAllergyModal={() => setIsAllergyModalOpen(true)}
          />
        )}

        {activeTab === 'weekly' && (
          <WeeklyView
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            weeklyMeals={weeklyMeals}
            selectedAllergies={selectedAllergies}
            onSelectMealDate={handleSelectMealDate}
          />
        )}

        {activeTab === 'monthly' && (
          <MonthlyView
            currentDate={currentDate}
            onSelectMealDate={handleSelectMealDate}
            selectedAllergies={selectedAllergies}
          />
        )}

        {activeTab === 'search' && (
          <SearchView
            onSelectMealDate={handleSelectMealDate}
            selectedAllergies={selectedAllergies}
          />
        )}

        {activeTab === 'prd' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                PRD Document
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
                {PRD_META.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {PRD_META.subtitle}
              </p>
            </div>

            <div className="space-y-8">
              {PRD_SECTIONS.map((sec) => (
                <div key={sec.id} className="space-y-3 pb-6 border-b border-slate-100 last:border-0">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#037847]" />
                    {sec.title}
                  </h3>
                  <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line pl-4 border-l-2 border-slate-200">
                    {sec.content.replace(/###\s/g, '').replace(/\*\*/g, '')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 풋터 영역 */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500 space-y-2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">거제중앙중학교 급식 알리미</span>
            <span>• 경상남도 거제시 중곡로 45</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPrdModalOpen(true)}
              className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              PRD 기획서
            </button>
            <button
              onClick={() => setIsSchoolInfoModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <School className="w-3.5 h-3.5" />
              학교 정보
            </button>
            <a
              href="https://open.neis.go.kr/portal/data/service/selectServicePage.do?page=1&rows=10&sortColumn=&sortDirection=&infId=OPEN17320190722180924242823&infSeq=2"
              target="_blank"
              rel="noreferrer"
              className="text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              NEIS 포털 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        <p className="text-[10px] text-slate-400">
          본 서비스의 식단 데이터는 교육부 나이스(NEIS) 교육정보 개방포털 OpenAPI 및 거제중앙중학교 영양식단표를 바탕으로 제공됩니다.
        </p>
      </footer>

      {/* 알레르기 설정 모달 */}
      <AllergyModal
        isOpen={isAllergyModalOpen}
        onClose={() => setIsAllergyModalOpen(false)}
        selectedAllergies={selectedAllergies}
        onToggleAllergy={handleToggleAllergy}
        onResetAllergies={handleResetAllergies}
      />

      {/* 영양/원산지 상세 모달 */}
      <NutritionModal
        meal={currentMeal || null}
        isOpen={isNutritionModalOpen}
        onClose={() => setIsNutritionModalOpen(false)}
      />

      {/* NEIS 실시간 동기화 모달 */}
      <NeisSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onSyncComplete={(count) => {
          if (count > 0) {
            setLastSyncedText(`실시간 최신 ${count}건 동기화 완료`);
          }
        }}
      />

      {/* PRD 기획서 모달 뷰어 */}
      <PrdModal
        isOpen={isPrdModalOpen}
        onClose={() => setIsPrdModalOpen(false)}
      />

      {/* 학교 정보 모달 */}
      <SchoolInfoModal
        isOpen={isSchoolInfoModalOpen}
        onClose={() => setIsSchoolInfoModalOpen(false)}
      />
    </div>
  );
}
