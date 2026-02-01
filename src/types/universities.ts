/**
 * Типы для модуля университетов
 */

// Тип для куратора от филиала
export interface BranchCurator {
  id: string;
  city: string;
  branch: string;
  image?: string;
  cooperationLines?: CooperationLineRecord[]; // Линии сотрудничества для филиала
  cooperationStartYear?: number; // Год начала сотрудничества
}

// Тип для договора
export interface Contract {
  id: string;
  type: "cooperation" | "scholarship" | "internship" | "bankDepartment";
  hasContract: boolean;
  contractFile?: string; // URL или путь к файлу
  number?: string; // Номер договора
  date?: string; // Дата договора
  period?: { start: string; end: string }; // Период действия (начало - конец)
  asddLink?: string; // Ссылка на АСДД
  contractBranch?: string; // Головной ВУЗ или филиал (только одно значение)
  cooperationLine?: CooperationLine; // Линия сотрудничества (drp, bko, cntr)
  archived?: boolean; // В архиве (иначе — активные, в т.ч. с истёкшим сроком)
}

// Тип для кафедры банка
export interface BankDepartment {
  id: string;
  name: string; // Название кафедры
}

// Тип для мероприятия
export interface Event {
  id: string;
  type: "careerDays" | "expertParticipation" | "caseChampionships" | "meeting" | "communication"; // Тип мероприятия
  date: string; // Дата начала проведения
  endDate: string; // Дата окончания проведения
  status: "planned" | "in_progress" | "completed"; // Статус мероприятия
  comments?: string; // Комментарии
  responsiblePerson: string[]; // Ответственные лица Банк (массив ID)
  responsiblePersonImage?: string; // Фото ответтельного лица (устаревшее, для обратной совместимости)
  /** Линия сотрудничества: у мероприятия в один момент времени может быть только одна — ДРП, БКО или ЦНТР */
  cooperationLine?: "drp" | "bko" | "cntr";
  /** Дата добавления записи (формат YYYY-MM-DD), отображается в формате дд.мм.гггг */
  addedAt?: string;
  /** Кто добавил запись (ФИО или идентификатор) */
  addedBy?: string;
}

// Тип для стажера
export interface Intern {
  id: string;
  employeeName: string; // ФИО сотрудника
  age: number; // Возраст
  position: string; // Должность
  department: string; // Подразделение
  hireDate: string; // Дата приема на работу (формат YYYY-MM-DD)
  status: "active" | "dismissed"; // Статус: работает или уволен
  dismissalDate?: string; // Дата увольнения (формат YYYY-MM-DD)
  practiceInBank: boolean; // Практика в банке: да/нет
  internshipInBank: boolean; // Стажировка в банке: да/нет
  internshipStartDate?: string; // Дата начала стажировки в банке (формат YYYY-MM-DD)
  internshipEndDate?: string; // Дата окончания стажировки в банке (формат YYYY-MM-DD)
}

// Тип для практиканта (аналогичен стажеру)
export interface Practitioner {
  id: string;
  employeeName: string; // ФИО сотрудника
  age: number; // Возраст
  position: string; // Должность
  department: string; // Подразделение
  hireDate: string; // Дата приема на работу (формат YYYY-MM-DD)
  status: "active" | "dismissed"; // Статус: работает или уволен
  dismissalDate?: string; // Дата увольнения (формат YYYY-MM-DD)
  internshipInBank: boolean; // Стажировка в банке: да/нет
  internshipStartDate?: string; // Дата начала стажировки в банке (формат YYYY-MM-DD)
  internshipEndDate?: string; // Дата окончания стажировки в банке (формат YYYY-MM-DD)
  practiceStartDate: string; // Дата начала практики (формат YYYY-MM-DD)
  practiceEndDate: string; // Дата окончания практики (формат YYYY-MM-DD)
  practiceSupervisor?: string; // Руководитель практики
  practiceStatus?: "not_meets" | "meets" | "exceeds"; // Статус: не соответствует / соответствует / превосходит ожидания
  addedBy: string; // Сотрудник, добавивший запись
  comment?: string; // Комментарий
  isTarget?: boolean; // Целевой практикант
  responsibleEmployee?: string; // Ответственный сотрудник (для целевых практикантов)
}

