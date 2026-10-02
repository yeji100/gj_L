import React, { useState } from 'react';
import { X, FileText, CheckCircle2, School, Database, Calendar, ShieldCheck, ChevronRight } from 'lucide-react';
import { PRD_META, PRD_SECTIONS } from '../data/prdData';

interface PrdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrdModal: React.FC<PrdModalProps> = ({ isOpen, onClose }) => {
  const [activeSectionId, setActiveSectionId] = useState(PRD_SECTIONS[0].id);

  if (!isOpen) return null;

  const currentSection = PRD_SECTIONS.find((s) => s.id === activeSectionId) || PRD_SECTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* 상단 헤더 */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                  Product Requirements Document
                </span>
                <span className="text-xs text-slate-300 font-mono">v1.0.0</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
                {PRD_META.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 메타 카드 영역 */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <School className="w-3.5 h-3.5 text-emerald-600" />
              {PRD_META.targetSchool}
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <Database className="w-3.5 h-3.5 text-teal-600" />
              학교코드: <strong className="font-mono text-slate-700">{PRD_META.schoolCode}</strong>
            </span>
          </div>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
            <Calendar className="w-3 h-3 text-slate-400" />
            {PRD_META.date}
          </span>
        </div>

        {/* 메인 2열 레이아웃: 좌측 네비 목차, 우측 본문 */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* 좌측 목차 탭 */}
          <div className="w-full md:w-72 bg-slate-50/80 border-r border-slate-200 p-3 overflow-y-auto space-y-1 shrink-0">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
              PRD 목차 (Sections)
            </div>
            {PRD_SECTIONS.map((sec) => {
              const isActive = sec.id === activeSectionId;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm font-bold'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                >
                  <span className="truncate pr-1">{sec.title}</span>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* 우측 본문 */}
          <div className="flex-1 p-6 overflow-y-auto bg-white space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                {currentSection.badge || 'Document'}
              </span>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                {currentSection.title}
              </h3>
            </div>

            {/* 마크다운 스타일 본문 렌더링 */}
            <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed space-y-3">
              {currentSection.content.split('\n\n').map((paragraph, idx) => {
                // 헤딩 처리
                if (paragraph.startsWith('### ')) {
                  return (
                    <h4 key={idx} className="text-sm font-bold text-slate-900 mt-4 mb-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      {paragraph.replace('### ', '')}
                    </h4>
                  );
                }

                // 표 처리
                if (paragraph.includes('|')) {
                  const rows = paragraph
                    .trim()
                    .split('\n')
                    .filter((r) => !r.includes('---'));
                  const headers = rows[0]?.split('|').filter(Boolean).map((s) => s.trim()) || [];
                  const bodyRows = rows.slice(1).map((r) => r.split('|').filter(Boolean).map((s) => s.trim()));

                  return (
                    <div key={idx} className="overflow-x-auto my-3 rounded-xl border border-slate-200">
                      <table className="min-w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                          <tr>
                            {headers.map((h, i) => (
                              <th key={i} className="px-3 py-2">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                          {bodyRows.map((r, ri) => (
                            <tr key={ri} className="hover:bg-slate-50/50">
                              {r.map((cell, ci) => (
                                <td key={ci} className="px-3 py-2 font-mono text-[11px]">
                                  {cell.replace(/`/g, '')}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                // 리스트 아이템 처리
                if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n').filter(Boolean);
                  return (
                    <ul key={idx} className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                      {items.map((it, ii) => (
                        <li key={ii} className="leading-relaxed">
                          {it.replace(/^[\*\-]\s+/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
                        </li>
                      ))}
                    </ul>
                  );
                }

                // 일반 문단
                return (
                  <p key={idx} className="text-xs text-slate-600 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        {/* 풋터 */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-emerald-800 font-medium text-[11px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>나이스(NEIS) 교육정보 개방포털 실시간 데이터 규격 준수</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
