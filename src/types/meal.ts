export interface MealItem {
  date: string; // YYYYMMDD
  dateFormatted: string; // YYYY-MM-DD
  dayOfWeek: string; // 월, 화, 수, 목, 금, 토, 일
  fullKoreanDate?: string; // 2026년 10월 6일 (화요일)
  schoolName: string; // 거제중앙중학교
  mealType: string; // 중식
  dishRaw: string; // 요리명 원본 (HTML br 포함)
  dishes: DishInfo[]; // 파싱된 요리 목록
  calories: string; // e.g. "772.9 Kcal"
  calorieValue: number; // 772.9
  nutrition: Record<string, string>; // e.g. { "탄수화물(g)": "110.1", ... }
  originInfo: string[]; // 원산지 정보 목록
  headcount?: number; // 급식인원수
}

export interface DishInfo {
  name: string; // 요리명 (알레르기 번호 제거된 깨끗한 이름)
  fullName: string; // 알레르기 번호 포함 원본
  allergyCodes: number[]; // e.g. [1, 5, 6, 9, 13, 16]
  allergyNames: string[]; // e.g. ["난류", "대두", "밀", "새우", "아황산류", "쇠고기"]
}

export interface AllergyDefinition {
  code: number;
  name: string;
  icon?: string;
}

export const ALLERGY_LIST: AllergyDefinition[] = [
  { code: 1, name: '난류(달걀)' },
  { code: 2, name: '우유' },
  { code: 3, name: '메밀' },
  { code: 4, name: '땅콩' },
  { code: 5, name: '대두(콩)' },
  { code: 6, name: '밀' },
  { code: 7, name: '고등어' },
  { code: 8, name: '게' },
  { code: 9, name: '새우' },
  { code: 10, name: '돼지고기' },
  { code: 11, name: '복숭아' },
  { code: 12, name: '토마토' },
  { code: 13, name: '아황산류' },
  { code: 14, name: '호두' },
  { code: 15, name: '닭고기' },
  { code: 16, name: '쇠고기' },
  { code: 17, name: '오징어' },
  { code: 18, name: '조개류' },
  { code: 19, name: '잣' },
];
