import { MealItem, ALLERGY_LIST } from '../types/meal';
import { parseDishesList, parseCalorieValue, parseNutrition, parseOrigin, formatDate } from '../utils/mealParser';
import { RAW_GEOJE_MEAL_CSV } from './csvData';

// CSV 파싱하여 초기 메모리 데이터셋 구축
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export function parseLocalCsvData(): MealItem[] {
  const lines = RAW_GEOJE_MEAL_CSV.split('\n');
  const items: MealItem[] = [];

  // 헤더 제외: lines[0] = 시도교육청코드,시도교육청명,행정표준코드,학교명,식사코드,식사명,급식일자,급식인원수,요리명,원산지정보,칼로리정보,영양정보,수정일자
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = parseCsvLine(line);
    if (cols.length < 12) continue;

    const ymd = cols[6]?.trim() || '';
    if (!ymd || ymd.length !== 8) continue;

    const { formatted, dayOfWeek, fullKoreanDate } = formatDate(ymd);
    const dishRaw = cols[8]?.trim() || '';
    const originRaw = cols[9]?.trim() || '';
    const caloriesRaw = cols[10]?.trim() || '';
    const nutritionRaw = cols[11]?.trim() || '';
    const headcountRaw = cols[7]?.trim() || '';

    const mealItem: MealItem = {
      date: ymd,
      dateFormatted: formatted,
      dayOfWeek,
      fullKoreanDate,
      schoolName: cols[3]?.trim() || '거제중앙중학교',
      mealType: cols[5]?.trim() || '중식',
      dishRaw,
      dishes: parseDishesList(dishRaw),
      calories: caloriesRaw,
      calorieValue: parseCalorieValue(caloriesRaw),
      nutrition: parseNutrition(nutritionRaw),
      originInfo: parseOrigin(originRaw),
      headcount: headcountRaw ? parseFloat(headcountRaw) : undefined,
    };

    items.push(mealItem);
  }

  // 날짜 오름차순 정렬
  items.sort((a, b) => a.date.localeCompare(b.date));
  return items;
}

// 메모리 캐시 인스턴스
let cachedMeals: MealItem[] | null = null;
let cachedDateMap: Map<string, MealItem> | null = null;

export function getAllMeals(): MealItem[] {
  if (!cachedMeals) {
    cachedMeals = parseLocalCsvData();
    cachedDateMap = new Map();
    for (const item of cachedMeals) {
      cachedDateMap.set(item.date, item);
    }
  }
  return cachedMeals;
}

export function getMealByDate(ymd: string): MealItem | undefined {
  if (!cachedDateMap) {
    getAllMeals();
  }
  return cachedDateMap?.get(ymd);
}

// 실시간 NEIS OpenAPI 패치 데이터와 병합
export function mergeRemoteMeals(remoteMeals: MealItem[]): void {
  if (!cachedMeals) {
    getAllMeals();
  }
  if (!cachedMeals || !cachedDateMap) return;

  for (const item of remoteMeals) {
    cachedDateMap.set(item.date, item);
  }

  cachedMeals = Array.from(cachedDateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
}

// 특정 주(월~금) 식단 가져오기
export function getWeeklyMeals(targetDateStr: string): MealItem[] {
  // targetDateStr: YYYY-MM-DD
  const date = new Date(targetDateStr);
  if (isNaN(date.getTime())) return [];

  // 주의 월요일 구하기
  const day = date.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
  const diffToMonday = day === 0 ? -6 : 1 - day; // 일요일이면 -6일, 월요일이면 0일, 화요일이면 -1일...
  
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);

  const weekly: MealItem[] = [];

  for (let i = 0; i < 5; i++) {
    const cur = new Date(monday);
    cur.setDate(monday.getDate() + i);
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const d = String(cur.getDate()).padStart(2, '0');
    const ymd = `${y}${m}${d}`;
    const formatted = `${y}-${m}-${d}`;

    const found = getMealByDate(ymd);
    if (found) {
      weekly.push(found);
    } else {
      // 급식이 없는 날(방학/공휴일 등) 더미 생성
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      const daysLong = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
      weekly.push({
        date: ymd,
        dateFormatted: formatted,
        dayOfWeek: days[cur.getDay()],
        fullKoreanDate: `${y}년 ${parseInt(m, 10)}월 ${parseInt(d, 10)}일 (${daysLong[cur.getDay()]})`,
        schoolName: '거제중앙중학교',
        mealType: '중식',
        dishRaw: '급식이 없는 날입니다.',
        dishes: [],
        calories: '0 Kcal',
        calorieValue: 0,
        nutrition: {},
        originInfo: [],
      });
    }
  }

  return weekly;
}

// 특정 월의 모든 식단 가져오기
export function getMonthlyMeals(year: number, month: number): MealItem[] {
  const all = getAllMeals();
  const yStr = String(year);
  const mStr = String(month).padStart(2, '0');
  const prefix = `${yStr}${mStr}`;
  return all.filter(m => m.date.startsWith(prefix));
}

// 메뉴 키워드 검색
export function searchMealsByKeyword(keyword: string): MealItem[] {
  if (!keyword.trim()) return [];
  const query = keyword.trim().toLowerCase();
  const all = getAllMeals();

  return all.filter(item => {
    return item.dishes.some(d => d.name.toLowerCase().includes(query) || d.fullName.toLowerCase().includes(query));
  });
}

// 사용자의 알레르기 목록 로컬스토리지 관리
const ALLERGY_STORAGE_KEY = 'geoje_meal_my_allergies';

export function getSavedAllergies(): number[] {
  try {
    const saved = localStorage.getItem(ALLERGY_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function saveAllergies(codes: number[]): void {
  try {
    localStorage.setItem(ALLERGY_STORAGE_KEY, JSON.stringify(codes));
  } catch (e) {
    console.error(e);
  }
}