// Тип для участника кейс-чемпионата
export interface CaseChampionshipParticipant {
  id: string;
  employeeName: string; // ФИО участника
  eventId: string; // ID мероприятия (кейс-чемпионата)
  direction?: string; // Направление
  status: "registered" | "participated" | "winner" | "prize_winner"; // Статус: зарегистрирован, участвовал, победитель, призёр
  comments?: string; // Комментарии к участию
}

// Список направлений для кейс-чемпионатов
export const CASE_CHAMPIONSHIP_DIRECTIONS = [
  "Аудит",
  "Информационная безопасность",
  "Информационные технологии",
  "Инфраструктура и ГЧП",
  "Казначейство",
  "Коммуникация и маркетинг",
  "Корпоративный бизнес",
  "МСБ",
  "Прямые инвестиции",
  "Риски",
  "Розничный бизнес",
  "Транзационный бизнес",
  "Устойчивое развитие",
  "Ценообразование",
  "Юриспруденция",
  "Agile и эффективность",
  "HR",
  "Рынки капитала",
  "Закупки и тендерные процедуры",
  "БКО",
  "Корпоративная экосистема",
  "Операционное сопровождение",
  "Финансы и контроль",
  "Цифровые продукты и розничная экосистема",
  "Эквайринг",
] as const;

// Тип для целевого практиканта
export interface TargetPractitioner {
  id: string;
  employeeName: string; // ФИО практиканта
  targetStartDate: string; // Дата начала целевой практики (формат YYYY-MM-DD)
  targetEndDate: string; // Дата окончания целевой практики (формат YYYY-MM-DD)
  department?: string; // Подразделение
  practiceSupervisor?: string; // Руководитель практики
  comments?: string; // Комментарии
}

// Тип для именного стипендианта
export interface NamedScholar {
  id: string;
  employeeName: string; // ФИО стипендианта
  scholarshipName: string; // Название стипендии
  appointmentDate: string; // Дата назначения (формат YYYY-MM-DD)
  comments?: string; // Комментарии
}

// Тип для элемента инфраструктуры ЦНТР
export interface CNTRInfrastructureItem {
  id: string;
  developmentType: "financing" | "endowment" | "endowment-fund"; // Вид развития
  date: string; // Дата (формат YYYY-MM-DD)
  branch?: string; // Головной ВУЗ или филиал
  description?: string; // Описание
  document?: string; // Документ (URL или путь к PDF файлу)
}

// Тип для элемента проекта ЦНТР
export interface CNTRProjectItem {
  id: string;
  projectName: string; // Название проекта
  date: string; // Дата (формат YYYY-MM-DD)
  branch?: string; // Головной ВУЗ или филиал
  fundingAmount?: number; // Размер финансирования (в рублях)
  supportFormat?: "grant-cofinancing" | "ordered-rd-center-lift" | "targeted-charity"; // Формат поддержки
  description?: string; // Описание
  document?: string; // Документ (URL или путь к PDF файлу)
}

// Тип для элемента акселератора ЦНТР
export interface CNTRAcceleratorItem {
  id: string;
  developmentType?: "financing" | "endowment" | "endowment-fund"; // Вид развития (опционально, для обратной совместимости)
  date: string; // Дата (формат YYYY-MM-DD)
  branch?: string; // Головной ВУЗ или филиал
  description?: string; // Описание
  document?: string; // Документ (URL или путь к PDF файлу)
}

// Тип для элемента мероприятий ЦНТР
export interface CNTREventItem {
  id: string;
  date: string; // Дата (формат YYYY-MM-DD)
  branch?: string; // Головной ВУЗ или филиал
  description?: string; // Описание
  document?: string; // Документ (URL или путь к PDF файлу)
}

// Тип для элемента образовательных проектов ЦНТР
export interface CNTREducationalProjectItem {
  id: string;
  date: string; // Дата (формат YYYY-MM-DD)
  branch?: string; // Головной ВУЗ или филиал
  description?: string; // Описание
  document?: string; // Документ (URL или путь к PDF файлу)
}

// Тип для элемента соглашений о сотрудничестве ЦНТР
export interface CNTRAgreementItem {
  id: string;
  date: string; // Дата (формат YYYY-MM-DD)
  branch?: string; // Головной ВУЗ или филиал
  status?: "in-progress" | "signed"; // Статус: в процессе или подписано
  description?: string; // Описание
  document?: string; // Документ (URL или путь к PDF файлу)
}

// Тип линии сотрудничества
export type CooperationLine = "drp" | "bko" | "cntr";

