/**
 * Общие типы для фильтров
 */

/**
 * Базовый интерфейс фильтра
 */
export interface BaseFilter {
  searchQuery?: string;
}

/**
 * Фильтр с диапазоном дат
 */
export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

/**
 * Фильтр по статусу
 */
export interface StatusFilter<T extends string = string> {
  statuses?: T[];
}

/**
 * Фильтр по категориям
 */
export interface CategoryFilter<T extends string = string> {
  categories?: T[];
}

/**
 * Фильтр по пользователям/сотрудникам
 */
export interface EmployeeFilter {
  employeeIds?: string[];
  employeeNames?: string[];
}

/**
 * Фильтр с пагинацией
 */
export interface PaginationFilter {
  page: number;
  pageSize: number;
}

/**
 * Фильтр с сортировкой
 */
export interface SortFilter<T extends string = string> {
  sortBy?: T;
  sortOrder?: "asc" | "desc";
}

/**
 * Комбинированный фильтр для таблиц
 */
export interface TableFilter<
  TStatus extends string = string,
  TSortField extends string = string
> extends BaseFilter, DateRangeFilter, StatusFilter<TStatus>, PaginationFilter, SortFilter<TSortField> {}

/**
 * Результат применения фильтра
 */
export interface FilterResult<T> {
  items: T[];
  totalCount: number;
  filteredCount: number;
  activeFiltersCount: number;
}

/**
 * Типы фильтров для университетов
 */
export interface UniversityFilters extends BaseFilter {
  cities?: string[];
  branches?: string[];
  cooperationLines?: string[];
  regions?: string[];
}

/**
 * Типы фильтров для практикантов
 */
export interface PractitionerFilters extends BaseFilter, DateRangeFilter {
  practiceType?: "all" | "general" | "target";
  statuses?: string[];
  departments?: string[];
}

/**
 * Типы фильтров для стипендиантов
 */
export interface ScholarFilters extends BaseFilter {
  scholarshipName?: string;
  appointmentDate?: string;
}

/**
 * Типы фильтров для участников кейс-чемпионатов
 */
export interface CaseChampionshipParticipantFilters extends BaseFilter, DateRangeFilter {
  eventName?: string;
  directions?: string[];
  statuses?: ("registered" | "participated" | "winner" | "prize_winner")[];
}

/**
 * Типы фильтров для стажеров
 */
export interface InternFilters extends BaseFilter, DateRangeFilter {
  statuses?: ("active" | "dismissed")[];
  departments?: string[];
  positions?: string[];
}

/**
 * Утилиты для работы с фильтрами
 */

/**
 * Подсчет активных фильтров
 */
export function countActiveFilters(filters: Record<string, any>): number {
  let count = 0;
  
  for (const [key, value] of Object.entries(filters)) {
    if (key === 'page' || key === 'pageSize') continue; // Игнорируем пагинацию
    
    if (Array.isArray(value) && value.length > 0) {
      count++;
    } else if (typeof value === 'string' && value.trim().length > 0) {
      count++;
    } else if (typeof value === 'number' && value !== 0) {
      count++;
    } else if (typeof value === 'boolean') {
      count++;
    }
  }
  
  return count;
}

/**
 * Сброс всех фильтров к начальному состоянию
 */
export function resetFilters<T extends Record<string, any>>(
  initialFilters: T
): T {
  return { ...initialFilters };
}

/**
 * Применение фильтра поиска по строке
 */
export function applySearchFilter<T>(
  items: T[],
  searchQuery: string | undefined,
  searchFields: (keyof T)[]
): T[] {
  if (!searchQuery || searchQuery.trim().length === 0) {
    return items;
  }
  
  const query = searchQuery.toLowerCase().trim();
  
  return items.filter(item => {
    return searchFields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(query);
      }
      return false;
    });
  });
}

/**
 * Применение фильтра по датам
 */
export function applyDateRangeFilter<T extends Record<string, any>>(
  items: T[],
  dateField: keyof T,
  startDate?: string,
  endDate?: string
): T[] {
  return items.filter(item => {
    const itemDate = item[dateField];
    if (!itemDate) return true;
    
    const date = new Date(itemDate as string);
    
    if (startDate) {
      const start = new Date(startDate);
      if (date < start) return false;
    }
    
    if (endDate) {
      const end = new Date(endDate);
      if (date > end) return false;
    }
    
    return true;
  });
}
