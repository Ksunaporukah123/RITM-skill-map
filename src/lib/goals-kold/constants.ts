/**
 * Константы для модуля целеполагания (Goals KOLD)
 */

/**
 * Доступные годы для выбора в целеполагании
 */
export const KPI_YEARS = [
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
] as const;

/**
 * Кварталы для выбора
 */
export const KPI_QUARTERS = ["Q1", "Q2", "Q3", "Q4"] as const;

/**
 * Генерация ID кварталов для конкретного года
 * @param year Год
 * @returns Массив ID кварталов (например, ["q1-2025", "q2-2025", ...])
 */
export function generateQuarterIds(year: string): string[] {
  return ["q1", "q2", "q3", "q4"].map(q => `${q}-${year}`);
}

/**
 * Типы КПЭ
 */
export const KPI_TYPES = {
  QUANTITATIVE: "Количественный",
  QUALITATIVE: "Качественный",
  PROJECT: "Проектный",
} as const;

/**
 * Статусы КПЭ для согласования
 */
export const KPI_STATUSES = {
  AGREED: "согласован",
  REJECTED: "отклонен",
  IN_REVIEW: "на выставлении",
  NOT_SET: "не выставлен",
} as const;

/**
 * Заголовки столбцов таблицы КПЭ
 */
export const KPI_TABLE_HEADERS = {
  NUMBER: "№",
  NAME: "Наименование КПЭ",
  WEIGHT: "Вес",
  TYPE: "Тип КПЭ",
  PLAN: "План",
  PLAN_STATUS: "Статус ПЛАН",
  FACT: "Факт",
  FACT_STATUS: "Статус ФАКТ",
  COMPLETION: "Значение выполнения, %",
  EVALUATION: "Оценка, %",
  ACTIONS: "Действия",
} as const;

/**
 * Ширины столбцов таблицы КПЭ
 */
export const KPI_TABLE_COLUMN_WIDTHS = {
  NUMBER: "w-[50px]",
  NAME: "",
  WEIGHT: "w-[80px]",
  TYPE: "w-[120px]",
  PLAN: "w-[80px]",
  PLAN_STATUS: "w-[100px]",
  FACT: "w-[80px]",
  FACT_STATUS: "w-[100px]",
  COMPLETION: "w-[140px]",
  EVALUATION: "w-[100px]",
  ACTIONS: "w-[100px]",
} as const;

/**
 * Максимальное значение КПЭ (120% от веса)
 */
export const KPI_MAX_EVALUATION_MULTIPLIER = 1.2;

/**
 * Лимиты отображения элементов
 */
export const DISPLAY_LIMITS = {
  INITIAL_ITEMS: 10,
  PAGE_SIZE: 10,
  MAX_VISIBLE_PAGES: 5,
} as const;

/**
 * Типы источников КПЭ
 */
export type KPISource = "stream" | "itLeader";

/**
 * Типы КПЭ (annual/quarterly)
 */
export type KPIType = "annual" | "quarterly";
