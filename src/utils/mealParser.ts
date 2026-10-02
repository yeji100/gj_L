import { MealItem, DishInfo, ALLERGY_LIST } from '../types/meal';

const allergyMap: Record<number, string> = ALLERGY_LIST.reduce((acc, curr) => {
  acc[curr.code] = curr.name;
  return acc;
}, {} as Record<number, string>);

/**
 * 요리명 문자열에서 알레르기 번호(예: 보리밥, 조랭이떡국1.5.6.9.13.16.)를 분리하고 파싱합니다.
 */
export function parseDish(dishText: string): DishInfo {
  const trimmed = dishText.trim();
  // 정규식: 끝부분에 오는 번호들 예: 1.5.6.9. 또는 (1.5.6.) 또는 5.16. 등
  // 알레르기 번호 패턴 찾기
  const matchWithParentheses = trimmed.match(/^(.*?)[(\s]*([\d\.]+)[)\s]*$/);
  
  let name = trimmed;
  const allergyCodes: number[] = [];

  if (matchWithParentheses) {
    const rawName = matchWithParentheses[1].trim();
    const rawCodes = matchWithParentheses[2];
    
    // 점(.)으로 구분된 숫자 파싱
    const codes = rawCodes
      .split('.')
      .map(c => parseInt(c.trim(), 10))
      .filter(c => !isNaN(c) && c >= 1 && c <= 19);

    if (codes.length > 0 && rawName.length > 0) {
      name = rawName;
      allergyCodes.push(...codes);
    }
  }

  // 중복 제거 및 정렬
  const uniqueCodes = Array.from(new Set(allergyCodes)).sort((a, b) => a - b);
  const allergyNames = uniqueCodes.map(code => allergyMap[code] || `${code}번 알레르기`);

  return {
    name,
    fullName: trimmed,
    allergyCodes: uniqueCodes,
    allergyNames,
  };
}

/**
 * 요리 목록 전체(br 태그로 구분된) 파싱
 */
export function parseDishesList(dishRaw: string): DishInfo[] {
  if (!dishRaw) return [];
  const lines = dishRaw
    .replace(/<br\s*\/?>/gi, '\n')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  return lines.map(parseDish);
}

/**
 * 칼로리 문자열 파싱 (예: "772.9 Kcal" -> 772.9)
 */
export function parseCalorieValue(caloriesStr: string): number {
  if (!caloriesStr) return 0;
  const match = caloriesStr.match(/([\d\.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

/**
 * 영양성분 문자열 파싱
 * 예: "탄수화물(g) : 110.1<br/>단백질(g) : 33.1<br/>..."
 */
export function parseNutrition(nutritionRaw: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!nutritionRaw) return result;

  const lines = nutritionRaw
    .replace(/<br\s*\/?>/gi, '\n')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  for (const line of lines) {
    const parts = line.split(':');
    if (parts.length === 2) {
      result[parts[0].trim()] = parts[1].trim();
    }
  }
  return result;
}

/**
 * 원산지 정보 파싱
 */
export function parseOrigin(originRaw: string): string[] {
  if (!originRaw) return [];
  return originRaw
    .replace(/<br\s*\/?>/gi, '\n')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
}

/**
 * 날짜 포맷팅: YYYYMMDD 또는 YYYY-MM-DD -> 2026년 10월 6일 (화요일) 및 요일 계산
 */
export function formatDate(ymdOrDash: string): { formatted: string; dayOfWeek: string; fullKoreanDate: string } {
  const clean = ymdOrDash.replace(/-/g, '');
  if (clean.length !== 8) return { formatted: ymdOrDash, dayOfWeek: '', fullKoreanDate: ymdOrDash };
  
  const y = parseInt(clean.substring(0, 4), 10);
  const m = parseInt(clean.substring(4, 6), 10);
  const d = parseInt(clean.substring(6, 8), 10);
  const dateObj = new Date(y, m - 1, d);

  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dayOfWeekLong = days[dateObj.getDay()] || '';
  const dayOfWeekShort = dayOfWeekLong.charAt(0);
  const formatted = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const fullKoreanDate = `${y}년 ${m}월 ${d}일 (${dayOfWeekLong})`;

  return { formatted, dayOfWeek: dayOfWeekShort, fullKoreanDate };
}