// Интерфейс для контакта со стороны ВУЗа
export interface UniversityContact {
  name: string; // ФИО контактного лица
  position?: string; // Должность
  phone?: string; // Телефон
  email?: string; // Email
  isPublic?: boolean; // Показать всем (видимость контакта)
}

// Интерфейс для записи линии сотрудничества
export interface CooperationLineRecord {
  id: string;
  line: CooperationLine;
  year: number;
  responsible: string[]; // Массив ID ответственных лиц
  universityContact?: UniversityContact; // Контактное лицо со стороны ВУЗа (для обратной совместимости)
  universityContacts?: UniversityContact[]; // Массив контактных лиц со стороны ВУЗа
}

// Основной интерфейс университета
export interface University {
  id: string;
  name: string;
  shortName?: string;
  inn?: string; // ИНН
  city: string;
  branch?: string[]; // Филиалы в ГПБ
  cooperationStartYear?: number;
  cooperationLine?: CooperationLine | CooperationLine[]; // Линия сотрудничества (строка для обратной совместимости или массив) - старая версия
  cooperationLineYear?: number;
  cooperationLineResponsible?: string | string[]; // Ответственные лица (строка для обратной совместимости или массив) - старая версия
  cooperationLines?: CooperationLineRecord[]; // Новый формат: массив записей линий сотрудничества
  targetAudience?: string;
  initiatorBlock?: string; // Инициатор сотрудничества (блок/ССП)
  initiatorName?: string; // Инициатор сотрудничества (ФИО)
  initiatorPosition?: string; // Должность инициатора
  initiatorImage?: string; // Фото инициатора
  branchCurators?: BranchCurator[]; // Кураторы от филиалов
  contracts?: Contract[]; // Договоры
  bankDepartments?: BankDepartment[]; // Кафедры банка
  events?: Event[]; // Мероприятия
  careerDays?: boolean; // Дни карьеры
  expertParticipation?: boolean; // Экспертное участие
  caseChampionships?: boolean; // Кейс-чемпионаты
  allEmployees?: number; // Все сотрудники
  internHiring?: boolean; // Найм стажеров
  averageInternsPerYear?: number; // Среднее количество стажеров в год
  interns?: number; // Практиканты
  internList?: Intern[]; // Список стажеров
  practitionerList?: Practitioner[]; // Список практикантов
  caseChampionshipParticipants?: CaseChampionshipParticipant[]; // Участники кейс-чемпионатов
  targetPractitioners?: TargetPractitioner[]; // Целевые практиканты
  namedScholars?: NamedScholar[]; // Именные стипендианты
  cntrInfrastructure?: CNTRInfrastructureItem[]; // Элементы инфраструктуры ЦНТР
  cntrProjects?: CNTRProjectItem[]; // Элементы проектов ЦНТР
  cntrAcceleratorEnabled?: boolean; // Участие в Акселераторе Газпромбанк.Тех: Наука
  cntrAcceleratorItems?: CNTRAcceleratorItem[]; // Элементы акселератора ЦНТР
  cntrEventsItems?: CNTREventItem[]; // Элементы мероприятий ЦНТР
  cntrEducationalProjectsItems?: CNTREducationalProjectItem[]; // Элементы образовательных проектов ЦНТР
  cntrAgreementEnabled?: boolean; // Соглашение о сотрудничестве
  cntrAgreementItems?: CNTRAgreementItem[]; // Элементы соглашений о сотрудничестве ЦНТР
  region?: string;
  description?: string;
  image?: string; // Фото/логотип ВУЗа
  bkoData?: UniversityBKOData;
}

// Данные БКО для университета
export interface UniversityBKOData {
  // Блок Зарплатный проект
  salaryProject?: {
    students?: boolean; // Студенты
    employees?: boolean; // Сотрудники
  };
  // Блок Транзакционные продукты
  transactionalProducts?: {
    ie?: boolean; // ИЭ
    te?: boolean; // ТЭ
    sbp?: boolean; // СБП
    adm?: boolean; // АДМ
  };
  // Блок Лимит
  limit?: boolean;
  // Блок УК ГПБ фондами ЦК
  ukGpbFundsCk?: boolean;
  // Комментарий
  comment?: string;
}

// Тип для студента
export interface Student {
  id: string;
  fullName: string;
  position?: string;
  description?: string;
}
