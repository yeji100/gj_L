import React, { useState } from 'react';
import { Search, Flame, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { MealItem, DishInfo } from '../types/meal';
import { searchMealsByKeyword } from '../data/mealStore';

interface SearchViewProps {
  onSelectMealDate: (dateFormatted: string) => void;
  selectedAllergies: number[];
}

const POPULAR_KEYWORDS = [
  '돈가스',
  '치킨',
  '마라탕',
  '스파게티',
  '떡볶이',
  '피자',
  '삼겹살',
  '갈비찜',
  '탕수육',
  '스테이크',
  '볶음밥',
  '카레',
];

export const SearchView: React.FC<SearchViewProps> = ({ onSelectMealDate, selectedAllergies }) => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<MealItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (query: string) => {
    const q = query.trim();
    if (!q) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    const results = searchMealsByKeyword(q);
    setSearchResults(results);
    setHasSearched(true);
  };

  const handleKeywordClick = (word: string) => {
    setKeyword(word);
    handleSearch(word);
  };

  return (
    <div className="space-y-4">
      {/* 검색창 */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-gray-100 space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(keyword);
          }}
          className="relative"
        >
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="좋아하는 메뉴 검색 (예: 돈가스, 마라탕, 치킨, 피자...)"
            className="w-full pl-11 pr-24 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-gray-900"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            검색
          </button>
        </form>

        {/* 추천 인기 키워드 태그 */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            인기 메뉴:
          </span>
          {POPULAR_KEYWORDS.map((word) => (
            <button
              key={word}
              onClick={() => handleKeywordClick(word)}
              className={`text-xs px-2.5 py-1 rounded-xl transition-all ${
                keyword === word
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              #{word}
            </button>
          ))}
        </div>
      </div>

      {/* 검색 결과 목록 */}
      {hasSearched && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-gray-700">
              "{keyword}" 검색 결과: <strong className="text-emerald-600">{searchResults.length}건</strong>
            </span>
          </div>

          {searchResults.length > 0 ? (
            <div className="space-y-2.5">
              {searchResults.map((meal) => {
                return (
                  <div
                    key={meal.date}
                    onClick={() => onSelectMealDate(meal.dateFormatted)}
                    className="p-4 rounded-2xl bg-white border border-gray-100 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div>
                      {/* 날짜 배지 */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          {meal.dateFormatted} ({meal.dayOfWeek})
                        </span>
                        <span className="text-[11px] font-semibold text-orange-600 flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          {meal.calories}
                        </span>
                      </div>

                      {/* 요리 목록 (검색어 하이라이트) */}
                      <div className="flex flex-wrap gap-1.5 text-xs text-gray-800">
                        {meal.dishes.map((dish, i) => {
                          const isMatch =
                            keyword &&
                            dish.name.toLowerCase().includes(keyword.toLowerCase());
                          return (
                            <span
                              key={i}
                              className={`px-2 py-0.5 rounded-lg ${
                                isMatch
                                  ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300 ring-1 ring-amber-400/30'
                                  : 'bg-gray-50 text-gray-600 border border-gray-100'
                              }`}
                            >
                              {dish.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform shrink-0 self-end sm:self-center">
                      <span>식단 상세</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-xs">
              <p className="text-sm font-bold text-gray-700">검색된 메뉴가 없습니다.</p>
              <p className="text-xs text-gray-400 mt-1">
                다른 단어로 검색하시거나 추천 키워드를 눌러보세요.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
