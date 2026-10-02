import React from 'react';
import { School, ShieldAlert, FileText, Info } from 'lucide-react';

interface HeaderProps {
  onOpenAllergyModal: () => void;
  onOpenPrdModal: () => void;
  onOpenSchoolInfoModal: () => void;
  selectedAllergyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAllergyModal,
  onOpenPrdModal,
  onOpenSchoolInfoModal,
  selectedAllergyCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* 좌측: 학교 아이콘 및 학교명 */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#037847] flex items-center justify-center text-white shrink-0 shadow-xs shadow-emerald-800/20">
            <School className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-[#037847] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70">
                경상남도교육청
              </span>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                NEIS 공식 식단 연동
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5 mt-0.5 truncate">
              <span>거제중앙중학교</span>
              <span className="text-[#037847]">급식 알리미</span>
            </h1>
          </div>
        </div>

        {/* 우측 조작 버튼 3개 (이미지 형식과 100% 동일) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* PRD 기획서 문서 버튼 */}
          <button
            onClick={onOpenPrdModal}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="기획서 (PRD 문서) 보기"
          >
            <FileText className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">기획서 (PRD)</span>
          </button>

          {/* 알레르기 설정 버튼 */}
          <button
            onClick={onOpenAllergyModal}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              selectedAllergyCount > 0
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : 'bg-slate-100/90 text-slate-700 border-slate-200 hover:bg-slate-200/80'
            }`}
            title="알레르기 설정"
          >
            <ShieldAlert className={`w-4 h-4 ${selectedAllergyCount > 0 ? 'text-amber-600' : 'text-slate-600'}`} />
            <span>알레르기</span>
            {selectedAllergyCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-amber-500 text-white">
                {selectedAllergyCount}
              </span>
            )}
          </button>

          {/* 학교 정보 버튼 */}
          <button
            onClick={onOpenSchoolInfoModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            title="거제중앙중학교 정보"
          >
            <Info className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">학교 정보</span>
          </button>
        </div>
      </div>
    </header>
  );
};
