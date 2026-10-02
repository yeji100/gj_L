import { MealItem } from '../types/meal';
import { parseDishesList, parseCalorieValue, parseNutrition, parseOrigin, formatDate } from '../utils/mealParser';

const NEIS_API_BASE = 'https://open.neis.go.kr/hub/mealServiceDietInfo';
const ATPT_OFCDC_SC_CODE = 'S10'; // 경상남도교육청
const SD_SCHUL_CODE = '9111045'; // 거제중앙중학교

export interface NeisMealRow {
  ATPT_OFCDC_SC_CODE: string;
  ATPT_OFCDC_SC_NM: string;
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
  MMEAL_SC_CODE: string;
  MMEAL_SC_NM: string;
  MLSV_YMD: string;
  MLSV_FGR: string;
  DDISH_NM: string;
  ORPLC_INFO: string;
  CAL_INFO: string;
  NTR_INFO: string;
}

export async function fetchNeisMeals(
  fromDate: string, // YYYYMMDD
  toDate: string, // YYYYMMDD
  apiKey?: string
): Promise<MealItem[]> {
  const params = new URLSearchParams({
    Type: 'json',
    pIndex: '1',
    pSize: '100',
    ATPT_OFCDC_SC_CODE,
    SD_SCHUL_CODE,
    MLSV_FROM_YMD: fromDate,
    MLSV_TO_YMD: toDate,
  });

  if (apiKey) {
    params.set('KEY', apiKey);
  }

  const url = `${NEIS_API_BASE}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`NEIS API HTTP error: ${response.status}`);
    }
    const data = await response.json();

    if (data?.mealServiceDietInfo && data.mealServiceDietInfo[1]?.row) {
      const rows: NeisMealRow[] = data.mealServiceDietInfo[1].row;
      return rows.map((row) => {
        const { formatted, dayOfWeek } = formatDate(row.MLSV_YMD);
        return {
          date: row.MLSV_YMD,
          dateFormatted: formatted,
          dayOfWeek,
          schoolName: row.SCHUL_NM,
          mealType: row.MMEAL_SC_NM || '중식',
          dishRaw: row.DDISH_NM,
          dishes: parseDishesList(row.DDISH_NM),
          calories: row.CAL_INFO,
          calorieValue: parseCalorieValue(row.CAL_INFO),
          nutrition: parseNutrition(row.NTR_INFO),
          originInfo: parseOrigin(row.ORPLC_INFO),
          headcount: row.MLSV_FGR ? parseFloat(row.MLSV_FGR) : undefined,
        };
      });
    }

    return [];
  } catch (err) {
    console.warn('NEIS API fetch failed, falling back to local database:', err);
    return [];
  }
}
