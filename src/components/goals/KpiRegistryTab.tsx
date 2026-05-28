"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  History,
  ListFilter,
  Search,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { KpiCreateForm } from "@/components/goals/KpiCreateForm";
import { GoalsHelpDialog } from "@/components/goals/GoalsHelpDialog";
import {
  GoalsStatusBadge,
  GOALS_LIFECYCLE_STATUS_LABELS,
  GOALS_LIFECYCLE_STATUS_OPTIONS,
  type GoalsLifecycleStatus,
} from "@/components/goals/GoalsStatusBadge";

type KpiRegistryStatus = GoalsLifecycleStatus;

interface KpiRegistryRecord {
  id: string;
  status: KpiRegistryStatus;
  goalGroup: string;
  kpiId: string;
  name: string;
  kpiType: string;
  description: string;
  descriptionIsLink: boolean;
  responsibilityZone: string;
}

const BASE_KPI_REGISTRY: Omit<KpiRegistryRecord, "id">[] = [
  {
    status: "active",
    goalGroup: "Блок ИТ и ЦТ",
    kpiId: "N004-K0175",
    name: "15.05.2026",
    kpiType: "Функциональный",
    description: "n",
    descriptionIsLink: false,
    responsibilityZone: "Группа целеполагания ССП ВСП1",
  },
  {
    status: "draft",
    goalGroup: "Малый и средний бизнес",
    kpiId: "N003-K0146",
    name: "227 1338",
    kpiType: "Функциональный",
    description: "Описание КПЭ",
    descriptionIsLink: true,
    responsibilityZone: "Банк",
  },
  {
    status: "draft",
    goalGroup: "Малый и средний бизнес",
    kpiId: "N003-K0145",
    name: "КПЭ пипл лог тиест 6",
    kpiType: "Функциональный",
    description: "Описание КПЭ",
    descriptionIsLink: true,
    responsibilityZone: "Группа целеполагания ССП",
  },
  {
    status: "draft",
    goalGroup: "Малый и средний бизнес",
    kpiId: "N003-K0144",
    name: "14.05.2026",
    kpiType: "Функциональный",
    description: "описание аыаыа аыаыа",
    descriptionIsLink: false,
    responsibilityZone: "Группа целеполагания ССП",
  },
  {
    status: "development",
    goalGroup: "Малый и средний бизнес",
    kpiId: "N003-K0142",
    name: "КПЭ пипл лог тиест 2",
    kpiType: "Функциональный",
    description: "Описание КПЭ",
    descriptionIsLink: true,
    responsibilityZone: "Группа целеполагания ССП",
  },
  {
    status: "draft",
    goalGroup: "Малый и средний бизнес",
    kpiId: "N003-K0143",
    name: "КПЭ пипл лог тиест 5",
    kpiType: "Функциональный",
    description: "Описание КПЭ",
    descriptionIsLink: true,
    responsibilityZone: "Банк",
  },
  {
    status: "active",
    goalGroup: "Блок ИТ и ЦТ",
    kpiId: "N004-K0174",
    name: "14.05.2026",
    kpiType: "Функциональный",
    description: "Описание КПЭ",
    descriptionIsLink: true,
    responsibilityZone: "Группа целеполагания ССП ВСП1",
  },
  {
    status: "development-alert",
    goalGroup: "Малый и средний бизнес",
    kpiId: "N003-K0141",
    name: "КПЭ на согласовании",
    kpiType: "Функциональный",
    description: "Описание КПЭ",
    descriptionIsLink: true,
    responsibilityZone: "Группа целеполагания ССП",
  },
  {
    status: "development",
    goalGroup: "Блок ИТ и ЦТ",
    kpiId: "N004-K0173",
    name: "КПЭ стримовая метрика",
    kpiType: "Функциональный",
    description: "Описание КПЭ",
    descriptionIsLink: true,
    responsibilityZone: "Группа целеполагания ССП",
  },
];

const TOTAL_RECORDS = 182;

const MOCK_KPI_REGISTRY: KpiRegistryRecord[] = Array.from(
  { length: TOTAL_RECORDS },
  (_, i) => {
    const base = BASE_KPI_REGISTRY[i % BASE_KPI_REGISTRY.length];
    const cycle = Math.floor(i / BASE_KPI_REGISTRY.length);
    return {
      id: String(i + 1),
      ...base,
      kpiId: cycle === 0 ? base.kpiId : `${base.kpiId}-${cycle}`,
    };
  }
);

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

const UNIQUE_FILTER_OPTIONS = {
  statuses: GOALS_LIFECYCLE_STATUS_OPTIONS.map((s) => ({
    value: s,
    label: GOALS_LIFECYCLE_STATUS_LABELS[s],
  })),
  goalGroups: [...new Set(MOCK_KPI_REGISTRY.map((r) => r.goalGroup))].sort(),
  kpiTypes: [...new Set(MOCK_KPI_REGISTRY.map((r) => r.kpiType))].sort(),
};

