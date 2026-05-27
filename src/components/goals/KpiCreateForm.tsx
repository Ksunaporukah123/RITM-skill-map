"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  Inbox,
  Info,
  Plus,
  Save,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EmployeeSelectModal,
  ResponsibleEmployeeCard,
  type KpiResponsibleEmployee,
} from "@/components/goals/EmployeeSelectModal";
import {
  ResponsibilityZoneScaleDrawer,
  type ResponsibilityZonePair,
} from "@/components/goals/ResponsibilityZoneScaleDrawer";

const GOAL_GROUPS = [
  "Блок ИТ и ЦТ",
  "Малый и средний бизнес",
  "Розничный бизнес",
  "Корпоративный бизнес",
];

const PARENT_KPIS = [
  "N004-K0175 — 15.05.2026",
  "N003-K0146 — 227 1338",
  "N003-K0145 — КПЭ пипл лог тиест 6",
];

const FINANCIAL_IMPACT_OPTIONS = ["бизнес КПЭ", "не бизнес КПЭ"];

const FORMATION_SOURCE_OPTIONS = ["функциональный КПЭ", "регуляторный КПЭ"];

const COMPOSITION_OPTIONS = ["простой КПЭ", "составной КПЭ"];

const CROSS_OPTIONS = ["Да", "Нет"];

const UNITS = ["%", "шт.", "руб.", "дней", "балл"];

const FORMULAS = [
  "Факт / План × 100",
  "(Факт − План) / План × 100",
  "Интегральная оценка",
];

const CALCULATION_PRINCIPLES = [
  "сумма за период оценки",
  "среднее значение за период оценки",
];

const EVALUATION_PERIODS = [
  "Годовой период оценки",
  "Квартальный период оценки",
  "Полугодовой период оценки",
];

const RESPONSIBLE_TABS = [
  { value: "author", label: "Автор" },
  { value: "customer", label: "Заказчик" },
  { value: "analyst-plan", label: "Аналитик План" },
  { value: "analyst-fact", label: "Аналитик Факт" },
  { value: "verifier", label: "Верификатор" },
] as const;

type ResponsibleTab = (typeof RESPONSIBLE_TABS)[number]["value"];

const EMPLOYEE_ASSIGNABLE_ROLES = [
  "analyst-plan",
  "analyst-fact",
  "verifier",
] as const;

type EmployeeAssignableRole = (typeof EMPLOYEE_ASSIGNABLE_ROLES)[number];

function isEmployeeAssignableRole(
  tab: ResponsibleTab
): tab is EmployeeAssignableRole {
  return EMPLOYEE_ASSIGNABLE_ROLES.includes(tab as EmployeeAssignableRole);
}

const RESPONSIBLE_TAB_TITLES: Record<ResponsibleTab, string> = {
  author: "ОТВЕТСТВЕННЫЙ ЗА СОЗДАНИЕ КПЭ",
  customer: "ОТВЕТСТВЕННЫЙ ЗА СОГЛАСОВАНИЕ КПЭ",
  "analyst-plan": "ОТВЕТСТВЕННЫЙ ЗА ПРЕДОСТАВЛЕНИЕ ЗНАЧЕНИЯ ПЛАНА КПЭ",
  "analyst-fact": "ОТВЕТСТВЕННЫЙ ЗА ПРЕДОСТАВЛЕНИЕ ЗНАЧЕНИЯ ФАКТА КПЭ",
  verifier: "ОТВЕТСТВЕННЫЙ ЗА ВЕРИФИКАЦИЮ КПЭ",
};

