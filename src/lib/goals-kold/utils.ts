/**
 * Общие утилиты для модуля целеполагания (Goals KOLD)
 */

import type { Leader, KPI } from "@/types/goals-kold";
import { formatDate as formatDateUtil } from "@/lib/date-utils";
import { getInitials as getInitialsUtil } from "@/lib/name-utils";

/**
 * Получение инициалов из ФИО или объекта Leader
 * @deprecated Используйте getInitials из @/lib/name-utils
 */
export const getInitials = (fullNameOrLeader: string | Leader): string => {
  const fullName = typeof fullNameOrLeader === "string" ? fullNameOrLeader : fullNameOrLeader.name;
  return getInitialsUtil(fullName);
};

/**
 * Форматирование даты в формат дд.мм.гггг
 * @deprecated Используйте formatDate из @/lib/date-utils
 */
export const formatDate = formatDateUtil;

/**
 * Расчет метрик КПЭ: completionPercent и evaluationPercent
 * @param plan - План
 * @param fact - Факт
 * @param weight - Вес КПЭ
 * @returns Объект с completionPercent и evaluationPercent
 */
export const calculateKPIMetrics = (
  plan: number,
  fact: number,
  weight: number
): { completionPercent: number; evaluationPercent: number } => {
  const completionPercent = plan !== 0 ? (fact / plan) * 100 : 0;
  const evaluationPercent = Math.min(completionPercent * (weight / 100), weight * 1.2); // Максимум 120% от веса
  return { completionPercent, evaluationPercent };
};

/**
 * Создание нового КПЭ с рассчитанными метриками
 */
export const createKPIWithMetrics = (
  baseKPI: Omit<KPI, "completionPercent" | "evaluationPercent">,
  plan: number,
  fact: number
): KPI => {
  const { completionPercent, evaluationPercent } = calculateKPIMetrics(plan, fact, baseKPI.weight);
  return {
    ...baseKPI,
    plan,
    fact,
    completionPercent,
    evaluationPercent,
  };
};

/**
 * Расчет интегрального КПЭ (сумма всех evaluationPercent)
 * @param kpis - Массив КПЭ
 * @returns Интегральное значение КПЭ
 */
export const calculateIntegralKPI = (kpis: KPI[]): number => {
  return kpis.reduce((sum: number, kpi: KPI) => sum + kpi.evaluationPercent, 0);
};

