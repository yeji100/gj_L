import React from 'react';
import { X, ShieldAlert, Check, RotateCcw } from 'lucide-react';
import { ALLERGY_LIST } from '../types/meal';

interface AllergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAllergies: number[];
  onToggleAllergy: (code: number) => void;
  onResetAllergies: () => void;
}

export const AllergyModal: React.FC<AllergyModalProps> = ({
  isOpen,
  onClose,
  selectedAllergies,
  onToggleAllergy,
  onResetAllergies,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] shadow-2xl overflow-hidden flex flex-col border border-gray-100">
        {/* 헤더 */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">내 알레르기 안심 필터</h2>
              <p className="text-[11px] text-amber-100">주의해야 할 식품을 선택하면 식단에서 즉시 경고 표시됩니다</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 안내문 */}
        <div className="p-4 bg-amber-50/60 border-b border-amber-100 text-xs text-amber-800 flex items-center justify-between">
          <span>
            선택된 알레르기 식품: <strong className="font-bold text-amber-900">{selectedAllergies.length}개</strong>
          </span>
          {selectedAllergies.length > 0 && (
            <button
              onClick={onResetAllergies}
              className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-900 underline"
            >
              <RotateCcw className="w-3 h-3" />
              전체 초기화
            </button>
          )}
        </div>

        {/* 1~19번 나이스 표준 알레르기 그리드 */}
        <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {ALLERGY_LIST.map((item) => {
            const isChecked = selectedAllergies.includes(item.code);
            return (
              <button
                key={item.code}
                onClick={() => onToggleAllergy(item.code)}
                className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                  isChecked
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-500/20 font-bold'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isChecked ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {item.code}번
                  </span>
                  <span className="text-xs">{item.name}</span>
                </div>
                {isChecked && <Check className="w-4 h-4 text-white" />}
              </button>
            );
          })}
        </div>

        {/* 풋터 */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/25 transition-all text-center"
          >
            설정 완료
          </button>
        </div>
      </div>
    </div>
  );
};
