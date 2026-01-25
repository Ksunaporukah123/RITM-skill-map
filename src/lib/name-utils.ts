/**
 * Утилиты для работы с ФИО и инициалами
 */

/**
 * Получение инициалов из полного имени
 * @param fullName ФИО в формате "Фамилия Имя Отчество"
 * @returns Инициалы (например, "ИФ" для "Иванов Иван")
 */
export function getInitials(fullName: string | undefined | null): string {
  if (!fullName) return "?";
  
  const parts = fullName.trim().split(" ");
  
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  } else if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return "?";
}

/**
 * Получение инициалов из объекта с полями firstName и lastName
 * @param person Объект с полями firstName и lastName
 * @returns Инициалы (например, "ИФ")
 */
export function getInitialsFromPerson(person: { firstName: string; lastName: string }): string {
  return `${person.lastName[0]}${person.firstName[0]}`.toUpperCase();
}

/**
 * Получение полного имени из объекта с полями firstName, lastName, middleName
 * @param person Объект с полями firstName, lastName, middleName (опционально)
 * @returns Полное имя в формате "Фамилия Имя Отчество"
 */
export function getFullName(person: { 
  firstName: string; 
  lastName: string; 
  middleName?: string 
}): string {
  return person.middleName
    ? `${person.lastName} ${person.firstName} ${person.middleName}`
    : `${person.lastName} ${person.firstName}`;
}

/**
 * Получение инициалов для имени и отчества (формат И.О.)
 * @param fullName ФИО в формате "Фамилия Имя Отчество"
 * @returns Инициалы в формате "И.О." (например, "И.И." для "Иванов Иван Иванович")
 */
export function getInitialsWithDots(fullName: string): string {
  const parts = fullName.trim().split(" ");
  
  if (parts.length >= 3) {
    return `${parts[1][0]}.${parts[2][0]}.`;
  } else if (parts.length === 2) {
    return `${parts[1][0]}.`;
  }
  
  return "";
}

/**
 * Получение фамилии с инициалами (формат "Фамилия И.О.")
 * @param fullName ФИО в формате "Фамилия Имя Отчество"
 * @returns Фамилия с инициалами (например, "Иванов И.И.")
 */
export function getLastNameWithInitials(fullName: string): string {
  const parts = fullName.trim().split(" ");
  
  if (parts.length >= 3) {
    return `${parts[0]} ${parts[1][0]}.${parts[2][0]}.`;
  } else if (parts.length === 2) {
    return `${parts[0]} ${parts[1][0]}.`;
  } else if (parts.length === 1) {
    return parts[0];
  }
  
  return fullName;
}
