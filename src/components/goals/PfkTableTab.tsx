"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  ListFilter,
  Search,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GoalsSectionHelpButton } from "@/components/goals/GoalsSectionHelpDialog";

type PlanStatus =
  | "plan-approved"
  | "plan-waiting"
  | "plan-pending-approval"
  | "plan-rejected";
type FactStatus =
  | "fact-approved"
  | "fact-waiting"
  | "fact-pending-approval"
  | "fact-rejected";

interface PfkRecord {
  id: string;
  kpiId: string;
  name: string;
  unit: string;
  period: string;
  responsibilityZone: string;
  detailing: string;
  plan: string | null;
  baseCrit: string | null;
  planStatus: PlanStatus;
  planRejectionComment?: string | null;
  fact: string | null;
  factStatus: FactStatus;
  factRejectionComment?: string | null;
  completionPercent: string | null;
}

const PLAN_STATUS_LABELS: Record<PlanStatus, string> = {
  "plan-approved": "План утверждён",
  "plan-waiting": "Ожидает ввода плана",
  "plan-pending-approval": "Ожидает утверждения плана",
  "plan-rejected": "Отклонен",
};

const FACT_STATUS_LABELS: Record<FactStatus, string> = {
  "fact-approved": "Факт утверждён",
  "fact-waiting": "Ожидает ввода факта",
  "fact-pending-approval": "Ожидает утверждения факта",
  "fact-rejected": "Отклонен",
};

const BASE_PFK_ROWS: Omit<PfkRecord, "id">[] = [
  {
    kpiId: "N004-K0052",
    name: "Lead time",
    unit: "День",
    period: "1Q2025",
    responsibilityZone: "ССП",
    detailing: "Департамент экспертизы цифрового бизнеса",
    plan: "99",
    baseCrit: null,
    planStatus: "plan-approved",
    fact: "100",
    factStatus: "fact-approved",
    completionPercent: "101.01%",
  },
  {
    kpiId: "N006-K0002",
    name: "Операционный результат каналов ДБО",
    unit: "Руб.",
    period: "1Q2025",
    responsibilityZone: "ССП",
    detailing: "Департамент экспертизы цифрового бизнеса",
    plan: "23 211",
    baseCrit: null,
    planStatus: "plan-approved",
    fact: "23",
    factStatus: "fact-approved",
    completionPercent: "0.1%",
  },
  {
    kpiId: "N004-K0052",
    name: "Lead time",
    unit: "День",
    period: "1Q2025",
    responsibilityZone: "ВСП1",
    detailing: "Управление развития систем автоматизации банковского сопровождения",
    plan: null,
    baseCrit: null,
    planStatus: "plan-waiting",
    fact: "100",
    factStatus: "fact-approved",
    completionPercent: null,
  },
  {
    kpiId: "N004-K0051",
    name: "Интегральная Доступность Бизнес-процессов (АС)",
    unit: "%",
    period: "1Q2025",
    responsibilityZone: "ССП",
    detailing: "Департамент информационных технологий",
    plan: "95",
    baseCrit: null,
    planStatus: "plan-approved",
    fact: "58",
    factStatus: "fact-approved",
    completionPercent: "180%",
  },
  {
    kpiId: "N006-K0003",
    name: "Доля автоматизированных операций",
    unit: "%",
    period: "1Q2025",
    responsibilityZone: "ВСП1",
    detailing: "Управление развития систем автоматизации банковского сопровождения",
    plan: "80",
    baseCrit: null,
    planStatus: "plan-approved",
    fact: "0",
    factStatus: "fact-waiting",
    completionPercent: "0%",
  },
  {
    kpiId: "N004-K0050",
    name: "Время восстановления сервиса",
    unit: "День",
    period: "1Q2025",
    responsibilityZone: "ССП",
    detailing: "Департамент экспертизы цифрового бизнеса",
    plan: "5",
    baseCrit: null,
    planStatus: "plan-waiting",
    fact: null,
    factStatus: "fact-waiting",
    completionPercent: null,
  },
  {
    kpiId: "N006-K0010",
    name: "Срок выполнения задач",
    unit: "%",
    period: "1Q2025",
    responsibilityZone: "ВСП2",
    detailing: "Департамент информационных технологий",
    plan: "90",
    baseCrit: "85",
    planStatus: "plan-pending-approval",
    fact: "88",
    factStatus: "fact-pending-approval",
    completionPercent: "97.8%",
  },
];

