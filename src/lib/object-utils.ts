/**
 * Утилиты для преобразования и трансформации данных
 */

/**
 * Безопасное преобразование в число
 */
export function toNumber(value: string | number | undefined | null, defaultValue: number = 0): number {
  if (typeof value === 'number') return value;
  if (!value) return defaultValue;
  
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Безопасное преобразование в строку
 */
export function toString(value: any, defaultValue: string = ""): string {
  if (value === null || value === undefined) return defaultValue;
  return String(value);
}

/**
 * Безопасное преобразование в boolean
 */
export function toBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return Boolean(value);
}

/**
 * Преобразование строки CSV в массив
 */
export function csvToArray(csv: string, delimiter: string = ","): string[] {
  return csv.split(delimiter).map(item => item.trim()).filter(Boolean);
}

/**
 * Преобразование массива в строку CSV
 */
export function arrayToCsv(array: string[], delimiter: string = ", "): string {
  return array.join(delimiter);
}

/**
 * Глубокое клонирование объекта
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Слияние объектов (merge)
 */
export function mergeObjects<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  return Object.assign({}, target, ...sources);
}

/**
 * Удаление undefined и null значений из объекта
 */
export function removeNullish<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      result[key as keyof T] = value;
    }
  }
  
  return result;
}

/**
 * Фильтрация ключей объекта
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  
  return result;
}

/**
 * Исключение ключей из объекта
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  
  keys.forEach(key => {
    delete result[key];
  });
  
  return result;
}

/**
 * Проверка, является ли значение пустым (null, undefined, "", [], {})
 */
export function isEmptyValue(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Безопасный доступ к вложенным свойствам объекта
 */
export function getNestedValue<T = any>(
  obj: Record<string, any>,
  path: string,
  defaultValue?: T
): T | undefined {
  const keys = path.split('.');
  let current: any = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined) {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current !== undefined ? current : defaultValue;
}

/**
 * Установка значения по вложенному пути
 */
export function setNestedValue(
  obj: Record<string, any>,
  path: string,
  value: any
): Record<string, any> {
  const keys = path.split('.');
  const result = deepClone(obj);
  let current = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return result;
}
