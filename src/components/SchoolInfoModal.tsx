import React from 'react';
import { X, School, MapPin, Phone, Globe, ShieldCheck, Database, Calendar } from 'lucide-react';

interface SchoolInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SchoolInfoModal: React.FC<SchoolInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        {/* 상단 헤더 */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">거제중앙중학교 정보</h3>
              <p className="text-[11px] text-emerald-200">Geoje Jungang Middle School</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 본문 정보 리스트 */}
        <div className="p-6 space-y-4 text-xs">
          <div className="space-y-2.5">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">소재지 (주소)</span>
                <span className="text-slate-600 text-[11px]">경상남도 거제시 중곡로 45 (고현동)</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
              <Database className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">NEIS 행정표준코드</span>
                <span className="text-slate-600 font-mono text-[11px]">학교코드: 9111045 / 교육청: S10 (경상남도교육청)</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">급식 운영 현황</span>
                <span className="text-slate-600 text-[11px]">직영 급식 (중식 제공, 친환경 우수 식재료 준용)</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
              <Calendar className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">탑재 데이터 범위</span>
                <span className="text-slate-600 text-[11px]">2021년 2월 ~ 2026년 10월 거제중앙중학교 실제 급식 식단 전수 탑재</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-[11px] leading-relaxed border border-emerald-200/70">
            💡 본 서비스는 교육부 나이스(NEIS) 교육정보 개방포털 공공데이터 식단정보 API와 거제중앙중학교 급식 식단표를 바탕으로 실시간 제공됩니다.
          </div>
        </div>

        {/* 닫기 버튼 */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