function FieldInfo({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white hover:bg-sky-600"
          aria-label="Подсказка"
        >
          <Info className="h-2.5 w-2.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-xs">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

function FormFieldLabel({
  children,
  required,
  info,
}: {
  children: React.ReactNode;
  required?: boolean;
  info?: string;
}) {
  return (
    <Label className="mb-1.5 flex items-center gap-1 text-xs font-normal text-foreground">
      {required && <span className="text-red-500">*</span>}
      <span>{children}</span>
      {info && <FieldInfo text={info} />}
    </Label>
  );
}

function FormSelect({
  value,
  onValueChange,
  placeholder = "Введите данные",
  options,
}: {
  value: string;
  onValueChange: (v: string) => void;
  placeholder?: string;
  options: string[];
}) {
  return (
    <Select value={value || undefined} onValueChange={onValueChange}>
      <SelectTrigger className="h-9 bg-background text-sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function FormSection({
  title,
  open,
  onToggle,
  variant = "default",
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  variant?: "primary" | "default";
  children: React.ReactNode;
}) {
  const isPrimary = variant === "primary";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border",
        isPrimary && open && "border-sky-400"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium transition-colors",
          isPrimary && open
            ? "bg-sky-500 text-white"
            : "bg-muted/30 text-foreground hover:bg-muted/50"
        )}
      >
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0" />
        )}
        {title}
      </button>
      {open && (
        <div
          className={cn(
            "border-t bg-background p-4",
            isPrimary && "border-sky-200"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface KpiCreateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
}

export function KpiCreateForm({ open, onOpenChange, onSave }: KpiCreateFormProps) {
  const [sectionsOpen, setSectionsOpen] = useState({
    general: true,
    types: true,
    parameters: true,
    zones: true,
    responsible: true,
  });

  const [responsibleTab, setResponsibleTab] =
    useState<ResponsibleTab>("analyst-plan");

  const [responsibleEmployees, setResponsibleEmployees] = useState<
    Record<EmployeeAssignableRole, KpiResponsibleEmployee | null>
  >({
    "analyst-plan": null,
    "analyst-fact": null,
    verifier: null,
  });

  const [employeeModalRole, setEmployeeModalRole] =
    useState<EmployeeAssignableRole | null>(null);

  const [zonePairs, setZonePairs] = useState<ResponsibilityZonePair[]>([]);
  const [zoneDrawerOpen, setZoneDrawerOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    goalGroup: "",
    kpiNumber: "",
    parentKpi: "",
    financialImpact: "",
    formationSource: "",
    composition: "",
    makeCross: "",
    unit: "",
    formula: "",
    calculationPrinciple: "",
    evaluationPeriods: "",
    source: "",
    methodology: "",
  });

  const toggleSection = (key: keyof typeof sectionsOpen) => {
    setSectionsOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave?.();
    onOpenChange(false);
  };

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[95vh] w-[min(1100px,96vw)] max-w-[min(1100px,96vw)] flex-col gap-0 overflow-hidden p-0"
      >
        <DialogTitle className="sr-only">Создание КПЭ</DialogTitle>

        <div className="shrink-0 border-b bg-background px-6 py-4">
          <h2 className="text-xl font-semibold tracking-tight">Создание КПЭ</h2>
        </div>

        <div className="flex-1 overflow-y-auto bg-muted/20 px-6 py-4">
          <div className="space-y-3">
            <FormSection
              title="Общая информация"
              variant="primary"
              open={sectionsOpen.general}
              onToggle={() => toggleSection("general")}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4 rounded-lg border bg-muted/10 p-4">
                  <div>
                    <FormFieldLabel required>Наименование КПЭ</FormFieldLabel>
                    <Input
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="Введите название КПЭ"
                      className="h-9"
                    />
                  </div>
                  <div>
                    <FormFieldLabel>Описание КПЭ</FormFieldLabel>
                    <Textarea
                      value={form.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      placeholder="Добавьте описание"
                      className="min-h-[80px] resize-none text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-4 rounded-lg border bg-muted/10 p-4">
                  <div className="grid gap-4 sm:grid-cols-[1fr_100px]">
                    <div>
                      <FormFieldLabel required>
                        Наименование Группы целеполагания
                      </FormFieldLabel>
                      <FormSelect
                        value={form.goalGroup}
                        onValueChange={(v) => updateField("goalGroup", v)}
                        options={GOAL_GROUPS}
                      />
                    </div>
                    <div>
                      <FormFieldLabel>Номер КПЭ</FormFieldLabel>
                      <Input
                        type="number"
                        value={form.kpiNumber}
                        onChange={(e) => updateField("kpiNumber", e.target.value)}
                        placeholder="№"
                        className="h-9"
                      />
                    </div>
                  </div>
                  <div>
                    <FormFieldLabel>Наименование родительского КПЭ</FormFieldLabel>
                    <FormSelect
                      value={form.parentKpi}
                      onValueChange={(v) => updateField("parentKpi", v)}
                      placeholder="Выберите из списка"
                      options={PARENT_KPIS}
                    />
                  </div>
                </div>
              </div>
            </FormSection>

            <FormSection
              title="Виды КПЭ"
              open={sectionsOpen.types}
              onToggle={() => toggleSection("types")}
            >
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-4">
                  <div>
                    <FormFieldLabel info="Классификация по влиянию на финансовый результат">
                      По влиянию на финансовый результат
                    </FormFieldLabel>
                    <FormSelect
                      value={form.financialImpact}
                      onValueChange={(v) => updateField("financialImpact", v)}
                      options={FINANCIAL_IMPACT_OPTIONS}
                    />
                  </div>
                  <div className="pl-2">
                    <FormFieldLabel>Сделать Кросс</FormFieldLabel>
                    <FormSelect
                      value={form.makeCross}
                      onValueChange={(v) => updateField("makeCross", v)}
                      options={CROSS_OPTIONS}
                    />
                  </div>
                </div>
                <div>
                  <FormFieldLabel info="Источник формирования показателя">
                    По источнику формирования
                  </FormFieldLabel>
                  <FormSelect
                    value={form.formationSource}
                    onValueChange={(v) => updateField("formationSource", v)}
                    options={FORMATION_SOURCE_OPTIONS}
                  />
                </div>
                <div>
                  <FormFieldLabel info="Состав показателя">
                    По составу
                  </FormFieldLabel>
                  <FormSelect
                    value={form.composition}
                    onValueChange={(v) => updateField("composition", v)}
                    options={COMPOSITION_OPTIONS}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection
              title="Параметры КПЭ"
              open={sectionsOpen.parameters}
              onToggle={() => toggleSection("parameters")}
            >
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <FormFieldLabel info="Единица измерения показателя">
                      Единица измерения
                    </FormFieldLabel>
                    <FormSelect
                      value={form.unit}
                      onValueChange={(v) => updateField("unit", v)}
                      options={UNITS}
                    />
                  </div>
                  <div>
                    <FormFieldLabel info="Формула расчёта показателя">
                      Формула
                    </FormFieldLabel>
                    <FormSelect
                      value={form.formula}
                      onValueChange={(v) => updateField("formula", v)}
                      options={FORMULAS}
                    />
                  </div>
                  <div>
                    <FormFieldLabel info="Принцип расчёта значения">
                      Принцип расчета
                    </FormFieldLabel>
                    <FormSelect
                      value={form.calculationPrinciple}
                      onValueChange={(v) =>
                        updateField("calculationPrinciple", v)
                      }
                      options={CALCULATION_PRINCIPLES}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FormFieldLabel info="Периоды, в которых оценивается КПЭ">
                      Периоды оценки
                    </FormFieldLabel>
                    <FormSelect
                      value={form.evaluationPeriods}
                      onValueChange={(v) => updateField("evaluationPeriods", v)}
                      options={EVALUATION_PERIODS}
                    />
                  </div>
                  <div>
                    <FormFieldLabel info="Источник данных для расчёта">
                      Источник
                    </FormFieldLabel>
                    <Input
                      value={form.source}
                      onChange={(e) => updateField("source", e.target.value)}
                      placeholder="Введите данные"
                      className="h-9"
                    />
                  </div>
                </div>
                <div>
                  <FormFieldLabel required info="Описание методики расчёта">
                    Методика
                  </FormFieldLabel>
                  <Input
                    value={form.methodology}
                    onChange={(e) => updateField("methodology", e.target.value)}
                    placeholder="Введите данные"
                    className="h-9"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" size="sm" className="gap-1.5">
                    <Upload className="h-4 w-4" />
                    Загрузить методику
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="gap-1.5"
                  >
                    <Download className="h-4 w-4" />
                    Скачать шаблон
                  </Button>
                </div>
              </div>
            </FormSection>

            <FormSection
              title="Зоны ответственности и шкалы"
              open={sectionsOpen.zones}
              onToggle={() => toggleSection("zones")}
            >
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setZoneDrawerOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Добавить пару
                </Button>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Добавленные пары (зона ответственности + шкала оценки)
                </p>
                {zonePairs.length === 0 ? (
                  <div className="flex min-h-[120px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 text-muted-foreground">
                    <Inbox className="mb-2 h-10 w-10 opacity-40" />
                    <span className="text-sm">Нет данных</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {zonePairs.map((pair) => (
                      <div
                        key={pair.id}
                        className="rounded-lg border bg-muted/10 px-4 py-3 text-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">{pair.responsibilityZone}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Интервалов: {pair.intervals.length}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-red-600 hover:text-red-700"
                            onClick={() =>
                              setZonePairs((prev) =>
                                prev.filter((p) => p.id !== pair.id)
                              )
                            }
                          >
                            Удалить
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormSection>

            <FormSection
              title="Ответственные за КПЭ"
              open={sectionsOpen.responsible}
              onToggle={() => toggleSection("responsible")}
            >
              <Tabs
                value={responsibleTab}
                onValueChange={(v) => setResponsibleTab(v as ResponsibleTab)}
              >
                <TabsList className="mb-4 h-9 w-full justify-start gap-1 bg-transparent p-0">
                  {RESPONSIBLE_TABS.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="h-8 rounded-md px-3 text-xs data-[state=active]:bg-slate-700 data-[state=active]:text-white"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {RESPONSIBLE_TABS.map((tab) => (
                  <TabsContent key={tab.value} value={tab.value} className="mt-0">
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {RESPONSIBLE_TAB_TITLES[tab.value]}
                    </p>
                    {(tab.value === "analyst-plan" ||
                      tab.value === "analyst-fact") && (
                      <div className="mb-4 rounded-lg border bg-muted/20 p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                          <Calendar className="h-4 w-4 text-sky-500" />
                          Нормативные сроки предоставления данных
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                            <span className="flex items-center gap-1.5">
                              Годовой период оценки
                              <FieldInfo text="Срок предоставления плана на годовой период" />
                            </span>
                            <span className="text-muted-foreground text-right text-xs">
                              до 20 ноября года, предшествующего плановому
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span>Квартальный период оценки</span>
                            <span className="text-muted-foreground text-right text-xs">
                              до 20 числа месяца предшествующего плановому
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    {isEmployeeAssignableRole(tab.value) &&
                      responsibleEmployees[tab.value] && (
                        <ResponsibleEmployeeCard
                          employee={responsibleEmployees[tab.value]!}
                          onRemove={() =>
                            setResponsibleEmployees((prev) => ({
                              ...prev,
                              [tab.value]: null,
                            }))
                          }
                        />
                      )}
                    {isEmployeeAssignableRole(tab.value) && (
                      <Button
                        type="button"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => setEmployeeModalRole(tab.value)}
                      >
                        <Plus className="h-4 w-4" />
                        Добавить
                      </Button>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </FormSection>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 border-t bg-sky-50/80 px-6 py-3 dark:bg-sky-950/30">
          <Button type="button" size="sm" className="gap-1.5" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Сохранить
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <ResponsibilityZoneScaleDrawer
      open={zoneDrawerOpen}
      onOpenChange={setZoneDrawerOpen}
      onSave={(pair) => setZonePairs((prev) => [...prev, pair])}
    />

    <EmployeeSelectModal
      open={employeeModalRole !== null}
      onOpenChange={(open) => {
        if (!open) setEmployeeModalRole(null);
      }}
      value={
        employeeModalRole ? responsibleEmployees[employeeModalRole] : null
      }
      onSave={(employee) => {
        if (employeeModalRole) {
          setResponsibleEmployees((prev) => ({
            ...prev,
            [employeeModalRole]: employee,
          }));
        }
        setEmployeeModalRole(null);
      }}
    />
    </>
  );
}