const TOTAL_RECORDS = 162;

const MOCK_PFK_TABLE: PfkRecord[] = Array.from({ length: TOTAL_RECORDS }, (_, i) => {
  const base = BASE_PFK_ROWS[i % BASE_PFK_ROWS.length];
  return { id: String(i + 1), ...base };
});

const wrapCell =
  "align-top py-3 text-sm whitespace-normal break-words leading-snug";

function getPaginationItems(
  current: number,
  total: number
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    const items: (number | "ellipsis")[] = [];
    for (let p = 1; p <= Math.min(5, total); p++) items.push(p);
    if (total > 6) {
      items.push("ellipsis");
      items.push(total);
    }
    return items;
  }
  if (current >= total - 3) {
    return [
      1,
      "ellipsis",
      total - 4,
      total - 3,
      total - 2,
      total - 1,
      total,
    ];
  }
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

function toggleSetValue<T>(set: Set<T>, value: T, checked: boolean): Set<T> {
  const next = new Set(set);
  if (checked) next.add(value);
  else next.delete(value);
  return next;
}

function ColumnFilterHead({
  label,
  className,
  options,
  selected,
  onSelectedChange,
  formatOption = (v) => String(v),
}: {
  label: React.ReactNode;
  className?: string;
  options: string[];
  selected: Set<string>;
  onSelectedChange: (next: Set<string>) => void;
  formatOption?: (value: string) => string;
}) {
  const isActive = selected.size > 0;

  return (
    <TableHead className={cn("text-xs font-medium text-muted-foreground", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex w-full items-start gap-1 whitespace-normal leading-snug text-left hover:text-foreground"
          >
            <span>{label}</span>
            <ListFilter
              className={cn(
                "h-3.5 w-3.5 shrink-0 mt-0.5",
                isActive ? "text-primary opacity-100" : "opacity-60"
              )}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto w-56">
          <DropdownMenuLabel className="text-xs">Фильтр</DropdownMenuLabel>
          <DropdownMenuItem
            className="text-xs"
            onSelect={(e) => {
              e.preventDefault();
              onSelectedChange(new Set(options));
            }}
          >
            Выбрать все
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-xs"
            onSelect={(e) => {
              e.preventDefault();
              onSelectedChange(new Set());
            }}
          >
            Сбросить
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option}
              className="text-xs"
              checked={selected.size === 0 || selected.has(option)}
              onCheckedChange={(checked) => {
                if (selected.size === 0) {
                  const all = new Set(options);
                  all.delete(option);
                  onSelectedChange(checked ? new Set(options) : all);
                  return;
                }
                onSelectedChange(toggleSetValue(selected, option, checked === true));
              }}
              onSelect={(e) => e.preventDefault()}
            >
              {formatOption(option)}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </TableHead>
  );
}

function ColumnSearchHead({
  label,
  className,
  value,
  onChange,
  placeholder = "Поиск...",
}: {
  label: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const isActive = value.trim().length > 0;

  return (
    <TableHead className={cn("text-xs font-medium text-muted-foreground", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex w-full items-start gap-1 whitespace-normal leading-snug text-left hover:text-foreground"
          >
            <span>{label}</span>
            <Search
              className={cn(
                "h-3.5 w-3.5 shrink-0 mt-0.5",
                isActive ? "text-primary opacity-100" : "opacity-60"
              )}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-56 p-2"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuLabel className="text-xs">Поиск</DropdownMenuLabel>
          <div className="relative px-1 pb-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="h-8 pl-8 text-xs"
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
          {isActive && (
            <DropdownMenuItem
              className="text-xs"
              onSelect={(e) => {
                e.preventDefault();
                onChange("");
              }}
            >
              Сбросить
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </TableHead>
  );
}

function getPlanStatusVariant(
  status: PlanStatus
): "approved" | "waiting" | "pending" | "rejected" {
  if (status === "plan-approved") return "approved";
  if (status === "plan-pending-approval") return "pending";
  if (status === "plan-rejected") return "rejected";
  return "waiting";
}

function getFactStatusVariant(
  status: FactStatus
): "approved" | "waiting" | "pending" | "rejected" {
  if (status === "fact-approved") return "approved";
  if (status === "fact-pending-approval") return "pending";
  if (status === "fact-rejected") return "rejected";
  return "waiting";
}

function StatusBadge({
  label,
  variant,
}: {
  label: string;
  variant: "approved" | "waiting" | "pending" | "rejected";
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs whitespace-normal">
      <span
        className={cn(
          "h-2 w-2 shrink-0 rounded-full",
          variant === "approved" && "bg-green-500",
          variant === "pending" && "bg-amber-500",
          variant === "rejected" && "bg-red-500",
          variant === "waiting" && "bg-muted-foreground/40"
        )}
        aria-hidden
      />
      {label}
    </span>
  );
}

function StatusApprovalActions({
  onApprove,
  onReject,
  approveLabel,
  rejectLabel,
}: {
  onApprove: () => void;
  onReject: () => void;
  approveLabel: string;
  rejectLabel: string;
}) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-green-600 hover:bg-green-50 hover:text-green-700"
        onClick={onApprove}
        aria-label={approveLabel}
      >
        <Check className="h-4 w-4 stroke-[2.5]" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={onReject}
        aria-label={rejectLabel}
      >
        <X className="h-4 w-4 stroke-[2.5]" />
      </Button>
    </div>
  );
}

const ALL_PLAN_STATUSES: PlanStatus[] = [
  "plan-approved",
  "plan-waiting",
  "plan-pending-approval",
  "plan-rejected",
];

const ALL_FACT_STATUSES: FactStatus[] = [
  "fact-approved",
  "fact-waiting",
  "fact-pending-approval",
  "fact-rejected",
];

export function PfkTableTab() {
  const [tableData, setTableData] = useState<PfkRecord[]>(() =>
    MOCK_PFK_TABLE.map((r) => ({ ...r }))
  );
  const [isEditSession, setIsEditSession] = useState(false);
  const [editDraft, setEditDraft] = useState<PfkRecord[] | null>(null);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionComment, setRejectionComment] = useState("");
  const [pendingRejection, setPendingRejection] = useState<{
    recordId: string;
    statusType: "plan" | "fact";
  } | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [fullView, setFullView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [kpiIdSearch, setKpiIdSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [detailingSearch, setDetailingSearch] = useState("");
  const [unitFilter, setUnitFilter] = useState<Set<string>>(new Set());
  const [periodFilter, setPeriodFilter] = useState<Set<string>>(new Set());
  const [zoneFilter, setZoneFilter] = useState<Set<string>>(new Set());
  const [planStatusFilter, setPlanStatusFilter] = useState<Set<string>>(new Set());
  const [factStatusFilter, setFactStatusFilter] = useState<Set<string>>(new Set());

  const activeData = isEditSession && editDraft ? editDraft : tableData;

  const uniqueFilterOptions = useMemo(
    () => ({
      units: [...new Set(activeData.map((r) => r.unit))].sort(),
      periods: [...new Set(activeData.map((r) => r.period))].sort(),
      zones: [...new Set(activeData.map((r) => r.responsibilityZone))].sort(),
      planStatuses: ALL_PLAN_STATUSES.map((s) => ({
        value: s,
        label: PLAN_STATUS_LABELS[s],
      })),
      factStatuses: ALL_FACT_STATUSES.map((s) => ({
        value: s,
        label: FACT_STATUS_LABELS[s],
      })),
    }),
    [activeData]
  );

  const filteredData = useMemo(() => {
    const idQuery = kpiIdSearch.trim().toLowerCase();
    const nameQuery = nameSearch.trim().toLowerCase();
    const detailingQuery = detailingSearch.trim().toLowerCase();

    return activeData.filter((record) => {
      if (unitFilter.size > 0 && !unitFilter.has(record.unit)) return false;
      if (periodFilter.size > 0 && !periodFilter.has(record.period)) return false;
      if (zoneFilter.size > 0 && !zoneFilter.has(record.responsibilityZone)) return false;
      if (planStatusFilter.size > 0 && !planStatusFilter.has(record.planStatus)) return false;
      if (factStatusFilter.size > 0 && !factStatusFilter.has(record.factStatus)) return false;
      if (idQuery && !record.kpiId.toLowerCase().includes(idQuery)) return false;
      if (nameQuery && !record.name.toLowerCase().includes(nameQuery)) return false;
      if (detailingQuery && !record.detailing.toLowerCase().includes(detailingQuery)) return false;
      return true;
    });
  }, [
    unitFilter,
    periodFilter,
    zoneFilter,
    planStatusFilter,
    factStatusFilter,
    kpiIdSearch,
    nameSearch,
    detailingSearch,
    activeData,
  ]);

  const startEditSession = () => {
    setEditDraft(tableData.map((r) => ({ ...r })));
    setIsEditSession(true);
  };

  const cancelEditSession = () => {
    setEditDraft(null);
    setIsEditSession(false);
  };

  const updateDraftField = (
    id: string,
    field: "plan" | "baseCrit" | "fact",
    value: string
  ) => {
    setEditDraft((prev) =>
      prev
        ? prev.map((row) =>
            row.id === id
              ? { ...row, [field]: value.trim() === "" ? null : value }
              : row
          )
        : null
    );
  };

  const updateDraftPlanStatus = (id: string) => {
    setEditDraft((prev) =>
      prev
        ? prev.map((row) =>
            row.id === id ? { ...row, planStatus: "plan-approved" } : row
          )
        : null
    );
  };

  const updateDraftFactStatus = (id: string) => {
    setEditDraft((prev) =>
      prev
        ? prev.map((row) =>
            row.id === id ? { ...row, factStatus: "fact-approved" } : row
          )
        : null
    );
  };

  const openRejectionDialog = (
    recordId: string,
    statusType: "plan" | "fact"
  ) => {
    setPendingRejection({ recordId, statusType });
    setRejectionComment("");
    setRejectionDialogOpen(true);
  };

  const closeRejectionDialog = () => {
    setRejectionDialogOpen(false);
    setPendingRejection(null);
    setRejectionComment("");
  };

  const submitRejection = () => {
    if (!pendingRejection || !rejectionComment.trim()) return;

    const { recordId, statusType } = pendingRejection;
    const comment = rejectionComment.trim();

    setEditDraft((prev) =>
      prev
        ? prev.map((row) => {
            if (row.id !== recordId) return row;
            if (statusType === "plan") {
              return {
                ...row,
                planStatus: "plan-rejected",
                planRejectionComment: comment,
              };
            }
            return {
              ...row,
              factStatus: "fact-rejected",
              factRejectionComment: comment,
            };
          })
        : null
    );

    closeRejectionDialog();
  };

  const saveEditSession = () => {
    if (!editDraft) return;

    setTableData((prev) =>
      prev.map((original) => {
        const draft = editDraft.find((r) => r.id === original.id);
        if (!draft) return original;

        const planValue = draft.plan?.trim() ?? "";
        const factValue = draft.fact?.trim() ?? "";

        let planStatus = draft.planStatus;
        let factStatus = draft.factStatus;

        if (planStatus === "plan-waiting" && planValue !== "") {
          planStatus = "plan-pending-approval";
        }

        if (factStatus === "fact-waiting" && factValue !== "") {
          factStatus = "fact-pending-approval";
        }

        return {
          ...draft,
          planStatus,
          factStatus,
        };
      })
    );

    setEditDraft(null);
    setIsEditSession(false);
  };

  const totalRecords = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));
  const effectivePage = Math.min(currentPage, totalPages);
  const startIndex = (effectivePage - 1) * itemsPerPage;
  const pageData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const paginationItems = useMemo(
    () => getPaginationItems(effectivePage, totalPages),
    [effectivePage, totalPages]
  );

  const allPageSelected =
    pageData.length > 0 && pageData.every((r) => selectedIds.has(r.id));

  const toggleAllPage = (checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      pageData.forEach((r) => {
        if (checked) next.add(r.id);
        else next.delete(r.id);
      });
      return next;
    });
  };

  const toggleRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const formatValue = (value: string | null) => (value == null || value === "" ? "—" : value);

  return (
    <>
    <Card className="border shadow-sm">
      <CardContent className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-semibold">Таблица ПФК</h2>
              <GoalsSectionHelpButton sectionId="pfk-table" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1 text-xs font-normal">
                  Действия с КПЭ
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Согласовать план</DropdownMenuItem>
                <DropdownMenuItem>Согласовать факт</DropdownMenuItem>
                <DropdownMenuItem>Отклонить выбранные</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
              <Checkbox
                checked={fullView}
                onCheckedChange={(v) => setFullView(v === true)}
              />
              Полный вид
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Upload className="h-4 w-4" />
              Экспорт/Импорт
            </Button>
            {isEditSession ? (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={saveEditSession}
                >
                  Сохранить
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={cancelEditSession}
                >
                  Закрыть
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Switch
                  id="pfk-edit-mode"
                  checked={false}
                  onCheckedChange={(checked) => {
                    if (checked) startEditSession();
                  }}
                />
                <Label
                  htmlFor="pfk-edit-mode"
                  className="text-xs font-normal cursor-pointer"
                >
                  Режим редактирования
                </Label>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className={cn("table-fixed min-w-[1460px]", fullView && "min-w-[1740px]")}>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 border-b">
                <TableHead className="w-10 pl-4">
                  <Checkbox
                    checked={allPageSelected}
                    onCheckedChange={(v) => toggleAllPage(v === true)}
                    aria-label="Выбрать все на странице"
                  />
                </TableHead>
                <ColumnSearchHead
                  className="w-[100px]"
                  label="ID КПЭ"
                  value={kpiIdSearch}
                  onChange={(v) => {
                    setKpiIdSearch(v);
                    setCurrentPage(1);
                  }}
                  placeholder="Поиск по ID..."
                />
                <ColumnSearchHead
                  className="w-[200px]"
                  label="Наименование КПЭ"
                  value={nameSearch}
                  onChange={(v) => {
                    setNameSearch(v);
                    setCurrentPage(1);
                  }}
                  placeholder="Поиск..."
                />
                <ColumnFilterHead
                  className="w-[72px]"
                  label="Ед. изм."
                  options={uniqueFilterOptions.units}
                  selected={unitFilter}
                  onSelectedChange={(next) => {
                    setUnitFilter(next);
                    setCurrentPage(1);
                  }}
                />
                <ColumnFilterHead
                  className="w-[90px]"
                  label="Период оценки"
                  options={uniqueFilterOptions.periods}
                  selected={periodFilter}
                  onSelectedChange={(next) => {
                    setPeriodFilter(next);
                    setCurrentPage(1);
                  }}
                />
                <ColumnFilterHead
                  className="w-[100px] min-w-[100px]"
                  label={
                    <span className="leading-tight">
                      Зона
                      <br />
                      ответственности
                    </span>
                  }
                  options={uniqueFilterOptions.zones}
                  selected={zoneFilter}
                  onSelectedChange={(next) => {
                    setZoneFilter(next);
                    setCurrentPage(1);
                  }}
                />
                <ColumnSearchHead
                  className="w-[130px] min-w-[130px]"
                  label="Детализация"
                  value={detailingSearch}
                  onChange={(v) => {
                    setDetailingSearch(v);
                    setCurrentPage(1);
                  }}
                  placeholder="Поиск..."
                />
                <TableHead className="w-[80px] text-xs font-medium text-muted-foreground">
                  План
                </TableHead>
                <TableHead className="w-[90px] text-xs font-medium text-muted-foreground">
                  <span className="whitespace-normal leading-snug">
                    База/Крит.откл
                  </span>
                </TableHead>
                <ColumnFilterHead
                  className="w-[130px]"
                  label="Статус План"
                  options={uniqueFilterOptions.planStatuses.map((s) => s.value)}
                  selected={planStatusFilter}
                  onSelectedChange={(next) => {
                    setPlanStatusFilter(next);
                    setCurrentPage(1);
                  }}
                  formatOption={(v) =>
                    PLAN_STATUS_LABELS[v as PlanStatus] ?? v
                  }
                />
                <TableHead className="w-[72px] text-xs font-medium text-muted-foreground">
                  Факт
                </TableHead>
                <ColumnFilterHead
                  className="w-[130px]"
                  label="Статус Факт"
                  options={uniqueFilterOptions.factStatuses.map((s) => s.value)}
                  selected={factStatusFilter}
                  onSelectedChange={(next) => {
                    setFactStatusFilter(next);
                    setCurrentPage(1);
                  }}
                  formatOption={(v) =>
                    FACT_STATUS_LABELS[v as FactStatus] ?? v
                  }
                />
                <TableHead className="w-[100px] text-xs font-medium text-muted-foreground">
                  <span className="whitespace-normal leading-snug">
                    Знач. выпол. КПЭ
                  </span>
                </TableHead>
                <TableHead className="w-[72px] text-xs font-medium text-muted-foreground text-center pr-4">
                  Действие
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={14}
                    className="py-10 text-center text-muted-foreground text-sm"
                  >
                    Нет записей по выбранным фильтрам
                  </TableCell>
                </TableRow>
              ) : (
                pageData.map((record) => (
                  <TableRow key={record.id} className="hover:bg-muted/20">
                    <TableCell className="pl-4">
                      <Checkbox
                        checked={selectedIds.has(record.id)}
                        onCheckedChange={(v) => toggleRow(record.id, v === true)}
                        aria-label={`Выбрать ${record.name}`}
                      />
                    </TableCell>
                    <TableCell className={cn("w-[100px] font-mono text-xs", wrapCell)}>
                      {record.kpiId}
                    </TableCell>
                    <TableCell className={cn("w-[200px]", wrapCell)}>
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 hover:underline text-left whitespace-normal"
                      >
                        {record.name}
                      </button>
                    </TableCell>
                    <TableCell className={cn("w-[72px]", wrapCell)}>{record.unit}</TableCell>
                    <TableCell className={cn("w-[90px]", wrapCell)}>{record.period}</TableCell>
                    <TableCell className={cn("w-[100px] min-w-[100px]", wrapCell)}>
                      {record.responsibilityZone}
                    </TableCell>
                    <TableCell className={cn("w-[130px] min-w-[130px]", wrapCell)}>
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 hover:underline text-left whitespace-normal"
                      >
                        {record.detailing}
                      </button>
                    </TableCell>
                    <TableCell className={cn("w-[80px]", wrapCell)}>
                      {isEditSession ? (
                        <Input
                          value={record.plan ?? ""}
                          onChange={(e) =>
                            updateDraftField(record.id, "plan", e.target.value)
                          }
                          className="h-7 text-xs bg-background"
                        />
                      ) : (
                        formatValue(record.plan)
                      )}
                    </TableCell>
                    <TableCell className={cn("w-[90px]", wrapCell)}>
                      {isEditSession ? (
                        <Input
                          value={record.baseCrit ?? ""}
                          onChange={(e) =>
                            updateDraftField(record.id, "baseCrit", e.target.value)
                          }
                          className="h-7 text-xs bg-background"
                        />
                      ) : (
                        <span className="text-muted-foreground">
                          {formatValue(record.baseCrit)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className={cn("w-[130px]", wrapCell)}>
                      {isEditSession &&
                      record.planStatus === "plan-pending-approval" ? (
                        <StatusApprovalActions
                          approveLabel="Утвердить план"
                          rejectLabel="Отклонить план"
                          onApprove={() => updateDraftPlanStatus(record.id)}
                          onReject={() =>
                            openRejectionDialog(record.id, "plan")
                          }
                        />
                      ) : (
                        <StatusBadge
                          label={PLAN_STATUS_LABELS[record.planStatus]}
                          variant={getPlanStatusVariant(record.planStatus)}
                        />
                      )}
                    </TableCell>
                    <TableCell className={cn("w-[72px]", wrapCell)}>
                      {isEditSession ? (
                        <Input
                          value={record.fact ?? ""}
                          onChange={(e) =>
                            updateDraftField(record.id, "fact", e.target.value)
                          }
                          className="h-7 text-xs bg-background"
                        />
                      ) : (
                        formatValue(record.fact)
                      )}
                    </TableCell>
                    <TableCell className={cn("w-[130px]", wrapCell)}>
                      {isEditSession &&
                      record.factStatus === "fact-pending-approval" ? (
                        <StatusApprovalActions
                          approveLabel="Утвердить факт"
                          rejectLabel="Отклонить факт"
                          onApprove={() => updateDraftFactStatus(record.id)}
                          onReject={() =>
                            openRejectionDialog(record.id, "fact")
                          }
                        />
                      ) : (
                        <StatusBadge
                          label={FACT_STATUS_LABELS[record.factStatus]}
                          variant={getFactStatusVariant(record.factStatus)}
                        />
                      )}
                    </TableCell>
                    <TableCell className={cn("w-[100px]", wrapCell)}>
                      {formatValue(record.completionPercent)}
                    </TableCell>
                    <TableCell className="w-[72px] align-top py-3 pr-4">
                      <div className="flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 border-blue-200 text-blue-600 hover:bg-blue-50"
                          aria-label="Копировать"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm">
          <span className="text-muted-foreground">Всего {totalRecords}</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={effectivePage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {paginationItems.map((item, idx) =>
              item === "ellipsis" ? (
                <span key={`e-${idx}`} className="px-1 text-muted-foreground">
                  ...
                </span>
              ) : (
                <Button
                  key={item}
                  variant={item === effectivePage ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-8 w-8 text-xs",
                    item === effectivePage && "pointer-events-none"
                  )}
                  onClick={() => setCurrentPage(item)}
                >
                  {item}
                </Button>
              )
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={effectivePage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(v) => {
              setItemsPerPage(Number(v));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 / на стран</SelectItem>
              <SelectItem value="20">20 / на стран</SelectItem>
              <SelectItem value="50">50 / на стран</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <Dialog
      open={rejectionDialogOpen}
      onOpenChange={(open) => {
        if (!open) closeRejectionDialog();
      }}
    >
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Укажите причину отклонения</DialogTitle>
          <DialogDescription>
            Укажите, почему отклоняете план или факт. Комментарий обязателен для
            отправки.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="pfk-rejection-comment">
              Комментарий <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="pfk-rejection-comment"
              value={rejectionComment}
              onChange={(e) => setRejectionComment(e.target.value)}
              placeholder="Введите причину отклонения..."
              className="min-h-[120px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {rejectionComment.length} / 500 символов
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={closeRejectionDialog}>
            Закрыть
          </Button>
          <Button
            type="button"
            onClick={submitRejection}
            disabled={!rejectionComment.trim()}
            variant="destructive"
          >
            Отправить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
