/**
 * Утилиты для работы со строками
 */

/**
 * Усечение строки до указанной длины с добавлением многоточия
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

/**
 * Капитализация первой буквы
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Капитализация первой буквы каждого слова
 */
export function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map(word => capitalize(word))
    .join(" ");
}

/**
 * Преобразование строки в slug (для URL)
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Удаление всех пробелов из строки
 */
export function removeSpaces(str: string): string {
  return str.replace(/\s/g, "");
}

/**
 * Проверка, содержит ли строка только цифры
 */
export function isNumericString(str: string): boolean {
  return /^\d+$/.test(str);
}

/**
 * Форматирование числа с разделителями тысяч
 */
export function formatNumber(num: number, locale: string = "ru-RU"): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Форматирование валюты
 */
export function formatCurrency(
  amount: number,
  currency: string = "RUB",
  locale: string = "ru-RU"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Форматирование процентов
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Генерация уникального ID
 */
export function generateId(prefix: string = ""): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/**
 * Извлечение имени файла из пути
 */
export function getFileName(path: string): string {
  return path.split(/[/\\]/).pop() || path;
}

/**
 * Извлечение расширения файла
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

/**
 * Проверка, является ли строка валидным URL
 */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Маскирование email (для отображения)
 */
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!domain) return email;
  
  const visibleChars = Math.min(3, Math.floor(localPart.length / 2));
  const masked = localPart.slice(0, visibleChars) + "***";
  return `${masked}@${domain}`;
}

/**
 * Маскирование телефона (для отображения)
 */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7) return phone;
  
  const visible = digits.slice(-4);
  const masked = "*".repeat(digits.length - 4);
  return `${masked}${visible}`;
}

/**
 * Экранирование HTML-символов
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  
  return str.replace(/[&<>"']/g, char => htmlEscapes[char]);
}

/**
 * Подсветка текста в строке (для поиска)
 */
export function highlightText(text: string, query: string): string {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}