export function KpiRegistryTab() {
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [fullView, setFullView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set());
  const [goalGroupFilter, setGoalGroupFilter] = useState<Set<string>>(new Set());
  const [kpiTypeFilter, setKpiTypeFilter] = useState<Set<string>>(new Set());
  const [kpiIdSearch, setKpiIdSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");

  const filteredData = useMemo(() => {
    const idQuery = kpiIdSearch.trim().toLowerCase();
    const nameQuery = nameSearch.trim().toLowerCase();

    return MOCK_KPI_REGISTRY.filter((record) => {
      if (statusFilter.size > 0 && !statusFilter.has(record.status)) return false;
      if (goalGroupFilter.size > 0 && !goalGroupFilter.has(record.goalGroup)) return false;
      if (kpiTypeFilter.size > 0 && !kpiTypeFilter.has(record.kpiType)) return false;
      if (idQuery && !record.kpiId.toLowerCase().includes(idQuery)) return false;
      if (nameQuery && !record.name.toLowerCase().includes(nameQuery)) return false;
      return true;
    });
  }, [statusFilter, goalGroupFilter, kpiTypeFilter, kpiIdSearch, nameSearch]);

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

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-semibold">Реестр КПЭ</h2>
              <GoalsHelpDialog section="kpi-registry" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1 text-xs font-normal">
                  Действия с КПЭ
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Копировать выбранные</DropdownMenuItem>
                <DropdownMenuItem>Архивировать выбранные</DropdownMenuItem>
                <DropdownMenuItem>Экспорт выбранных</DropdownMenuItem>
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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <Download className="h-4 w-4" />
              Экспорт
            </Button>
            <Button
              size="sm"
              className="h-8"
              onClick={() => setCreateFormOpen(true)}
            >
              + Создать
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className={cn("table-fixed min-w-[1200px]", fullView && "min-w-[1400px]")}>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 border-b">
                <TableHead className="w-10 pl-4">
                  <Checkbox
                    checked={allPageSelected}
                    onCheckedChange={(v) => toggleAllPage(v === true)}
                    aria-label="Выбрать все на странице"
                  />
                </TableHead>
                <ColumnFilterHead
                  className="w-[110px]"
                  label="Статус"
                  options={UNIQUE_FILTER_OPTIONS.statuses.map((s) => s.value)}
                  selected={statusFilter}
                  onSelectedChange={(next) => {
                    setStatusFilter(next);
                    setCurrentPage(1);
                  }}
                  formatOption={(v) =>
                    GOALS_LIFECYCLE_STATUS_LABELS[v as KpiRegistryStatus] ?? v
                  }
                />
                <ColumnFilterHead
                  className="w-[160px]"
                  label="Группа целеполагания"
                  options={UNIQUE_FILTER_OPTIONS.goalGroups}
                  selected={goalGroupFilter}
                  onSelectedChange={(next) => {
                    setGoalGroupFilter(next);
                    setCurrentPage(1);
                  }}
                />
                <ColumnSearchHead
                  className="w-[120px]"
                  label="ID КПЭ"
                  value={kpiIdSearch}
                  onChange={(v) => {
                    setKpiIdSearch(v);
                    setCurrentPage(1);
                  }}
                  placeholder="Поиск по ID..."
                />
                <ColumnSearchHead
                  className="w-[180px]"
                  label="Наименование КПЭ"
                  value={nameSearch}
                  onChange={(v) => {
                    setNameSearch(v);
                    setCurrentPage(1);
                  }}
                  placeholder="Поиск по наименованию..."
                />
                <ColumnFilterHead
                  className="w-[130px]"
                  label="Вид КПЭ"
                  options={UNIQUE_FILTER_OPTIONS.kpiTypes}
                  selected={kpiTypeFilter}
                  onSelectedChange={(next) => {
                    setKpiTypeFilter(next);
                    setCurrentPage(1);
                  }}
                />
                <TableHead className="w-[140px] text-xs font-medium text-muted-foreground">
                  <span className="whitespace-normal leading-snug">Описание КПЭ</span>
                </TableHead>
                <TableHead className="w-[200px] text-xs font-medium text-muted-foreground">
                  <span className="whitespace-normal leading-snug">Зона ответственности</span>
                </TableHead>
                <TableHead className="w-[100px] text-xs font-medium text-muted-foreground text-center pr-4">
                  Действие
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
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
                    <TableCell className={cn("w-[110px]", wrapCell)}>
                      <GoalsStatusBadge status={record.status} />
                    </TableCell>
                    <TableCell className={cn("w-[160px]", wrapCell)}>
                      {record.goalGroup}
                    </TableCell>
                    <TableCell className={cn("w-[120px] font-mono text-xs", wrapCell)}>
                      {record.kpiId}
                    </TableCell>
                    <TableCell className={cn("w-[180px]", wrapCell)}>
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 hover:underline text-left whitespace-normal"
                      >
                        {record.name}
                      </button>
                    </TableCell>
                    <TableCell className={cn("w-[130px]", wrapCell)}>
                      {record.kpiType}
                    </TableCell>
                    <TableCell className={cn("w-[140px]", wrapCell)}>
                      {record.descriptionIsLink ? (
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800 hover:underline text-left whitespace-normal"
                        >
                          {record.description}
                        </button>
                      ) : (
                        <span className="text-muted-foreground">{record.description}</span>
                      )}
                    </TableCell>
                    <TableCell className={cn("w-[200px] text-muted-foreground", wrapCell)}>
                      {record.responsibilityZone}
                    </TableCell>
                    <TableCell className="w-[100px] align-top py-3 pr-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 border-blue-200 text-blue-600 hover:bg-blue-50"
                          aria-label="История"
                        >
                          <History className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 border-red-200 text-red-600 hover:bg-red-50"
                          aria-label="Удалить"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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

      <KpiCreateForm
        open={createFormOpen}
        onOpenChange={setCreateFormOpen}
      />
    </Card>
  );
}
